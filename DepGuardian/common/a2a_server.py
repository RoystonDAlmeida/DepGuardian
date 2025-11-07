from fastapi import FastAPI, UploadFile, File
from contextlib import asynccontextmanager

from DepGuardian.agent import initialize_session, execute


@asynccontextmanager
async def lifespan(app: FastAPI):
    # ✅ RUN ON STARTUP
    await initialize_session()
    yield

def create_app():
    app = FastAPI(lifespan=lifespan)

    @app.on_event("startup")
    async def startup_event():
        await initialize_session()       # ✅ FIXED

    @app.post("/run")
    async def run(file: UploadFile = File(...)):
        return await execute(file)       # ✅ file input

    return app
