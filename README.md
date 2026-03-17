# 📄 Cracking Documents Demo

A comprehensive document analysis application that demonstrates the powerful capabilities of **Azure Document Intelligence** and **Azure Content Understanding** services. This solution provides an intuitive web interface for uploading documents (PDF, JPEG, PNG) and extracting structured information using Azure's AI-powered document processing services.

## 🎯 Project Goals

This repository serves as a complete demonstration and reference implementation for:

1. **Azure Document Intelligence Integration**: Showcase optical character recognition (OCR), layout analysis, and form recognition capabilities
2. **Azure Content Understanding**: Demonstrate advanced document understanding with custom models and content extraction
3. **Modern Web Architecture**: Illustrate a clean separation between frontend (Web UI), backend services (APIs), and cloud services
4. **Secure Storage Access**: Implement the Valet Key pattern for secure, time-limited access to Azure Storage
5. **Containerized Architecture**: Microservices architecture with Docker Compose for local development

## 🏗️ Architecture

The application consists of three main components:

```
┌─────────────┐
│   Web UI    │ ← Microsoft Fluent UI (HTML/CSS/JS)
│  (Port 8080)│
└──────┬──────┘
       │
       ├──────────────────┬────────────────────┐
       │                  │                    │
       ▼                  ▼                    ▼
┌─────────────┐   ┌──────────────┐   ┌──────────────┐
│ Document API│   │  Valet API   │   │Azure Storage │
│ (Port 8800) │   │ (Port 8000)  │   │   (Blobs)    │
└──────┬──────┘   └──────┬───────┘   └──────────────┘
       │                 │
       ▼                 ▼
┌──────────────────────────────────────┐
│     Azure Cognitive Services         │
│  • Document Intelligence             │
│  • Content Understanding             │
└──────────────────────────────────────┘
```

- **Web UI**: Pure JavaScript application using Microsoft Fluent UI design principles for document upload and analysis visualization
- **Document API**: FastAPI service that interfaces with Azure Document Intelligence and Content Understanding
- **Valet API**: FastAPI service that generates secure SAS tokens for Azure Storage access
- **Azure Services**: Cloud-based AI services for document processing and blob storage

> ⚠️ **Disclaimer**: The Web UI was created with Claude LLM as a demonstration and is **not recommended for production use**. It uses Fluent UI principles in vanilla JavaScript. For production applications, we recommend using modern frameworks like **Vue.js**, **React.js**, or **Angular** with proper component libraries, state management, and testing infrastructure.

## 📋 Prerequisites

### Required Software

