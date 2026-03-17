# 🚀 Complete Deployment Workflow

This guide provides the step-by-step workflow for deploying the Document Intelligence application to Azure, from infrastructure provisioning to custom model training.

## 📋 Overview

The complete deployment involves these steps in order:

1. **Deploy Azure Infrastructure** - Provision all required Azure resources
2. **Build Custom Models** - Train Document Intelligence models with your data
3. **Deploy Application Containers** - Build and deploy the application services

## 🔄 Deployment Steps

### Step 1: Deploy Azure Infrastructure

Deploy all Azure resources (Resource Group, Container Registry, App Services, Document Intelligence, Storage, etc.):

```bash
make deploy-infra
```

**What this does:**
- ✅ Creates Resource Group
- ✅ Provisions Azure Container Registry
- ✅ Creates App Service Plan
- ✅ Deploys 3 App Services (Web UI, Document API, Valet API)
- ✅ Creates Document Intelligence service
- ✅ Creates Storage Account
- ✅ Sets up Managed Identities
- ✅ Configures RBAC permissions

**Time:** ~5-10 minutes

**Output:**
```
✓ Deployment completed successfully!
Deployment name: doc-intelligence-deployment-20260317-123045
```

**Verify deployment:**
```bash
# List all deployments
az deployment sub list --output table

# Show deployment outputs
az deployment sub show --name doc-intelligence-deployment-YYYYMMDD-HHMMSS --query properties.outputs
```

---

### Step 2: Build Custom Models

Train custom Document Intelligence models using your training data:

```bash
make build-models
```

**What this does:**
- ✅ Automatically retrieves configuration from Azure deployment
- ✅ Creates `src/utility/modelBuilder/.env` with proper environment variables
- ✅ Sets up Python virtual environment (using `uv`)
- ✅ Installs dependencies
- ✅ Uploads training data to Azure Storage
- ✅ Builds custom Document Intelligence model
- ✅ Configures Content Understanding defaults

**Time:** ~3-10 minutes (depends on training data size)

**Output:**
```
╔════════════════════════════════════════════════════════════╗
║      Model Builder Environment Setup                      ║
╚════════════════════════════════════════════════════════════╝

✓ Found Azure deployment: doc-intelligence-deployment-20260317-123045
✓ Successfully created src/utility/modelBuilder/.env

╔════════════════════════════════════════════════════════════╗
║      Model Builder Environment Ready                       ║
╚════════════════════════════════════════════════════════════╝

Creating virtual environment...
Installing dependencies...
Uploading storage...
Creating document intelligence custom model...
Model ID: <your-custom-model-id>
```

**What gets created:**
- `src/utility/modelBuilder/.env` - Environment config with Azure credentials
- `.venv/` - Python virtual environment
- Training data uploaded to Azure Storage blob container
- Custom model registered in Document Intelligence

**Manual setup (optional):**
If you want to set up the environment without running the model builder:
```bash
make setup-model-builder
```

---

### Step 3: Deploy Application Containers

Build and deploy Docker containers to Azure App Services:

```bash
make deploy-containers
```

**What this does:**
- ✅ Retrieves deployment information
- ✅ Logs into Azure Container Registry
- ✅ Builds Docker images for all 3 services
- ✅ Pushes images to ACR
- ✅ Updates App Service container settings
- ✅ Configures environment variables
- ✅ Restarts App Services

**Time:** ~5-15 minutes (depends on network speed)

**Output:**
```
╔════════════════════════════════════════════════════════════╗
║      Document Intelligence Container Deployment           ║
╚════════════════════════════════════════════════════════════╝

✓ Prerequisites check passed
✓ Found deployment: doc-intelligence-deployment-20260317-123045

[1/3] Building document-api...
✓ Built document-api
✓ Pushed document-api

[2/3] Building valet-api...
✓ Built valet-api
✓ Pushed valet-api

[3/3] Building webui...
✓ Built webui
✓ Pushed webui

✅ All containers deployed successfully!

Access your application:
  Web UI: https://your-app-webui.azurewebsites.net
  Document API: https://your-app-document-api.azurewebsites.net/docs
  Valet API: https://your-app-valet-api.azurewebsites.net/docs
```

---

## 🎯 Quick Deployment (All Steps)

To run all steps in sequence with one command:

```bash
make deploy-all
```

This runs:
1. `make deploy-infra`
2. `make deploy-containers`

**Note:** This does NOT include `build-models` because:
- Model building requires training data to be prepared
- It's an optional step (you can use prebuilt models)
- It should be run separately after verifying infrastructure

---

## 📝 Complete Workflow Example

Here's a complete deployment from scratch:

