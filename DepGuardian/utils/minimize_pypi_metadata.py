from packaging import version # For semantic version sorting
from DepGuardian.utils.date_format import format_upload_date

def minimize_pypi_metadata(metadata: dict) -> dict:
    """
    Extract only essential and recent PyPI metadata to reduce token usage
    for downstream Gemini analysis.
    """

    try:
        info = metadata.get("info", {}) or {}
        vulnerabilities = metadata.get("vulnerabilities", []) or []
        releases = metadata.get("releases", {}) or {}

        # --- Determine the latest version ---
        versions = sorted(releases.keys(), key = version.parse)
        latest_version = versions[-1] if versions else info.get("version")

        # --- Fetch upload timestamp for latest version safely ---
        latest_upload_date = None
        if latest_version and latest_version in releases:
            files = releases.get(latest_version, [])

            if isinstance(files, list) and len(files) > 0 and isinstance(files[0], dict):
                latest_upload_date_raw = files[0].get("upload_time_iso_8601")
                latest_upload_date = format_upload_date(latest_upload_date_raw)

        requires_dist = info.get("requires_dist") or []  # ensure it's always a list

        minimized = {
            "name": info.get("name"),
            "latest_version": latest_version,
            "summary": info.get("summary"),
            "author": info.get("author"),
            "author_email": info.get("author_email"),
            "license": info.get("license"),
            "home_page": info.get("home_page"),
            "requires_python": info.get("requires_python"),
            "requires_dist": requires_dist[:5],     # Limit dependencies safely
            "release_url": f"https://pypi.org/project/{info.get('name')}/{latest_version}/",
            "vulnerabilities": vulnerabilities,
            "latest_upload_date": latest_upload_date,
        }

        return minimized

    except KeyError as e:
        print(f"KeyError: {e}")
        return None
    
    except Exception as e:
        print(f"Error processing metadata: {e}")
        return None