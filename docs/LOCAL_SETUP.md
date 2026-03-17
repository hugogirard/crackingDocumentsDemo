# 🚀 Local Development Setup

This guide walks you through setting up and running the application locally using Docker Compose.

## Quick Start

**Recommended: Auto-configure from Azure**

```bash
# 1. Clone and deploy Azure infrastructure
git clone <repository-url>
cd crackingDocumentsDemo
make deploy-infra

# 2. Auto-setup environment (automatically pulls Azure credentials!)
make setup

# 3. Copy to API services
make setup-local

# 4. Start services locally
make up

# 5. Access at http://localhost:8080
```

**Alternative: Manual configuration with existing resources**

```bash
# 1. Clone and setup
git clone <repository-url>
cd crackingDocumentsDemo
make setup  # Creates template

# 2. Manually edit with your Azure credentials
nano src/.env

# 3. Copy and start
make setup-local
make up
```

## Prerequisites

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

## Setup Steps

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd crackingDocumentsDemo
```

### Step 2: Setup Environment (Smart Configuration)

The `make setup` command intelligently configures your environment:

**If Azure deployment exists:**
```bash
make setup
```

This will:
- ✅ Detect your Azure deployment automatically
- ✅ Retrieve endpoints from deployment outputs
- ✅ Fetch API keys from Azure resources
- ✅ Pull storage credentials from Azure
- ✅ Create `src/.env` with all credentials pre-filled

**Output example:**
```
╔════════════════════════════════════════════════════════════╗
║      Local Environment Setup                              ║
╚════════════════════════════════════════════════════════════╝

✓ Found Azure deployment: doc-intelligence-deployment-20260317-123045
Extracting configuration from Azure...

  ✓ Document Intelligence key retrieved
  ✓ Content Understanding key retrieved
  ✓ Storage Account credentials retrieved

✓ Successfully created src/.env with Azure credentials!

╔════════════════════════════════════════════════════════════╗
║      Environment Setup Complete!                          ║
╚════════════════════════════════════════════════════════════╝

Configuration:
  Resource Group: rg-doc-intelligence
  Document Intelligence: doc-intelligence-service
  Storage Account: storageaccount123

Next steps:
  1. Review the configuration: nano src/.env
  2. Copy to API services: make setup-local
  3. Start services: make up
```

**If no Azure deployment found:**

The command creates a template from `.env.example`:
```bash
make setup
```

You'll need to manually edit `src/.env` with your Azure credentials:
```bash
nano src/.env
```

### Step 3: Configure Azure Credentials (Manual - Skip if auto-configured)

Edit the `.env` file with your Azure service credentials:

```bash
nano src/.env  # or use your preferred editor
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

### Step 4: Copy Environment to API Services

The Docker Compose setup requires individual `.env` files for each API. Use the convenience command:

```bash
# From the project root
make setup-local
```

This copies `src/.env` to:
- `src/api/document-api/.env`
- `src/api/valet-api/.env`

**Or copy manually:**
```bash
# From the src/ directory
cp .env api/document-api/.env
cp .env api/valet-api/.env
```

### Step 5: Build and Start Services

From the project root, run:

**Using Make (recommended):**
```bash
make up
```