```bash
# 1. Authenticate with Azure
az login
az account set --subscription "Your Subscription Name"

# 2. Validate infrastructure templates (optional)
make validate-infra

# 3. Deploy Azure infrastructure
make deploy-infra

# 4. Build custom models (if you have training data)
make build-models

# 5. Deploy application containers
make deploy-containers

# 6. Verify deployment
curl https://your-app-webui.azurewebsites.net
```

---

## 🔍 Verification Steps

After deployment, verify everything is working:

### 1. Check Azure Resources

```bash
# List resources in the resource group
az resource list --resource-group rg-doc-intelligence --output table

# Check App Service status
az webapp list --resource-group rg-doc-intelligence --query "[].{Name:name, State:state}" -o table
```

### 2. Test Web UI

Open in browser:
```
https://your-app-webui.azurewebsites.net
```

Expected: Web interface loads properly

### 3. Test Document API

```bash
# Check API health (replace with your URL)
curl https://your-app-document-api.azurewebsites.net/docs
```

Expected: Swagger UI documentation page

### 4. Test Valet API

```bash
# Check API health
curl https://your-app-valet-api.azurewebsites.net/docs
```

Expected: Swagger UI documentation page

### 5. Test End-to-End

1. Open Web UI
2. Upload a test document (PDF, JPEG, or PNG)
3. Select "Document Intelligence" service
4. Click "Analyze Document"
5. Verify results appear in JSON viewer

---

## 🛠️ Troubleshooting

### Issue: Infrastructure deployment fails

**Check:**
```bash
# View deployment operations
az deployment sub operation list \
  --name doc-intelligence-deployment-YYYYMMDD-HHMMSS \
  --query "[?properties.provisioningState=='Failed']"
```

**Common causes:**
- Quota limits exceeded
- Region doesn't support the service
- Invalid parameter values
- Resource name conflicts

### Issue: Model builder can't find deployment

**Check:**
```bash
# List deployments
az deployment sub list --query "[?contains(name, 'doc-intelligence-deployment')].name"
```

**Solution:**
- Ensure `deploy-infra` completed successfully
- Run `make setup-model-builder` to manually configure

### Issue: Container deployment fails

**Check:**
```bash
# View App Service logs
az webapp log tail --name your-app-document-api --resource-group rg-doc-intelligence
```

**Common causes:**
- Docker image build failed
- ACR authentication issues
- Container startup errors
- Port configuration mismatch

### Issue: App Services won't start

**Check:**
```bash
# Check container logs
az webapp log show --name your-app-name --resource-group rg-doc-intelligence

# Check environment variables
az webapp config appsettings list \
  --name your-app-name \
  --resource-group rg-doc-intelligence
```

---

## 🔄 Update Workflow

To update after making code changes:

**Update application code only:**
```bash
make deploy-containers
```

**Update infrastructure:**
```bash
make deploy-infra
```

**Rebuild models:**
```bash
make build-models
```

**Update everything:**
```bash
make deploy-all
```

---

## 🧹 Clean Up

To delete all Azure resources:

```bash
# Get resource group name
az group list --output table

# Delete everything (WARNING: Irreversible!)
az group delete --name rg-doc-intelligence --yes --no-wait
```

---

## 📊 Environment Variables Reference

### Created by `deploy-infra`:
- Resource names and endpoints stored in deployment outputs
- Retrieved automatically by subsequent steps

### Created by `setup-model-builder`:
Writes to `src/utility/modelBuilder/.env`:
```bash
DOCUMENT_INTELLIGENCE_ENDPOINT=https://...
DOCUMENT_INTELLIGENCE_API_KEY=...
STORAGE_CONNECTION_STRING=...
STORAGE_ACCOUNT_KEY=...
DOC_INTELLIGENCE_TRAINING_CONTAINER=training-data
CONTENT_UNDERSTANDING_ENDPOINT=https://...
MODEL_DEPLOYMENTS={"deployments":[]}
```

### Created by `deploy-containers`:
- Sets App Service environment variables automatically
- Configures API endpoints and connections

---

## 🎓 Next Steps

After successful deployment:

1. **Configure custom domain** - Add your own domain name
2. **Enable SSL** - Configure SSL certificates
3. **Set up monitoring** - Enable Application Insights
4. **Configure auto-scaling** - Set up scaling rules
5. **Add authentication** - Integrate Azure AD B2C
6. **Set up CI/CD** - Automate with GitHub Actions

---

## 📚 Related Documentation

- [Azure Deployment Guide](AZURE_DEPLOYMENT.md) - Detailed deployment documentation
- [Local Setup Guide](LOCAL_SETUP.md) - Local development setup
- [Architecture](ARCHITECTURE.md) - System design and components
- [Makefile Commands](../README.md#-common-commands) - All available make commands
