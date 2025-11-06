import logging
from google.adk.agents import Agent
from DepGuardian.agents.analyzer.prompt import ANALYZER_INSTRUCTION

# Configure a logger for this agent
logger = logging.getLogger(__name__)

# The model to use for analysis
GEMINI_MODEL = "gemini-2.5-flash-lite"

# Define the LLM-powered analyzer agent
analyzer_agent = Agent(
    name="AnalyzerAgent",
    model=GEMINI_MODEL,
    instruction=ANALYZER_INSTRUCTION, 
    output_key="current_analysis",
)