**Or using Docker Compose directly:**
```bash
docker-compose -f src/docker-compose.yml up -d
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
make ps
# or
docker-compose -f src/docker-compose.yml ps
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

## Using the Application

1. **Open the Web UI**: Navigate to http://localhost:8080 in your browser
2. **Upload a document**: 
   - Drag and drop a file (PDF, JPEG, or PNG) into the upload area, or
   - Click the upload area to browse and select a file
3. **Select the analysis service**:
   - **Document Intelligence**: For general OCR and layout analysis
   - **Content Understanding**: For advanced content extraction with custom models
4. **Analyze**: Click "Analyze Document" button
5. **View results**: 
   - See the analysis results in the JSON viewer panel
   - View the original document in the preview panel

## Building Custom Models (Optional)

The project includes a utility for building custom Document Intelligence and Content Understanding models from training data. This is useful if you want to create specialized models for specific document types (e.g., custom invoices, forms).

### Training Data

Training samples are located in `samples/training/docIntelligence/`:
- `Form_1.jpg` through `Form_5.jpg` - Sample document images
- `.labels.json` files - Label annotations for each form
- `.ocr.json` files - OCR results for each form
- `fields.json` - Field definitions for the custom model

### Build Custom Models

Run the model builder utility:

```bash
make build-models
```

This will:
1. Create a virtual environment (if not exists)
2. Install required Python dependencies (`uv` package manager)
3. Upload training data to Azure Storage
4. Create a custom Document Intelligence model
5. Configure Content Understanding defaults

**Requirements:**
- Azure Document Intelligence resource (S0 SKU recommended)
- Azure Storage Account with blob container
- Training data with proper labels and OCR annotations
- Environment variables configured in `src/.env`

**Environment Variables Needed:**
```bash
DOCUMENT_INTELLIGENCE_ENDPOINT=https://your-resource.cognitiveservices.azure.com/
DOCUMENT_INTELLIGENCE_API_KEY=your-key
STORAGE_CONNECTION_STRING=your-connection-string
STORAGE_ACCOUNT_KEY=your-account-key
DOC_INTELLIGENCE_TRAINING_CONTAINER=training-data
CONTENT_UNDERSTANDING_ENDPOINT=https://your-endpoint
MODEL_DEPLOYMENTS={"deployments":[{"modelId":"model-1"}]}
```

### Model Builder Output

The utility will:
- Create a blob container for training data
- Upload labeled training samples
- Build a custom model (returns model ID)
- Display model details and capabilities

**Note:** Model training can take several minutes depending on the number of samples and model complexity.

## Development Commands

### View Logs

Monitor all services:
```bash
make logs
# or
docker-compose -f src/docker-compose.yml logs -f
```

Monitor individual services:
```bash
make logs-document     # Document API only
make logs-valet        # Valet API only
make logs-webui        # Web UI only
```

Or with Docker Compose:
```bash
docker-compose -f src/docker-compose.yml logs -f document-api
docker-compose -f src/docker-compose.yml logs -f valet-api
docker-compose -f src/docker-compose.yml logs -f webui
```

### Restart Services

Restart all services:
```bash
make restart
# or
docker-compose -f src/docker-compose.yml restart
```

### Stop Services

Stop all services (containers remain):
```bash
make down
# or
docker-compose -f src/docker-compose.yml down
```

### Rebuild After Code Changes

When you make code changes, rebuild and restart:
```bash
make rebuild
```

Or manually:
```bash
docker-compose -f src/docker-compose.yml down
docker-compose -f src/docker-compose.yml build --no-cache
docker-compose -f src/docker-compose.yml up -d
```

### Clean Up Everything

Remove all containers, networks, and volumes:
```bash
make clean
# or
docker-compose -f src/docker-compose.yml down -v
docker system prune -f
```

### Start in Foreground (with logs)

For development with live log output:
```bash
make dev-up
# or
docker-compose -f src/docker-compose.yml up
```

Press `Ctrl+C` to stop all services.

### Individual Service Control

Stop individual services:
```bash
make stop-document    # Stop document-api
make stop-valet       # Stop valet-api
make stop-webui       # Stop webui
```

Start individual services:
```bash
make start-document   # Start document-api
make start-valet      # Start valet-api
make start-webui      # Start webui
```

## Troubleshooting

### Port Conflicts

If you get port binding errors, another application may be using the required ports:

**Check what's using a port:**
```bash
# Linux/macOS
lsof -i :8080
lsof -i :8800
lsof -i :8000

# Or using netstat
netstat -tuln | grep 8080
```

**Solutions:**
- Stop the conflicting application
- Change the port mapping in `src/docker-compose.yml`

### Container Build Failures

**Issue**: Docker build fails with dependency errors

**Solutions:**
```bash
# Clear Docker cache and rebuild
docker-compose -f src/docker-compose.yml build --no-cache

# Check Docker disk space
docker system df

# Clean up unused resources
docker system prune -a
```

### Azure Credentials Not Working

**Issue**: API returns 401 Unauthorized or authentication errors

**Checklist:**
- [ ] Verify endpoint URLs are correct (no trailing slashes)
- [ ] Verify API keys are copied correctly (no extra spaces)
- [ ] Check if Azure resource is active in Azure Portal
- [ ] Verify your Azure subscription is active
- [ ] Check if API key was regenerated (update .env if so)

### Containers Start But Services Don't Respond

**Check container logs:**
```bash
make logs-document
make logs-valet
make logs-webui
```

**Common issues:**
- Missing environment variables
- Incorrect environment variable format
- Application crash on startup (check logs for Python errors)

### Web UI Loads But Can't Connect to APIs

**Check:**
1. All containers are running: `make ps`
2. API endpoints are accessible:
   ```bash
   curl http://localhost:8800/docs
   curl http://localhost:8000/docs
   ```
3. Check browser console for CORS or network errors
4. Verify Docker network configuration

### Storage Container Not Found

**Issue**: Valet API returns errors about missing container

**Solution:**
The storage container should be created automatically, but you can create it manually:
```bash
# Using Azure CLI
az storage container create \
  --name your-container-name \
  --connection-string "your-connection-string"
```

## Performance Tips

### 1. Allocate More Resources to Docker

If you experience slow performance:

**Docker Desktop Settings:**
- Memory: 4GB minimum, 8GB recommended
- CPUs: 2 minimum, 4 recommended
- Swap: 2GB recommended

### 2. Use BuildKit for Faster Builds

Enable Docker BuildKit for faster builds:
```bash
export DOCKER_BUILDKIT=1
docker-compose -f src/docker-compose.yml build
```

### 3. Volume Mounts for Development

For faster development cycles, you can mount local code into containers:
```yaml
# Add to docker-compose.yml volumes section
volumes:
  - ./api/document-api:/app
```

**Note**: Requires application to support hot-reload.

## Next Steps

- **Deploy to Azure**: See [Azure Deployment Guide](AZURE_DEPLOYMENT.md)
- **Understand Architecture**: See [Architecture Documentation](ARCHITECTURE.md)
- **API Details**: Check the API documentation at http://localhost:8800/docs and http://localhost:8000/docs
- **Customize**: Modify the code in `src/` directory and rebuild

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Azure Document Intelligence Documentation](https://learn.microsoft.com/azure/ai-services/document-intelligence/)
- [Azure Storage Documentation](https://learn.microsoft.com/azure/storage/)
