from DepGuardian.common.logger import logger

from google.adk.agents import SequentialAgent
import google.genai.types as types
import json
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

async def execute(upload_file):
    """
    Takes an UploadFile from FastAPI, saves it as an artifact, and runs the agent pipeline.
    """

    # Read file bytes
    file_bytes = await upload_file.read()
    logger.info(f"Uploaded File data: {file_bytes}")

    file_name = upload_file.filename
    logger.info(f"Uploaded File name: {file_name}")

    # --- Choose a safe mime-type ---
    # Gemini cannot accept application/json for inline data.
    if file_name.endswith(".json"):
        mime_type = "text/plain"
    else:
        mime_type = upload_file.content_type or "text/plain"

    file_artifact = types.Part.from_bytes(
        data = file_bytes,
        mime_type = mime_type
    )

    try:
        # --- Save file as ADK artifact ---
        artifact_id = await artifact_service.save_artifact(
            app_name = APP_NAME,
            user_id = USER_ID,
            filename = file_name,
            artifact = file_artifact,
            session_id = SESSION_ID
        )

        logger.info(f"Uploaded file saved as artifact with version ID: {artifact_id}")

    except Exception as e:
        logger.error(f"An unexpected error occurred during Python artifact save: {e}")

    # ✅ 2. Trigger agent pipeline
    user_message = types.Content(
        role="user",
        parts=[types.Part(text=f"Process uploaded file")]
    )

    final_report = None

    async for event in runner.run_async(
        user_id=USER_ID,
        session_id=SESSION_ID,
        new_message=user_message
    ):
        # The reporter agent output goes into final_report key
        if event.is_final_response():
            response_text = event.content.parts[0].text
            try:
                final_report = json.loads(response_text)
            except json.JSONDecodeError:
                logger.warning("⚠️ Reporter output is not valid JSON. Returning raw text.")
                final_report = {"raw_output": response_text}

    return {
        "report": final_report
    }