# Document Intelligence & Content Understanding Demo

A complete document processing solution with Azure Document Intelligence, Content Understanding, and LLM-powered Q&A capabilities.

## 🏗️ Architecture

This application consists of three services:

1. **Document API** (Port 8800) - Document Intelligence & Content Understanding analysis
2. **Valet API** (Port 8000) - Azure Storage SAS token service (Valet Key pattern)
3. **Web UI** (Port 8080) - NGINX-hosted frontend with Fluent UI components

## 🚀 Quick Start with Docker Compose

### Prerequisites

- Docker and Docker Compose installed
- Azure resources:
  - Azure Document Intelligence resource
  - Azure Content Understanding resource
  - Azure Storage Account

### Setup

1. **Clone and navigate to the project:**
   ```bash
   cd /home/pladmin/github/crackingDocumentsDemo/src
   ```

2. **Create your environment file:**
   ```bash
   cp .env.example .env
   # Or use: make setup
   ```

3. **Edit `.env` with your Azure credentials:**
   ```bash
   nano .env  # Update with your actual Azure credentials
   ```
   
   Required values:
   - Azure Document Intelligence endpoint and API key
   - Azure Content Understanding endpoint and API key
   - Azure Storage connection string and account key

4. **Start all services:**
   ```bash
   docker-compose up -d
   # Or use: make up
   ```

5. **View logs:**
   ```bash
   docker-compose logs -f
   # Or use: make logs
   ```

6. **Access the application:**
   - **Web UI**: http://localhost:8080
   - **Document API**: http://localhost:8800/docs
   - **Valet API**: http://localhost:8000/docs

### Stop Services

```bash
docker-compose down
```

### Rebuild After Changes

```bash
docker-compose up -d --build
```

## 📁 Project Structure

```
src/
├── api/
│   ├── document-api/       # Document processing API (FastAPI)
│   │   ├── Dockerfile
│   │   ├── main.py
│   │   ├── config.py
│   │   ├── routes/
│   │   ├── services/
│   │   └── models/
│   └── valet-api/          # Storage SAS token API (FastAPI)
│       ├── Dockerfile
│       ├── main.py
│       ├── config.py
│       └── service/
├── webui/                  # Frontend (HTML/CSS/JS + NGINX)
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── index.html
│   ├── config.js
│   ├── controllers/
│   └── services/
├── docker-compose.yml      # Orchestration for all services
└── .env                    # Environment variables (create from .env.example)
```

## 🔧 Configuration

### Environment Variables

All configuration is managed through a single `.env` file at the root. Docker Compose reads this file and passes the variables to the appropriate containers.

**Required Variables:**

| Variable | Description | Used By |
|----------|-------------|---------|
| `DOCUMENT_INTELLIGENCE_ENDPOINT` | Azure Document Intelligence endpoint | document-api |
| `DOCUMENT_INTELLIGENCE_API_KEY` | Document Intelligence API key | document-api |
| `CONTENT_UNDERSTANDING_ENDPOINT` | Azure Content Understanding endpoint | document-api |
| `CONTENT_UNDERSTANDING_API_VERSION` | API version (default: 2024-02-01) | document-api |
| `CONTENT_UNDERSTANDING_API_KEY` | Content Understanding API key | document-api |
| `STORAGE_CONNECTION_STRING` | Azure Storage connection string | valet-api |
| `STORAGE_ACCOUNT_KEY` | Storage account key | valet-api |

**Note:** The `.env` file is excluded from Docker images via `.dockerignore` for security.

### Port Configuration

Default ports can be changed in `docker-compose.yml`:

- Document API: `8800:8000` (host:container)
- Valet API: `8000:8000`
- Web UI: `8080:80`

## 🧪 Development

### Running Individual Services

**Document API only:**
```bash
docker-compose up document-api
```

**Valet API only:**
```bash
docker-compose up valet-api
```

**Web UI only:**
```bash
docker-compose up webui
```

### Local Development (without Docker)

Each service can be run locally:

**Document API:**
```bash
cd api/document-api
pip install -r requirements.txt
uvicorn main:app --reload --port 8800
```

**Valet API:**
```bash
cd api/valet-api
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

**Web UI:**
```bash
cd webui
python -m http.server 8080
```

## 🔍 Health Checks

All services include health checks:

- Document API: http://localhost:8800/docs
- Valet API: http://localhost:8000/docs
- Web UI: http://localhost:8080/health

Check service status:
```bash
docker-compose ps
```

## 📊 Monitoring

View real-time logs for all services:
```bash
docker-compose logs -f
```

View logs for a specific service:
```bash
docker-compose logs -f document-api
docker-compose logs -f valet-api
docker-compose logs -f webui
```

## 🛠️ Troubleshooting

### Services won't start

1. Check if ports are available:
   ```bash
   netstat -tuln | grep -E '8000|8080|8800'
   ```

2. Verify environment variables:
   ```bash
   docker-compose config
   ```

3. Check service logs:
   ```bash
   docker-compose logs
   ```

### Connection issues

- Ensure all services are running: `docker-compose ps`
- Check network connectivity: `docker network inspect src_app-network`
- Verify firewall settings if accessing remotely

### Rebuild from scratch

```bash
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

## 📝 API Documentation

Once services are running, API documentation is available at:

- Document API: http://localhost:8800/docs
- Valet API: http://localhost:8000/docs

## 🎨 Features

- 📄 Drag-and-drop document upload
- 🔍 Dual analysis (Document Intelligence & Content Understanding)
- 💬 LLM-powered document Q&A
- 📊 JSON response viewer
- 👁️ Document preview
- 🎨 Microsoft Fluent UI design system
- 📱 Responsive design
- 🔒 Secure file handling with Valet Key pattern

## 📄 License

[Your License Here]

## 🤝 Contributing

[Your Contributing Guidelines Here]
