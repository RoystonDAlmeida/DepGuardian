import unittest
from unittest.mock import patch

from DepGuardian.agents.analyzer.prompt import ANALYZER_INSTRUCTION
from DepGuardian.agents.analyzer.agent import get_analyzer_agent

class TestAnalyzerAgent(unittest.TestCase):

    @patch('DepGuardian.agents.analyzer.agent.Agent')
    def test_agent_initialization(self, mock_agent_class):
        """
        Tests that the analyzer_agent is initialized with the correct parameters.
        """
        # --- Call ---
        get_analyzer_agent()

        # --- Assertions ---
        mock_agent_class.assert_called_once_with(
            name="AnalyzerAgent",
            model="gemini-2.5-flash-lite",
            instruction=ANALYZER_INSTRUCTION,
            output_key="current_analysis",
        )

if __name__ == '__main__':
    unittest.main()
