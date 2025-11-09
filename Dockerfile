# ================================
# Builder stage
# ================================
FROM python:3.12-slim AS builder
WORKDIR /app

# Install basic tools
RUN apt-get update && apt-get install -y gcc curl && rm -rf /var/lib/apt/lists/*

# Install uv (recommended installer)
RUN curl -LsSf https://astral.sh/uv/install.sh | sh

# Ensure uv is on PATH
ENV PATH="/root/.local/bin:${PATH}"

# Copy manifest files
COPY pyproject.toml uv.lock ./

# Copy application source
COPY DepGuardian ./DepGuardian

# Install deps into a venv at /app/.venv
# Avoid hardlinks as Docker overlay doesnt support them
ENV UV_NO_CACHE=1
RUN uv sync --frozen

# ================================
# Runtime stage
# ================================
FROM python:3.12-slim AS runtime
WORKDIR /app

# Install uv so we can run with uv or python
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/* \
    && curl -LsSf https://astral.sh/uv/install.sh | sh

ENV PATH="/root/.local/bin:${PATH}"

# Copy everything including .venv
COPY --from=builder /app /app

# Add app root to PYTHONPATH so imports like `import DepGuardian` always work
ENV PYTHONPATH="/app"

# Activate venv in PATH
ENV PATH="/app/.venv/bin:${PATH}"

EXPOSE 8000

# Use python directly (inside app venv)
CMD ["uv", "run", "python", "-m", "DepGuardian"]
