import unittest
from unittest.mock import patch

from DepGuardian.agents.reporter.prompt import REPORTER_INSTRUCTION
from DepGuardian.agents.reporter.agent import get_reporter_agent

class TestReporterAgent(unittest.TestCase):

    @patch('DepGuardian.agents.reporter.agent.Agent')
    def test_agent_initialization(self, mock_agent_class):
        """
        Tests that the reporter_agent is initialized with the correct parameters.
        """
        # --- Call ---
        get_reporter_agent()

        # --- Assertions ---
        mock_agent_class.assert_called_once_with(
            name="ReporterAgent",
            model="gemini-2.5-flash",
            instruction=REPORTER_INSTRUCTION,
            output_key="final_report"
        )

if __name__ == '__main__':
    unittest.main()
