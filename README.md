# 📄 Cracking Documents Demo

A comprehensive document analysis application demonstrating **Azure Document Intelligence** and **Azure Content Understanding** services. Upload documents (PDF, JPEG, PNG) through an intuitive web interface and extract structured information using Azure's AI-powered document processing.

## ✨ Features

- 🔍 **OCR & Layout Analysis** - Extract text, tables, and structure from documents
- 🧠 **AI-Powered Understanding** - Advanced content extraction with custom models
- 🔐 **Secure Storage** - Valet Key pattern for time-limited blob access
- 🐳 **Containerized** - Docker Compose for easy local development
- ☁️ **Azure-Ready** - One-command deployment to Azure with Bicep IaC
- 📊 **Interactive APIs** - Swagger/OpenAPI documentation included

## 🏗️ Architecture

**Three-tier microservices architecture:**

```
Web UI (Port 8080) → Document API (Port 8800) → Azure Document Intelligence
                   ↓ Valet API (Port 8000)     → Azure Storage
                                               → Azure Content Understanding
```

- **Web UI**: JavaScript + Fluent UI for document upload and visualization
- **Document API**: Python FastAPI for Azure AI service integration
- **Valet API**: Python FastAPI for secure SAS token generation

📖 **[Full Architecture Documentation](docs/ARCHITECTURE.md)**

## 🚀 Quick Start

### Prerequisites

| Platform | Local Development | Azure Deployment |
|----------|-------------------|------------------|
| **Linux/macOS** | ✅ Docker + Docker Compose | ✅ Azure CLI + make + jq |
| **Windows** | ✅ Docker + Docker Compose | ⚠️ Requires [WSL](https://learn.microsoft.com/windows/wsl/install) |

### Local Development

**1. Clone and setup:**
```bash
git clone <repository-url>
cd crackingDocumentsDemo
make setup
```

**2. Configure Azure credentials:**
Edit `src/.env` with your Azure service endpoints and keys (Document Intelligence, Content Understanding, Storage).

**3. Start services:**
```bash
make up
```

**4. Access the application:**
- Web UI: http://localhost:8080
- Document API: http://localhost:8800/docs
- Valet API: http://localhost:8000/docs

📖 **[Complete Local Setup Guide](docs/LOCAL_SETUP.md)**

### Deploy to Azure

**One-command deployment:**
```bash
make deploy-all
```

This deploys:
- ✅ Azure infrastructure (App Services, Container Registry, AI Services, Storage)
- ✅ Docker containers for all services
- ✅ Environment configuration
- ✅ RBAC and managed identities

📖 **[Complete Azure Deployment Guide](docs/AZURE_DEPLOYMENT.md)**

## 📋 What You'll Need

### For Local Development
- Docker 20.10+
- Docker Compose 2.0+
- Azure subscriptions services:
  - Document Intelligence (F0 or S0 SKU)
  - Content Understanding (S0 SKU)  
  - Storage Account (Standard LRS)

### Additional for Azure Deployment (Linux/macOS/WSL only)
- Azure CLI 2.50+
- jq 1.6+
- make
- bash 4.0+

## 🎮 Usage

1. Open http://localhost:8080
2. Drag & drop or select a document (PDF, JPEG, PNG)
3. Choose analysis service (Document Intelligence or Content Understanding)
4. Click "Analyze Document"
5. View structured results in JSON viewer

## 🛠️ Common Commands

```bash
make up              # Start all services
make down            # Stop all services
make logs            # View logs
make restart         # Restart services
make rebuild         # Rebuild after code changes
make clean           # Remove all containers and volumes

# Azure deployment
make deploy-all      # Deploy everything to Azure
make deploy-infra    # Deploy infrastructure only
make deploy-containers # Deploy containers only
```

## 📚 Documentation

| Document | Description |
|----------|-------------|
| **[Local Setup Guide](docs/LOCAL_SETUP.md)** | Detailed local development setup, troubleshooting, and commands |
| **[Azure Deployment Guide](docs/AZURE_DEPLOYMENT.md)** | Complete Azure deployment walkthrough, configuration, and monitoring |
| **[Architecture](docs/ARCHITECTURE.md)** | System design, components, patterns, and technology stack |
| [API Integration Guide](src/webui/API_INTEGRATION.md) | API documentation and integration details |
| [Fluent UI Guide](src/webui/FLUENT_UI_GUIDE.md) | UI component library reference |

## ⚠️ Production Readiness

> **Note**: The Web UI was created as a demonstration and is **not recommended for production use**. For production, use modern frameworks like **React**, **Vue**, or **Angular** with proper:
> - Component architecture and state management
> - Comprehensive testing (unit, integration, e2e)
> - Security hardening and authentication
> - Performance optimization
> - Accessibility compliance

The backend APIs (Document API, Valet API) are production-ready FastAPI services.

## 🔧 Technology Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | HTML/CSS/JavaScript, Fluent UI |
| **Backend** | Python 3.11+, FastAPI, Uvicorn |
| **Infrastructure** | Docker, Docker Compose, Azure Bicep |
| **Cloud Services** | Azure App Service, ACR, Document Intelligence, Storage |

##  Additional Resources

- [Azure Document Intelligence Documentation](https://learn.microsoft.com/azure/ai-services/document-intelligence/)
- [Azure Content Understanding Documentation](https://learn.microsoft.com/azure/ai-services/content-understanding/)
- [Azure Storage Documentation](https://learn.microsoft.com/azure/storage/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Docker Documentation](https://docs.docker.com/)

## 🤝 Contributing

Contributions are welcome! This is a demonstration project showcasing Azure AI capabilities.

## 📄 License

See [LICENSE](LICENSE) file for details.

---

**Built with ❤️ to demonstrate Azure Document Intelligence and Content Understanding capabilities**
