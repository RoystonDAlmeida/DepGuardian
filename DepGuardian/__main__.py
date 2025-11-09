from DepGuardian.common.a2a_server import create_app
from DepGuardian.task_manager import run

# Create a FastAPI app instance
app = create_app()

if __name__ == "__main__":
    import uvicorn, os
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)