import unittest
import asyncio
from unittest.mock import MagicMock, AsyncMock

from DepGuardian.agents.parser.tools.read_uploaded_file import read_uploaded_file

# Mock the logger to avoid errors
from DepGuardian.common.logger import logger
logger.info = MagicMock()
logger.exception = MagicMock()

class TestParserAgent(unittest.TestCase):
    """Pytest looks for Test* class when executed" Methods prefixed with test_ will be executed"""
    def test_read_requirements_txt(self):
        # --- Mocks ---
        mock_tool_context = MagicMock()
        mock_tool_context.state = {}
        mock_tool_context.list_artifacts = AsyncMock(return_value=["requirements.txt"])

        mock_artifact = MagicMock()
        mock_artifact.inline_data.mime_type = "text/plain"
        mock_artifact.inline_data.data = b"requests==2.25.1\n"
        mock_tool_context.load_artifact = AsyncMock(return_value=mock_artifact)

        # --- Call ---
        result = asyncio.run(read_uploaded_file(mock_tool_context))

        # --- Assertions ---
        self.assertEqual(result["status"], "success")
        self.assertEqual(mock_tool_context.state["ecosystem"], "pypi")
        self.assertIn("requests==2.25.1", mock_tool_context.state["file_content"])

    def test_read_package_json(self):
        # --- Mocks ---
        mock_tool_context = MagicMock()
        mock_tool_context.state = {}
        mock_tool_context.list_artifacts = AsyncMock(return_value=["package.json"])

        mock_artifact = MagicMock()
        mock_artifact.inline_data.mime_type = "application/json"
        mock_artifact.inline_data.data = b'{"dependencies": {"react": "^17.0.2"}}'
        mock_tool_context.load_artifact = AsyncMock(return_value=mock_artifact)

        # --- Call ---
        result = asyncio.run(read_uploaded_file(mock_tool_context))

        # --- Assertions ---
        self.assertEqual(result["status"], "success")
        self.assertEqual(mock_tool_context.state["ecosystem"], "npm")
        self.assertIn('"react": "^17.0.2"', mock_tool_context.state["file_content"])

    def test_no_artifacts(self):
        # --- Mocks ---
        mock_tool_context = MagicMock()
        mock_tool_context.list_artifacts = AsyncMock(return_value=[])

        # --- Call ---
        result = asyncio.run(read_uploaded_file(mock_tool_context))

        # --- Assertions ---
        self.assertEqual(result["status"], "no_artifacts")

    def test_invalid_json(self):
        # --- Mocks ---
        mock_tool_context = MagicMock()
        mock_tool_context.state = {}
        mock_tool_context.list_artifacts = AsyncMock(return_value=["package.json"])

        mock_artifact = MagicMock()
        mock_artifact.inline_data.mime_type = "application/json"
        mock_artifact.inline_data.data = b'{"dependencies": {"react": "^17.0.2"}' # Invalid JSON
        mock_tool_context.load_artifact = AsyncMock(return_value=mock_artifact)
        mock_tool_context.set_state = AsyncMock()

        # --- Call ---
        result = asyncio.run(read_uploaded_file(mock_tool_context))

        # --- Assertions ---
        self.assertIn("Invalid JSON", result["message"])
        # Ensure set_state was called for invalid JSON
        mock_tool_context.set_state.assert_called_once()

if __name__ == '__main__':
    unittest.main()