from google.adk import Agent
from DepGuardian.agents.fetcher.tools.fetch_metadata import fetch_metadata
from DepGuardian.agents.fetcher.tools.set_dependencies import set_dependencies

fetcher_agent = Agent(
    name="fetcher_agent",
    model="gemini-2.0-flash",
    instruction=(
        "Create a 'dependencies' state variable by invoking the tool 'set_dependencies"
        "Then call the tool 'fetch_metadata' to fetch dependency metadata and "
        "set the 'dependencies_metadata' state variable."
    ),
    tools=[set_dependencies, fetch_metadata],
)