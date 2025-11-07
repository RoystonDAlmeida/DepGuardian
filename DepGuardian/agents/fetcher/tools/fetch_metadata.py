from google.adk.tools.tool_context import ToolContext
import httpx
from typing import Dict, Any
from DepGuardian.agent import logger
from DepGuardian.utils.minimize_pypi_metadata import minimize_pypi_metadata
from DepGuardian.utils.fetch_pypi_download_stats import fetch_pypi_download_stats
from DepGuardian.utils.minimize_npm_metadata import minimize_npm_metadata
from DepGuardian.utils.fetch_npm_download_stats import fetch_npm_download_stats

async def fetch_metadata(tool_context: ToolContext) -> Dict[str, Any]:
    """
    Fetch dependency metadata from PyPI or npm based on 'ecosystem' and 'dependencies' in session state.
    """
    dependencies_list = tool_context.state["dependencies"]
    ecosystem = tool_context.state["ecosystem"]

    if not dependencies_list or not ecosystem:
        msg = "Missing 'dependencies' or 'ecosystem' in state."
        logger.error(msg)
        return {"status": "error", "message": msg}

    # Collect metadata for all dependencies
    dependencies_metadata = []

    try:
        async with httpx.AsyncClient() as client:
            for dependency in dependencies_list:
                pkg_name = dependency.get("name")
                logger.info(f"Fetching metadata for '{pkg_name}' in ecosystem '{ecosystem}'.")

                metadata = None
                try:
                    # Select endpoint by ecosystem
                    if ecosystem == "pypi":
                        url = f"https://pypi.org/pypi/{pkg_name}/json"
                    elif ecosystem == "npm":
                        url = f"https://registry.npmjs.org/{pkg_name}"
                    else:
                        msg = f"Unsupported ecosystem '{ecosystem}'."
                        logger.warning(msg)
                        continue  # skip unsupported ones

                    # Fetch metadata
                    response = await client.get(url)
                    if response.status_code == 200 and ecosystem == "pypi":
                        # Minimize metadata as it is to be added to session state
                        metadata = minimize_pypi_metadata(response.json())
                        download_stats = await fetch_pypi_download_stats(pkg_name)
                        metadata["downloads"] = download_stats  # attach stats
                        
                        dependencies_metadata.append({
                            "name": pkg_name,
                            "metadata": metadata,
                        })
                        logger.info(f"Metadata fetched successfully for '{pkg_name}'.")

                    elif response.status_code == 200 and ecosystem == "npm":
                        # Minimize metadata as it is to be added to session state
                        metadata = await minimize_npm_metadata(response.json())

                        download_stats = await fetch_npm_download_stats(pkg_name)
                        metadata["downloads"] = download_stats  # attach stats
                    
                        dependencies_metadata.append({
                            "name": pkg_name,
                            "metadata": metadata,
                        })
                        logger.info(f"Metadata fetched successfully for '{pkg_name}'.")
                    else:
                        msg = f"Failed to fetch {pkg_name}: {response.status_code}"
                        logger.warning(msg)
                        dependencies_metadata.append({
                            "name": pkg_name,
                            "error": msg
                        })

                except Exception as e:
                    err = f"Error fetching metadata for {pkg_name}: {e}"
                    logger.exception(err)
                    dependencies_metadata.append({
                        "name": pkg_name,
                        "error": str(e)
                    })

        # Store in session state
        tool_context.state["dependencies_metadata"] = dependencies_metadata

        summary = f"Fetched metadata for {len(dependencies_metadata)} dependencies."
        logger.info(summary)

        return {
            "status": "success",
            "message": summary,
        }

    except Exception as e:
        msg = f"Error in fetch_metadata: {e}"
        logger.exception(msg)
        return {"status": "error", "message": msg}