| Software | Version | Purpose | Installation |
|----------|---------|---------|--------------|
| **Docker** | 20.10+ | Container runtime | [Install Docker](https://docs.docker.com/get-docker/) |
| **Docker Compose** | 2.0+ | Multi-container orchestration | [Install Docker Compose](https://docs.docker.com/compose/install/) |
| **Make** (optional) | Any | Convenience commands | Usually pre-installed on Linux/macOS |

### Required Azure Services

You need to provision the following Azure services before running this application:

#### 1. Azure Document Intelligence

- **Service**: Azure AI Document Intelligence (formerly Form Recognizer)
- **Required SKU**: F0 (Free) or S0 (Standard)
- **What you need**:
  - Endpoint URL (e.g., `https://your-resource.cognitiveservices.azure.com/`)
  - API Key (Key 1 or Key 2)
- **How to create**: 
  - [Azure Portal](https://portal.azure.com/) → Create a resource → "Document Intelligence"
  - [Documentation](https://learn.microsoft.com/azure/ai-services/document-intelligence/)

#### 2. Azure Content Understanding

- **Service**: Azure AI Content Understanding
- **Required SKU**: S0 (Standard)
- **What you need**:
  - Endpoint URL
  - API Key
- **How to create**:
  - Azure Portal → Create a resource → "Content Understanding"
  - [Documentation](https://learn.microsoft.com/azure/ai-services/content-understanding/)

#### 3. Azure Storage Account

- **Service**: Azure Storage Account
- **Required SKU**: Standard_LRS or higher
- **What you need**:
  - Storage Connection String
  - Storage Account Key
  - Container for document storage (will be created automatically if it doesn't exist)
- **How to create**:
  - Azure Portal → Create a resource → "Storage Account"
  - [Documentation](https://learn.microsoft.com/azure/storage/common/storage-account-create)

> **💡 Tip**: If you're new to Azure, you can sign up for a [free account](https://azure.microsoft.com/free/) which includes free credits and free tiers for many services.

## 🚀 Running Locally

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd crackingDocumentsDemo
```

### Step 2: Set Up Environment Variables

Navigate to the `src` directory and create environment configuration files:

```bash
cd src
cp .env.example .env
```

Or use the Makefile shortcut:

```bash
cd src
make setup
```

### Step 3: Configure Azure Credentials

Edit the `.env` file with your Azure service credentials:

```bash
nano .env  # or use your preferred editor
```

Update the following values:

```bash
# Azure Document Intelligence Configuration
DOCUMENT_INTELLIGENCE_ENDPOINT=https://your-resource.cognitiveservices.azure.com/
DOCUMENT_INTELLIGENCE_API_KEY=your-actual-api-key-here

# Azure Content Understanding Configuration
CONTENT_UNDERSTANDING_ENDPOINT=https://your-content-understanding.cognitiveservices.azure.com/
CONTENT_UNDERSTANDING_API_VERSION=2024-02-01
CONTENT_UNDERSTANDING_API_KEY=your-actual-api-key-here

# Azure Storage Configuration
STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=https;AccountName=youraccount;AccountKey=yourkey;EndpointSuffix=core.windows.net
STORAGE_ACCOUNT_KEY=your-actual-storage-account-key
```

**How to find your Azure credentials:**

1. **Document Intelligence & Content Understanding**:
   - Go to Azure Portal → Your Resource → Keys and Endpoint
   - Copy "KEY 1" and "Endpoint"

2. **Storage Account**:
   - Go to Azure Portal → Your Storage Account → Access Keys
   - Copy "Key 1" and "Connection string"

### Step 4: Create Environment Files for APIs

The Docker Compose setup requires individual `.env` files for each API:

```bash
# From the src/ directory
cp .env api/document-api/.env
cp .env api/valet-api/.env
```

### Step 5: Build and Start Services

From the `src` directory, run:

```bash
docker-compose up -d
```

Or use the Makefile:

```bash
make up
```

This will:
- Build Docker images for all three services
- Start all containers in detached mode
- Create a Docker network for inter-service communication

**Expected output:**
```
[+] Building ...
[+] Running 4/4
 ✔ Network src_app-network           Created
 ✔ Container document-api            Started
 ✔ Container valet-api               Started
 ✔ Container document-demo-webui     Started
```

### Step 6: Verify Services are Running

Check the status of all services:

```bash
docker-compose ps
```

Or:

```bash
make ps
```

All services should show status as "Up":
```
NAME                    STATUS
document-api            Up
valet-api               Up
document-demo-webui     Up
```

### Step 7: Access the Application

Once all services are running, access them at:

| Service | URL | Description |
|---------|-----|-------------|
| **Web UI** | http://localhost:8080 | Main application interface |
| **Document API** | http://localhost:8800/docs | Interactive API documentation (Swagger UI) |
| **Valet API** | http://localhost:8000/docs | SAS token service API documentation |

## 🎮 Using the Application

1. Open your browser and navigate to http://localhost:8080
2. Upload a document (PDF, JPEG, or PNG) by:
   - Dragging and dropping it into the upload area, or
   - Clicking the upload area to browse files
3. Select the analysis service:
   - **Document Intelligence**: For general OCR and layout analysis
   - **Content Understanding**: For advanced content extraction with custom models
4. Click "Analyze Document"
5. View results in the JSON viewer panel
6. Use the document preview panel to see the original document side-by-side

## 🔧 Useful Commands

### View Logs

Monitor all services:
```bash
docker-compose logs -f
```

Or individual services:
```bash
docker-compose logs -f document-api
docker-compose logs -f valet-api
docker-compose logs -f webui
```

With Makefile:
```bash
make logs              # All services
make logs-document     # Document API only
make logs-valet        # Valet API only
make logs-webui        # Web UI only
```

### Restart Services

```bash
docker-compose restart
```

Or:
```bash
make restart
```

### Stop Services

```bash
docker-compose down
```

Or:
```bash
make down
```

### Rebuild After Code Changes

```bash
docker-compose down
docker-compose build
docker-compose up -d
```

Or:
```bash
make rebuild
```

### Clean Up Everything

Remove all containers, networks, and volumes:
```bash
docker-compose down -v
docker system prune -f
```

Or:
```bash
make clean
```

##  Additional Documentation

- [API Integration Guide](src/webui/API_INTEGRATION.md) - Detailed API documentation
- [Fluent UI Components](src/webui/FLUENT_UI_GUIDE.md) - UI component library guide
- [Setup Guide](src/SETUP.md) - Detailed setup instructions

## 📄 License

See [LICENSE](LICENSE) file for details.