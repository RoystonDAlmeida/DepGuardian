# DepGuardian 🛡️

**Your guardian angel for project dependencies.**

DepGuardian is a powerful dependency analysis tool designed to bring clarity and security to your software projects. By scanning your dependency files, it provides a comprehensive report on vulnerabilities, license compliance, and package metrics, helping you make informed decisions and maintain a healthy codebase.

<p align="center"><!-- Python --> <img src="https://img.shields.io/badge/Python-3.11+-blue?style=for-the-badge&logo=python&logoColor=white" /> <!-- React --> <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white" /> <!-- TypeScript --> <img src="https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript&logoColor=white" /> <!-- Vite --> <img src="https://img.shields.io/badge/Vite-4-646CFF?style=for-the-badge&logo=vite&logoColor=white" /> <!-- FastAPI --> <img src="https://img.shields.io/badge/FastAPI-0.111-009688?style=for-the-badge&logo=fastapi&logoColor=white" /> <!-- Docker --> <img src="https://img.shields.io/badge/Docker-Enabled-2496ED?style=for-the-badge&logo=docker&logoColor=white" /> <!-- Google ADK --> <img src="https://img.shields.io/badge/Google%20ADK-Agent%20Development%20Kit-4285F4?style=for-the-badge&logo=googlecloud&logoColor=white" /></p>

---

## 📚 Table of Contents

- [DepGuardian 🛡️](#depguardian-️)
  - [📚 Table of Contents](#-table-of-contents)
  - [✨ Features](#-features)
  - [🛠️ Tech Stack](#️-tech-stack)
  - [🏛️ Architecture](#️-architecture)
  - [🚀 Getting Started](#-getting-started)
    - [Prerequisites](#prerequisites)
    - [1. Clone the Repository](#1-clone-the-repository)
    - [2. Run with Docker (Recommended)](#2-run-with-docker-recommended)
    - [3. Manual Setup](#3-manual-setup)
      - [Backend](#backend)
      - [Frontend](#frontend)
  - [Usage](#usage)
  - [🤝 Contributing](#-contributing)
  - [📄 License](#-license)

---

## ✨ Features

-   **Comprehensive Dependency Analysis**: Scans `package.json` (NPM) and `requirements.txt` (PyPI) files.
-   **Vulnerability Scanning**: Identifies known security vulnerabilities in your dependencies using up-to-date databases.
-   **License Auditing**: Detects the license of each package and flags potential compatibility issues.
-   **Package Insights**: Gathers and displays key metrics like download statistics and release dates.
-   **Interactive Web UI**: A modern, user-friendly interface to upload files and visualize reports.
-   **Agent-Based Backend**: A modular and scalable architecture for processing analysis tasks.

## 🛠️ Tech Stack

DepGuardian is built with a modern and robust technology stack:

-   **Backend**:
    -   **Language**: Python 3.11+
    -   **Framework**: FastAPI & Uvicorn
    -   **Architecture**: Google ADK(Agent Development Kit)
-   **Frontend**:
    -   **Framework**: React (with Vite)
    -   **Language**: TypeScript
    -   **UI**: Tailwind CSS & shadcn/ui
-   **Containerization**: Docker & Docker Compose

## 🏛️ Architecture

The backend employs a distributed, agent-based architecture where different agents collaborate to perform the analysis.

-   **`ParserAgent`**: Reads and interprets the uploaded dependency file.
-   **`FetcherAgent`**: Gathers metadata, download stats, and vulnerability info from external sources (NPM, PyPI).
-   **`AnalyzerAgent`**: Evaluates the collected data for security risks, license issues, and other insights.
-   **`ReporterAgent`**: Compiles the findings into a structured report for the frontend.

This modular design allows for scalability and easy extension of capabilities.

## 🚀 Getting Started

You can run DepGuardian locally using either Python/Node.js directly or with Docker.

### Prerequisites

-   Git
-   Python 3.11+ and `uv` (or `pip`)
-   Node.js 18+ and npm
-   Docker and Docker Compose (for containerized setup)

### 1. Clone the Repository

```bash
git clone https://github.com/RoystonDalmeida/DepGuardian.git
cd DepGuardian
```

### 2. Run with Docker (Recommended)

The easiest way to get started is with Docker Compose.

```bash
docker-compose up --build
```

The application will be available at `http://localhost:5173`.

### 3. Manual Setup

#### Backend

```bash
# Navigate to the backend directory
cd DepGuardian

# Create and activate a virtual environment
uv venv
source .venv/bin/activate

# Install dependencies using uv
uv sync

# Run the backend server
uv run python -m DepGuardian
```
The backend API will be running on `http://localhost:8000`.

#### Frontend

```bash
# In a new terminal, navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Run the development server
npm run dev
```
The frontend will be available at `http://localhost:5173`.

## Usage

1.  Open your web browser and navigate to `http://localhost:5173`.
2.  Click the "Upload" button and select your `package.json` or `requirements.txt` file.
3.  DepGuardian will analyze the file and redirect you to a detailed report page.
4.  Explore the report to understand your dependencies' health and security posture.

## 🤝 Contributing

Contributions are welcome! If you'd like to help improve DepGuardian, please follow these steps:

1.  **Fork** the repository.
2.  Create a new branch (`git checkout -b feature/your-feature-name`).
3.  Make your changes and **commit** them (`git commit -m 'Add some feature'`).
4.  **Push** to the branch (`git push origin feature/your-feature-name`).
5.  Open a **Pull Request**.

Please make sure your code adheres to the project's coding standards.

## 📄 License

This project is licensed under the MIT License.