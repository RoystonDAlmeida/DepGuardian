import httpx

async def call_agent(url, payload):
    """This utility allows the host agent to call any other agent using the A2A protocol by calling the /run endpoint"""

    async with httpx.AsyncClient() as client:
        response = await client.post(url, json=payload, timeout=60.0)
        response.raise_for_status()
        return response.json()