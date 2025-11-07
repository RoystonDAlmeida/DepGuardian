import logging

# -------------------------------
# Logging setup
# -------------------------------
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(levelname)s - %(name)s - %(message)s'
)
logger = logging.getLogger(__name__)

from google.adk.agents import SequentialAgent
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
APP_NAME = "test_agent"
USER_ID = "test_user"
SESSION_ID = "12345"

# --- Setup services ---
artifact_service = InMemoryArtifactService()
session_service = InMemorySessionService()

session_service.create_session(
    app_name=APP_NAME,
    session_id=SESSION_ID,
    user_id=USER_ID,
)

# --- Define sequential pipeline ---
root_agent = SequentialAgent(
    name="DepGuardianPipeline",
    description="Sequential agent that conducts dependency analysis from uploaded artifacts",
    sub_agents=[parser_agent, fetcher_agent, analyzer_agent, reporter_agent],
)

# --- Build app ---
app = App(
    name="DepGuardian",
    root_agent=root_agent,
    plugins=[SaveFilesAsArtifactsPlugin()],
)

# --- Runner ---
runner = Runner(
    agent=root_agent,
    app_name="DepGuardian",
    session_service=session_service,
    artifact_service=artifact_service,
)
