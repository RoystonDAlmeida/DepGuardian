from google.adk.agents import Agent
from DepGuardian.agents.reporter.prompt import REPORTER_INSTRUCTION 

# The model to use for reporting
GEMINI_MODEL = "gemini-2.5-flash"

reporter_agent = Agent(
    name="ReporterAgent",
    model=GEMINI_MODEL,
    instruction=REPORTER_INSTRUCTION,
    output_key="final_report"
)