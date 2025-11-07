import httpx

async def fetch_npm_download_stats(package_name: str) -> dict:
    """
    Fetch last-day, last-week, and last-month download counts from NPM.
    """
    base = "https://api.npmjs.org/downloads/point"

    urls = {
        "last_day": f"{base}/last-day/{package_name}",
        "last_week": f"{base}/last-week/{package_name}",
        "last_month": f"{base}/last-month/{package_name}",
    }

    results = {}

    async with httpx.AsyncClient() as client:
        for key, url in urls.items():
            try:
                r = await client.get(url)
                if r.status_code == 200:
                    data = r.json()
                    results[key] = data.get("downloads", "Not available")
                else:
                    results[key] = "Not available"
            except Exception:
                results[key] = "Not available"

    return results
