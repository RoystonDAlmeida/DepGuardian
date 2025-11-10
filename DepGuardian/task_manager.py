from .agent import execute_bytes

async def run(file):
    return await execute_bytes(file)