from fastapi import FastAPI, UploadFile, File
from contextlib import asynccontextmanager

from DepGuardian.agent import initialize_session, execute, artifact_service, APP_NAME, USER_ID, SESSION_ID


@asynccontextmanager
async def lifespan(app: FastAPI):
    # ✅ RUN ON STARTUP
    await initialize_session()
    yield

def create_app():
    app = FastAPI(lifespan=lifespan)

    @app.post("/run")
    async def run(file: UploadFile = File(...)):
        return await execute(file)       # ✅ file input

    @app.get("/artifacts")
    async def list_artifacts():
        """Return list of stored artifacts for the current session."""
        artifacts = await artifact_service.list_artifact_keys(app_name=APP_NAME, user_id = USER_ID, session_id=SESSION_ID)
        return {"artifacts": artifacts}

    return app
