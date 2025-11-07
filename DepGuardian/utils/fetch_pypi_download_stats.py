import httpx

async def fetch_pypi_download_stats(pkg_name: str) -> dict:
    """
    Fetch recent download statistics for a PyPI package using the PyPIStats API.
    Returns a dict with counts for day, week, and month.
    """

    url = f"https://pypistats.org/api/packages/{pkg_name}/recent"
    async with httpx.AsyncClient() as client:
        try:
            resp = await client.get(url, timeout=10.0)
            if resp.status_code == 200:
                data = resp.json().get("data", {})
                return {
                    "last_day": data.get("last_day", 0),
                    "last_week": data.get("last_week", 0),
                    "last_month": data.get("last_month", 0)
                }
            else:
                return {"error": f"HTTP {resp.status_code}"}
        except Exception as e:
            return {"error": str(e)}