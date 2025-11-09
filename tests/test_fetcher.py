import unittest
import asyncio
from unittest.mock import MagicMock, AsyncMock, patch

from DepGuardian.agents.fetcher.tools.set_dependencies import set_dependencies
from DepGuardian.agents.fetcher.tools.fetch_metadata import fetch_metadata

# Mock the logger to avoid errors
from DepGuardian.common.logger import logger
logger.info = MagicMock()
logger.exception = MagicMock()
logger.warning = MagicMock()
logger.error = MagicMock()

class TestFetcherAgent(unittest.TestCase):
    def test_set_dependencies_pypi(self):
        # --- Mocks ---
        mock_tool_context = MagicMock()
        mock_tool_context.state = {
            "file_content": "requests==2.25.1\n"
                            "numpy==1.21.2",
            "ecosystem": "pypi"
        }

        # --- Call ---
        result = asyncio.run(set_dependencies(mock_tool_context))

        # --- Assertions ---
        self.assertEqual(result["status"], "success")
        self.assertEqual(len(result["dependencies"]), 2)
        self.assertEqual(result["dependencies"][0]["name"], "requests")
        self.assertEqual(result["dependencies"][0]["version"], "2.25.1")
        self.assertEqual(result["dependencies"][1]["name"], "numpy")
        self.assertEqual(result["dependencies"][1]["version"], "1.21.2")

    def test_set_dependencies_npm(self):
        # --- Mocks ---
        mock_tool_context = MagicMock()
        mock_tool_context.state = {
            "file_content": '{"dependencies": {"react": "^17.0.2"}, "devDependencies": {"jest": "^27.0.6"}}',
            "ecosystem": "npm"
        }

        # --- Call ---
        result = asyncio.run(set_dependencies(mock_tool_context))

        # --- Assertions ---
        self.assertEqual(result["status"], "success")
        self.assertEqual(len(result["dependencies"]), 2)
        self.assertEqual(result["dependencies"][0]["name"], "react")
        self.assertEqual(result["dependencies"][0]["version"], "^17.0.2")
        self.assertEqual(result["dependencies"][1]["name"], "jest")
        self.assertEqual(result["dependencies"][1]["version"], "^27.0.6")

    @patch('DepGuardian.agents.fetcher.tools.fetch_metadata.httpx.AsyncClient')
    def test_fetch_metadata_pypi(self, mock_async_client):
        # --- Mocks ---
        mock_tool_context = MagicMock()
        mock_tool_context.state = {
            "dependencies": [{"name": "requests", "version": "2.25.1"}],
            "ecosystem": "pypi"
        }

        # Mock the async client's get method
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = {"info": {"name": "requests"}}

        mock_async_client.return_value.__aenter__.return_value.get = AsyncMock(return_value=mock_response)

        # --- Call ---
        with patch('DepGuardian.agents.fetcher.tools.fetch_metadata.fetch_pypi_download_stats', new=AsyncMock(return_value={"last_day": 100})):
            result = asyncio.run(fetch_metadata(mock_tool_context))

        # --- Assertions ---
        self.assertEqual(result["status"], "success")
        self.assertEqual(len(mock_tool_context.state["dependencies_metadata"]), 1)
        self.assertEqual(mock_tool_context.state["dependencies_metadata"][0]["name"], "requests")

    @patch('DepGuardian.agents.fetcher.tools.fetch_metadata.httpx.AsyncClient')
    def test_fetch_metadata_npm(self, mock_async_client):
        # --- Mocks ---
        mock_tool_context = MagicMock()
        mock_tool_context.state = {
            "dependencies": [{"name": "react", "version": "^17.0.2"}],
            "ecosystem": "npm"
        }

        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = {"name": "react", "versions": {"17.0.2": {}}}

        mock_async_client.return_value.__aenter__.return_value.get = AsyncMock(return_value=mock_response)

        # --- Call ---
        with patch('DepGuardian.agents.fetcher.tools.fetch_metadata.fetch_npm_download_stats', new=AsyncMock(return_value={"last_day": 1000})):
            result = asyncio.run(fetch_metadata(mock_tool_context))

        # --- Assertions ---
        self.assertEqual(result["status"], "success")
        self.assertEqual(len(mock_tool_context.state["dependencies_metadata"]), 1)
        self.assertEqual(mock_tool_context.state["dependencies_metadata"][0]["name"], "react")

if __name__ == '__main__':
    unittest.main()