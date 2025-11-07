from DepGuardian.common.a2a_server import create_app
from DepGuardian.task_manager import run

# Create a FastAPI app instance
app = create_app()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, port=8000)