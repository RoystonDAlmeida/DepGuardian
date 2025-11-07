import logging
from google.adk.agents import Agent
from DepGuardian.agents.parser.tools.read_uploaded_file import read_uploaded_file

# Configure a logger for this agent
logger = logging.getLogger(__name__)

# Define the LLM-powered parser agent
parser_agent = Agent(
    name="parser_agent",
    model="gemini-2.0-flash",
    instruction=(
        "Read and interpret the uploaded dependency file (requirements.txt or package.json). "
        "Extract all dependencies and their versions. "
        "If the file is plain text, treat it as a requirements.txt. "
        "If it's JSON, assume it's a package.json and list dependencies from 'dependencies' "
        "and 'devDependencies' sections."
        "Do this by calling the method 'read_uploaded_file'."
    ),
    tools=[read_uploaded_file],
)
