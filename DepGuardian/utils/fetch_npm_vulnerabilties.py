import httpx

async def fetch_npm_vulnerabilities(package_name, package_version):
    """
    Fetches vulnerabilities for a given NPM package using its package name and version
    """

    url = "https://registry.npmjs.org/-/npm/v1/security/audits"

    payload = {
        "name": "temp-project",
        "version": "1.0.0",
        "requires": {package_name: package_version},
        "dependencies": {
            package_name: {"version": package_version}
        }
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(url, json=payload)

        if response.status_code == 200:
            data = response.json()
            print(data.get("advisories", {}))
            return data.get("advisories", {})
        else:
            return {"error": response.text}