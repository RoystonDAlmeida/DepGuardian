from DepGuardian.common.logger import logger

from google.adk.agents import SequentialAgent
import google.genai.types as types
import json
from typing import AsyncGenerator, Tuple
from google.adk.apps import App
from google.adk.artifacts import InMemoryArtifactService
from google.adk.sessions import InMemorySessionService
from google.adk.runners import Runner
from google.adk.plugins.save_files_as_artifacts_plugin import SaveFilesAsArtifactsPlugin
from DepGuardian.agents.parser.agent import parser_agent
from DepGuardian.agents.fetcher.agent import fetcher_agent
from DepGuardian.agents.analyzer.agent import analyzer_agent
from DepGuardian.agents.reporter.agent import reporter_agent

# ---- Config ---
APP_NAME = "DepGuardian"
USER_ID = "test_depguardian"
SESSION_ID = "session_depguardian"

# --- Setup services ---
artifact_service = InMemoryArtifactService()
session_service = InMemorySessionService()

# --- Define sequential pipeline ---
root_agent = SequentialAgent(
    name="DepGuardianPipeline",
    description="Sequential agent that conducts dependency analysis from uploaded artifacts",
    sub_agents=[parser_agent, fetcher_agent, analyzer_agent, reporter_agent],
)

# --- Build app ---
app = App(
    name=APP_NAME,
    root_agent=root_agent,
    plugins=[SaveFilesAsArtifactsPlugin()],
)

# --- Runner ---
runner = Runner(
    agent=root_agent,
    app_name=APP_NAME,
    session_service=session_service,
    artifact_service=artifact_service,
)

async def initialize_session():
    """Initialize session only when FastAPI starts."""

    await session_service.create_session(
        app_name=APP_NAME,
        session_id=SESSION_ID,
        user_id=USER_ID,
    )
async def _save_upload_as_artifact(file_bytes: bytes, file_name: str, content_type: str) -> None:
    """
    Save uploaded file as an artifact for the current session.
    Google ADK-compatible signature.
    """

    logger.info(f"Uploaded File name: {file_name}")
    logger.info(f"Uploaded File size: {len(file_bytes)} bytes")

    # Gemini cannot accept application/json bodies reliably. Use text/plain.
    if file_name.endswith(".json"):
        mimetype = "text/plain"
    else:
        mimetype = content_type or "text/plain"

    file_artifact = types.Part.from_bytes(
        data=file_bytes,
        mime_type=mimetype
    )

    try:
        artifact_id = await artifact_service.save_artifact(
            app_name=APP_NAME,
            user_id=USER_ID,
            filename=file_name,
            artifact=file_artifact,
            session_id=SESSION_ID,
        )
        logger.info(f"Saved artifact id: {artifact_id}")
    except Exception as e:
        logger.error(f"Artifact save failed: {e}")


async def execute_bytes(bytes_data, filename, content_type):
    """
    ✅ Safe version replacing execute(upload_file)
    """

    # Save uploaded file as an artifact
    await _save_upload_as_artifact(bytes_data, filename, content_type)

    # Initialise a user message to start the agents pipeline
    user_message = types.Content(
        role="user",
        parts=[types.Part(text="Process uploaded file")]
    )

    async for event in runner.run_async(
        user_id=USER_ID,
        session_id=SESSION_ID,
        new_message=user_message
    ):
        name = getattr(event, "agent_name", None) or getattr(event, "author", None)

        if name:
            yield ("step", name)

        if event.is_final_response() and getattr(event, "author", None) == "ReporterAgent":
            # "ReporterAgent" emits the final report response
            text = event.content.parts[0].text if event.content.parts else ""

            try:
                json_data = json.loads(text)
            except:
                json_data = {"raw_output": text}

            # Emit the final response with 'event' done
            yield ("done", json_data)
            return