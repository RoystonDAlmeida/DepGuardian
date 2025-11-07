from DepGuardian.utils.date_format import format_upload_date
from DepGuardian.utils.fetch_npm_vulnerabilties import fetch_npm_vulnerabilities

async def minimize_npm_metadata(metadata: dict) -> dict:
    """
    Extract only essential and recent NPM metadata to reduce token usage
    for downstream Gemini analysis.
    """

    try:
        package_name = metadata.get("name", " ")
        versions = metadata.get("versions", {}) or {}
        time_info = metadata.get("time", {})
        
        # Determine latest version
        versions_list = sorted(versions.keys())
        latest_version = versions_list[-1]

        latest_version_dict = metadata["versions"][latest_version]

        # Author details (safe access)
        author_details_dict = latest_version_dict.get("author", {}) or {}

        # License list (safe access)
        licenses_list = latest_version_dict.get("licenses", []) or latest_version_dict.get("license", "")

        if len(licenses_list) > 1:
            licenses_type_list = [lic.get("type") for lic in licenses_list if isinstance(lic, dict)]

        # Engines field (safe access)
        engines = latest_version_dict.get("engines", {}) or {}
        requires_dist = "node " + engines.get("node", "Not available")

        # Vulnerabilities
        vulnerabilities = await fetch_npm_vulnerabilities(package_name, latest_version)

        # Release date
        release_date_iso = time_info.get(latest_version, "Not available")
        latest_upload_date = format_upload_date(release_date_iso)

        minimized = {
            "name": latest_version_dict.get("name"),
            "latest_version": latest_version,
            "author": author_details_dict.get("name", "Not available"),
            "author_email": author_details_dict.get("email", "Not available"),
            "license": licenses_list if type(licenses_list) == str else licenses_type_list,
            "home_page": latest_version_dict.get("homepage"),
            "requires_dist": requires_dist,
            "release_url": f"https://www.npmjs.com/package/cors/v/{latest_version}",
            "vulnerabilities": vulnerabilities,
            "latest_upload_date": latest_upload_date
        }

        return minimized

    except KeyError as e:  # ✅ Specific error caught
        print(f"KeyError: Missing expected key: {e}")
        return None

    except Exception as e:  # ✅ All other errors
        print(f"Unexpected error processing metadata: {e}")
        return None