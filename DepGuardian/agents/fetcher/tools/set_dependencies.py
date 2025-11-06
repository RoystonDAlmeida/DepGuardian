from google.adk.tools.tool_context import ToolContext
from typing import Dict, Union
from DepGuardian.agent import logger

async def set_dependencies(tool_context: ToolContext) -> Dict[str, Union[str, Dict]]:
    """
    Reads the 'file_content' from session state and sets the 'dependencies' in session state.
    """

    try:
        # Get the text format file content from 'file_content' session state
        file_content_str = tool_context.state["file_content"]
        ecosystem = tool_context.state["ecosystem"]

        if not file_content_str or not ecosystem:
            msg = "Missing 'file_content' or 'ecosystem' in state."
            logger.error(msg)
            return {"status": "error", "message": msg}

        logger.info(f"Parsing dependencies from file_content.")

        dependencies = []
        if ecosystem == "pypi":
            # Split by lines or spaces
            for line in file_content_str.split():
                line = line.strip()
                if not line:
                    continue

                # Extract name and version
                parts = line.split("==")
                name = parts[0].strip()
                version = parts[1].strip() if len(parts) > 1 else None

                dependencies.append({"name": name, "version": version})
        
        elif ecosystem == "npm":
            # Expect JSON with dependencies
            import json
            try:
                data = json.loads(file_content_str)
                for sec in ["dependencies", "devDependencies"]:
                    if sec in data:
                        for name, ver in data[sec].items():
                            dependencies.append({"name": name, "version": ver})
            except Exception as e:
                logger.warning(f"Could not parse JSON file_content: {e}")

        # Set the 'dependencies' state variable
        tool_context.state["dependencies"] = dependencies

        summary = f"Successfully parsed {len(dependencies)} dependencies from file_content with ecosystem {ecosystem}."
        return {"status": "success", "message": summary, "dependencies": dependencies}

    except Exception as e:
        err = f"Error in setting dependencies: {e}"
        logger.exception(err)
        return {"status": "error", "message": err}