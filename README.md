# Fail7Fly.AI
### AI-Powered Interview Preparation & Resume Analysis Platform

Fail7Fly.AI is an AI-powered career preparation platform designed to help students and job seekers prepare for technical interviews, analyze resumes, explore career roadmaps, and access technical learning resources from one place.

The platform combines modern web technologies, AI-powered workflows, and a microservices-based backend to provide a centralized career preparation experience.

## ✨ Features

- **AI Interview Preparation** — Prepare for technical and HR interviews based on your target role.
- **Interview Feedback & Reports** — Designed to support interview evaluation and performance summaries.
- **AI Resume Analysis** — Analyze resumes and extract relevant professional information.
- **Resume Scoring** — Help users evaluate and improve their resumes.
- **Technical Career Roadmaps** — Explore structured career paths and learning roadmaps.
- **Technical Resources** — Access curated technical learning resources.
- **Authentication** — User authentication using Firebase integration.
- **Microservices Architecture** — Separate backend services for different application features.
- **AI Agent Workflows** — LangGraph-based interview workflows and AI agents.

## 🛠️ Tech Stack

| Category | Technologies |
|---|---|
| Frontend | React.js, Vite, JavaScript, CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB |
| Caching | Redis |
| AI Workflows | LangGraph, LLM integrations |
| Authentication | Firebase |
| API Communication | Axios, REST APIs |
| Development Tools | Git, GitHub, VS Code, Docker |

*The technology list describes the project's current intended stack; individual features may require additional configuration.*

## 🏗️ Project Architecture

```text
Fail7Fly.AI/
├── frontend/
│   ├── public/
│   └── src/
│       ├── apis/
│       ├── components/
│       ├── pages/
│       ├── assets/
│       └── utils/
│
├── backend/
│   ├── gateway/
│   ├── services/
│   │   ├── auth/
│   │   ├── interview/
│   │   ├── resume/
│   │   ├── Resources/
│   │   ├── roadmap/
│   │   └── authservices/
│   ├── sharedRedis/
│   └── docker-compose.yml
│
└── README.md
```

The frontend communicates with backend APIs through an API Gateway. Backend functionality is divided into dedicated services to improve separation of concerns and maintainability.

## ⚙️ Getting Started

### Prerequisites

Install the following tools before running the project:

- Node.js and npm
- Git
- Docker Desktop (if using Docker Compose)
- MongoDB connection
- Redis
- Firebase project credentials
- Required LLM API credentials for AI features

### 1. Clone the Repository

```bash
git clone https://github.com/AnkitPandey07-a/Fail7Fly.AI.git
cd Fail7Fly.AI
```

### 2. Install Frontend Dependencies

```bash
cd frontend
npm install
```

Create a frontend `.env` file and configure the variables required by your frontend code.

### 3. Install Backend Dependencies

Open a separate terminal:

```bash
cd backend
npm install
```

Some services may have their own `package.json` files. Install dependencies inside the relevant service directories if required.

### 4. Configure Environment Variables

Create the required `.env` files for the gateway and individual backend services according to their configuration.

Typical configuration categories include:

- MongoDB connection strings
- JWT secrets
- Firebase credentials
- LLM API keys
- Redis connection URL
- Service URLs and ports
- Frontend origin for CORS

**Security:** Never commit `.env` files, Firebase service-account private keys, database passwords, or API secrets to GitHub.

### 5. Start Redis and Other Dependencies

If Docker Compose is configured for your local environment, run it from the directory containing `docker-compose.yml`:

```bash
docker compose up -d
```

Check the Compose configuration first to confirm which services it starts.

### 6. Start the Application

Start the gateway and required backend services using their configured npm scripts or entry points. Start the frontend separately:

```bash
cd frontend
npm run dev
```

The frontend development server URL is displayed in the terminal. Configure the frontend API base URL to point to your local gateway.

> **Note:** Exact environment-variable names, start commands, and service ports depend on the configuration in each service's `package.json` and source files.

## 🔐 Security Best Practices

- Keep secrets in environment variables.
- Do not commit uploaded resumes or private user documents.
- Use a `.gitignore` file for dependencies, environment files, and generated uploads.
- Validate authentication and authorization on protected endpoints.
- Restrict access to user-specific interview and resume data.
- Use HTTPS and secure cookie settings in production.

## 🗺️ Future Improvements

- Real-time voice-based mock interviews.
- Improved interview evaluation and personalized feedback.
- Advanced resume optimization recommendations.
- Progress tracking and interview history analytics.
- Production deployment with managed databases and caching.
- Automated testing and CI/CD workflows.

## 🎯 Project Goal

The goal of Fail7Fly.AI is to make career preparation more accessible by combining AI-driven interview practice, resume insights, technical resources, and structured career guidance in one platform.

## 👨‍💻 Author

**Ankit Pandey**

- GitHub: [@AnkitPandey07-a](https://github.com/AnkitPandey07-a)
- Project Repository: [Fail7Fly.AI](https://github.com/AnkitPandey07-a/Fail7Fly.AI)

---

⭐ If you find this project interesting, consider starring the repository and sharing feedback.
