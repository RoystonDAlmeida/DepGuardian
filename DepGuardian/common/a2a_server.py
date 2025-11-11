# DepGuardian/common/a2a_server.py
import asyncio
import json
import os
from contextlib import asynccontextmanager
from typing import AsyncGenerator, Dict

from dotenv import load_dotenv
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from sse_starlette.sse import EventSourceResponse

from DepGuardian.agent import (
    initialize_session,
    execute_bytes,
    artifact_service,
    APP_NAME,
    USER_ID,
    SESSION_ID,
)
from DepGuardian.common.logger import logger

# Load env
ENV_DIR = os.path.dirname(os.path.dirname(__file__))
load_dotenv(dotenv_path=os.path.join(ENV_DIR, ".env"))

# In-memory event bus keyed by session_id
_event_bus: Dict[str, asyncio.Queue] = {}
_EVENT_TIMEOUT_SECS = 25  # keep alive window for Safari/iOS


def _get_queue(session_id: str) -> asyncio.Queue:
    q = _event_bus.get(session_id)
    if q is None:
        q = asyncio.Queue()
        _event_bus[session_id] = q
    return q


@asynccontextmanager
async def lifespan(app: FastAPI):
    await initialize_session()
    yield


def create_app() -> FastAPI:
    app = FastAPI(lifespan=lifespan)

    frontend = os.getenv("FRONTEND_URL", "http://localhost:8080")
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[frontend],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
        expose_headers=["*"],
    )


    @app.get("/artifacts")
    async def list_artifacts():
        """Return list of stored artifacts for the current session."""
        artifacts = await artifact_service.list_artifact_keys(app_name=APP_NAME, user_id = USER_ID, session_id=SESSION_ID)

        return {"artifacts": artifacts}
    # ---------------------------
    # Endpoint: POST /run
    # Accepts a file, triggers pipeline, pushes step/done/error events to the queue
    # ---------------------------
    @app.post("/run")
    async def run(file: UploadFile = File(...)):
        """
        Accept file upload, start pipeline, push step/done events onto the queue.
        Returns 200 immediately. Client consumes /stream for progress and final JSON.
        """
        queue = _get_queue(SESSION_ID)

        file_bytes = await file.read()
        filename = file.filename
        content_type = file.content_type

        async def _runner():
            try:
                async for ev in execute_bytes(file_bytes, filename, content_type):
                    kind, payload = ev
                    if kind == "step":
                        await queue.put({"event": "step", "data": str(payload)})
                    elif kind == "done":
                        await queue.put({"event": "done", "data": json.dumps(payload)})
                    elif kind == "error":
                        await queue.put({"event": "error", "data": json.dumps({"message": str(payload)})})
                        break
            except Exception as e:
                # Catch RESOURCE_EXHAUSTED or other errors
                error_msg = str(e)
                logger.error(f"Pipeline failed: {error_msg}")

                # Push error event to the queue for frontend
                await queue.put({
                    "event": "error",
                    "data": json.dumps({
                        "message": "Processing failed. Resource limits reached. Try again later.",
                        "details": error_msg
                    })
                })

        # Run the runner in the background
        asyncio.create_task(_runner())

        # Return immediately; frontend will consume /stream for progress
        return {"status": "accepted"}

    # ---------------------------
    # Endpoint: GET /stream
    # SSE endpoint: emits step/done/error events to frontend
    # ---------------------------
    @app.get("/stream")
    async def stream() -> EventSourceResponse:
        """
        Server-Sent Events endpoint. Emits "step" events and one "done" event.
        """
        queue = _get_queue(SESSION_ID)

        async def event_generator() -> AsyncGenerator[dict, None]:
            while True:
                try:
                    # Wait for the item in the queue
                    item = await asyncio.wait_for(queue.get(), timeout=_EVENT_TIMEOUT_SECS)
                except asyncio.TimeoutError:
                    # sse_starlette will send its own ping. Yield nothing to keep connection alive.
                    continue

                # item must only contain "event" and "data"
                if not isinstance(item, dict):
                    continue
                ev = item.get("event")
                data = item.get("data")

                if ev == "step":
                    yield {"event": "step", "data": data}
                elif ev == "done":
                    yield {"event": "done", "data": data}
                    break  # close after final report
                elif ev == "error":
                    yield {"event": "error", "data": data}
                    break

        return EventSourceResponse(event_generator())

    return app
