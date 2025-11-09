from google.adk.tools.tool_context import ToolContext
from typing import Dict, Union
import json
from DepGuardian.common.logger import logger

async def read_uploaded_file(tool_context: ToolContext) -> Dict[str, Union[str, Dict]]:
    """
    Reads the most recently uploaded text or JSON file and stores its content in session state.
    """
    try:
        artifact_ids = await tool_context.list_artifacts()
        logger.info(f"Found {len(artifact_ids)} artifacts: {artifact_ids}")

        if not artifact_ids:
            return {"status": "no_artifacts", "message": "No files uploaded yet."}

        # Load most recent artifact
        artifact_id = artifact_ids[-1]
        artifact = await tool_context.load_artifact(artifact_id)
        logger.info(f"Loaded artifact: {artifact}")

        file_name = artifact_id     # Since, artifact_id contains the file name
        mime_type = artifact.inline_data.mime_type
        file_bytes = artifact.inline_data.data
        
        # Always treat uploaded JSON as text/plain for Gemini
        decoded = file_bytes.decode("utf-8")

        logger.info(f"Loaded file: {file_name} ({mime_type})")

        # Handle file types
        if file_name.endswith(".json"):
            try:
                parsed_data = json.loads(decoded)

                # Set state variables for file_content and the ecosystem
                tool_context.state["file_content"] = json.dumps(parsed_data, indent=2)
                tool_context.state["ecosystem"] = "npm"

                summary = f"JSON file '{file_name}' loaded with {len(parsed_data)} top-level keys."
            except json.JSONDecodeError:
                summary = f"Invalid JSON format in {file_name}."
                await tool_context.set_state("file_content", decoded)
        else:
            tool_context.state["file_content"] = decoded
            tool_context.state["ecosystem"] = "pypi"

            summary = f"Text file '{file_name}' loaded. Length: {len(decoded)} characters."

        return {"status": "success", "message": summary, "filename": file_name}

    except Exception as e:
        err = f"Error in read_uploaded_file: {e}"
        logger.exception(err)
        return {"status": "error", "message": err}