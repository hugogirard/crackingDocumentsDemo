# ☁️ Azure Deployment Guide

This guide walks you through deploying the entire application to Azure using the included infrastructure-as-code (Bicep) templates and deployment scripts.

## Platform Requirements

> ⚠️ **Important for Windows Users**: The deployment scripts use `make` and `bash`, which are **not natively available on Windows**. 

**Windows users must use one of the following:**
- **Windows Subsystem for Linux (WSL)** - Recommended ([Install WSL](https://learn.microsoft.com/windows/wsl/install))
- **Git Bash** - May work but not officially tested
- **Linux/macOS** - Fully supported

## Prerequisites

### Required Software

| Software | Version | Purpose | Installation |
|----------|---------|---------|--------------|
| **Azure CLI** | 2.50+ | Azure resource management | [Install Azure CLI](https://learn.microsoft.com/cli/azure/install-azure-cli) |
| **jq** | 1.6+ | JSON parsing in deployment scripts | `apt install jq` (Ubuntu/WSL) or `brew install jq` (macOS) |
| **Make** | Any | Build automation | Pre-installed on Linux/macOS, included in WSL |
| **Docker** | 20.10+ | Container builds | [Install Docker](https://docs.docker.com/get-docker/) |
| **bash** | 4.0+ | Shell script execution | Pre-installed on Linux/macOS, included in WSL |

### Azure Subscription Requirements

- Active Azure subscription
- Subscription Owner or Contributor role (for resource creation)
- Sufficient quota for:
  - Azure App Service Plans
  - Azure Container Registry
  - Azure AI Services (Document Intelligence, Content Understanding)
  - Azure Storage Accounts

## Azure Authentication

Before deploying, authenticate with Azure and verify your subscription:

```bash
# Login to Azure
az login

# Verify your subscription
az account show

# List all available subscriptions
az account list --output table

# Set a specific subscription if you have multiple
az account set --subscription "Your Subscription Name or ID"
```

## Quick Start: Deploy Everything

Deploy the complete solution (infrastructure + containers) with one command:

```bash
make deploy-all
```

This command will:
1. ✅ Deploy all Azure infrastructure (~ 5-10 minutes)
2. ✅ Build Docker images for all services
3. ✅ Push images to Azure Container Registry
4. ✅ Deploy containers to Azure App Services
5. ✅ Configure environment variables
6. ✅ Start the services

**After deployment completes, you'll receive:**
- Web UI URL: `https://your-app-webui.azurewebsites.net`
- Document API URL: `https://your-app-document-api.azurewebsites.net`
- Valet API URL: `https://your-app-valet-api.azurewebsites.net`

## Step-by-Step Deployment

For more control, deploy in separate stages:

### Step 1: Validate Infrastructure (Optional)

Validate your Bicep templates without deploying anything:

```bash
make validate-infra
```

This performs a dry-run validation of:
- Bicep syntax and structure
- Resource type availability in target region
- Parameter validation
- Dependency checks

**Expected output:**
```
✓ Validating Azure Bicep templates...
Validation successful
```

### Step 2: Deploy Azure Infrastructure

Deploy all Azure resources:

```bash
make deploy-infra
```

This creates the following resources:

| Resource Type | Purpose |
|---------------|---------|
| **Resource Group** | Logical container for all resources |
| **Azure Container Registry (ACR)** | Private Docker image registry |
| **App Service Plan** | Hosting infrastructure for web apps |
| **App Service (Web UI)** | Frontend web application |
| **App Service (Document API)** | Backend document processing API |
| **App Service (Valet API)** | SAS token generation service |
| **Document Intelligence** | AI document analysis service |
| **Content Understanding** | Advanced content extraction service (optional) |
| **Storage Account** | Blob storage for documents |
| **Managed Identities** | Secure authentication between services |
| **Role Assignments** | RBAC permissions for service-to-service auth |

**Deployment time:** Approximately 5-10 minutes

**Progress indicators:**
```
🚀 Starting deployment...
Deployment name: doc-intelligence-deployment-20260317-123045
Current subscription: My Subscription (abc123...)
Do you want to proceed with the deployment? (y/n) y
Deploying Bicep template...
```

### Step 3: Build and Deploy Containers

Build Docker images and deploy to Azure:

```bash
make deploy-containers
```

This will:
1. Fetch deployment outputs (resource names, URLs)
2. Log into Azure Container Registry
3. Build Docker images for:
   - `document-api`
   - `valet-api`
   - `webui`
4. Tag images with ACR repository URL
5. Push images to ACR
6. Update App Service container settings
7. Restart App Services

**Deployment time:** Approximately 5-15 minutes (depending on network speed)

**Progress output:**
```
╔════════════════════════════════════════════════════════════╗
║      Document Intelligence Container Deployment           ║
╚════════════════════════════════════════════════════════════╝

✓ Prerequisites check passed
✓ Found deployment: doc-intelligence-deployment-20260317-123045
  Resource Group: rg-doc-intelligence
  Container Registry: crdocintelligence
  Web UI: app-webui
  Document API: app-document-api
  Valet API: app-valet-api

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
```

## Deployment Configuration

### Customizing the Deployment

Edit the Bicep parameters file before deploying:

**File:** `infra/main.bicepparam`

```bicep
using './main.bicep'

// Project naming
param projectName = 'doc-intelligence'
param environmentName = 'dev'  // Change to 'staging', 'prod', etc.

// Azure region
param location = 'canadacentral'  // Change to your preferred region

// SKU Configuration
param appServicePlanSku = 'B1'  // B1, B2, B3, S1, S2, S3, P1V2, P2V2, P3V2
param documentIntelligenceSku = 'S0'  // F0 (free), S0 (standard)
param storageSku = 'Standard_LRS'  // Standard_LRS, Standard_GRS, etc.

// Container Registry
param containerRegistrySku = 'Basic'  // Basic, Standard, Premium

// Enable/disable services
param enableContentUnderstanding = true  // Set to false to skip
```

### Available Regions

Common Azure regions:
- `canadacentral`, `canadaeast`
- `eastus`, `westus`, `centralus`
- `northeurope`, `westeurope`
- `uksouth`, `ukwest`
- `australiaeast`, `australiasoutheast`
- `japaneast`, `japanwest`

**Check region availability:**
```bash
az account list-locations --output table
```

### SKU Selection Guide

#### App Service Plan SKUs

| SKU | Tier | vCPU | RAM | Cost | Use Case |
|-----|------|------|-----|------|----------|
| B1 | Basic | 1 | 1.75 GB | $ | Development |
| B2 | Basic | 2 | 3.5 GB | $$ | Testing |
| S1 | Standard | 1 | 1.75 GB | $$$ | Production (small) |
| P1V2 | Premium | 1 | 3.5 GB | $$$$ | Production (high availability) |

#### Document Intelligence SKUs

| SKU | Transactions/Month | Cost | Use Case |
|-----|-------------------|------|----------|
| F0 | 500 | Free | Development/Testing |
| S0 | Unlimited | Pay per transaction | Production |

## Post-Deployment

### Access Your Deployed Application

After successful deployment, access your application:

**Web UI:**
```
https://<your-app-name>-webui.azurewebsites.net
```

**Document API (Swagger UI):**
```
https://<your-app-name>-document-api.azurewebsites.net/docs
```

**Valet API (Swagger UI):**
```
https://<your-app-name>-valet-api.azurewebsites.net/docs
```

### Verify Deployment

1. **Check Web UI**: Open the Web UI URL in your browser
2. **Upload a test document**: Verify the upload functionality works
3. **Test document analysis**: Ensure analysis completes successfully
4. **Check API documentation**: Access the `/docs` endpoints

### View Deployment Outputs

Get deployment information:

```bash
# List all deployments
az deployment sub list --output table

# Show specific deployment outputs
DEPLOYMENT_NAME="doc-intelligence-deployment-YYYYMMDD-HHMMSS"
az deployment sub show --name $DEPLOYMENT_NAME --query properties.outputs -o json
```

## Monitoring and Logs

### Stream Application Logs

**Web UI logs:**
```bash
az webapp log tail --name <webui-name> --resource-group <rg-name>
```

**Document API logs:**
```bash
az webapp log tail --name <document-api-name> --resource-group <rg-name>
```

**Valet API logs:**
```bash
az webapp log tail --name <valet-api-name> --resource-group <rg-name>
```

### Enable Application Insights (Optional)

For advanced monitoring, enable Application Insights:

```bash
# Create Application Insights
az monitor app-insights component create \
  --app <app-name> \
  --location <location> \
  --resource-group <rg-name>

# Connect to App Service
az webapp config appsettings set \
  --name <app-name> \
  --resource-group <rg-name> \
  --settings APPLICATIONINSIGHTS_CONNECTION_STRING="<connection-string>"
```

## Updating the Deployment

### Update Application Code

After making code changes, redeploy containers:

```bash
make deploy-containers
```

This rebuilds images with your latest code and deploys them.

### Update Infrastructure

To update infrastructure after modifying Bicep templates:

```bash
make deploy-infra
```

**Note:** Azure will perform an incremental update (only changes applied).

## Cost Management

### Estimate Monthly Costs

Approximate monthly costs (USD, as of 2026):

| Resource | SKU | Estimated Cost |
|----------|-----|----------------|
| App Service Plan (B1) | Basic | $13/month |
| Container Registry (Basic) | Basic | $5/month |
| Storage Account | Standard LRS | $1-5/month (depends on usage) |
| Document Intelligence (S0) | Standard | Pay per transaction ($0.001-0.01/page) |

**Total base cost:** ~$20-30/month + transaction costs

### Reduce Costs

1. **Use Free Tiers**: F0 for Document Intelligence (500 pages/month)
2. **Scale Down**: Use B1 App Service Plan instead of S1/P1V2
3. **Delete When Not in Use**: Delete the resource group when not actively developing
4. **Set Budget Alerts**: 
   ```bash
   az consumption budget create \
     --amount 50 \
     --budget-name "doc-intelligence-budget" \
     --resource-group <rg-name> \
     --time-grain Monthly
   ```

## Troubleshooting

### Common Deployment Issues

#### 1. "az command not found"
**Problem:** Azure CLI not installed

**Solution:**
```bash
# Ubuntu/WSL
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash

# macOS
brew install azure-cli
```

#### 2. "jq command not found"
**Problem:** jq JSON processor not installed

**Solution:**
```bash
# Ubuntu/WSL
sudo apt install jq

# macOS
brew install jq
```

#### 3. "make: command not found" (Windows)
**Problem:** Running on Windows without WSL

**Solution:** Install Windows Subsystem for Linux (WSL):
```powershell
# In PowerShell (Administrator)
wsl --install
```

#### 4. Docker Push Fails
**Problem:** Not authenticated to ACR

**Solution:**
```bash
# Manual login
az acr login --name <your-acr-name>

# Verify login
docker images | grep azurecr.io
```

#### 5. Deployment Quota Exceeded
**Problem:** Subscription resource limits reached

**Solution:**
```bash
# Check quota
az vm list-usage --location <location> -o table

# Request quota increase through Azure Portal
# Support → New Support Request → Quota increase
```

#### 6. App Service Not Starting
**Problem:** Container fails to start or health check fails

**Check logs:**
```bash
az webapp log tail --name <app-name> --resource-group <rg-name>
```

**Common causes:**
- Missing environment variables
- Port mismatch (ensure container exposes correct port)
- Application startup errors
- Health check endpoint failing

**Verify environment variables:**
```bash
az webapp config appsettings list \
  --name <app-name> \
  --resource-group <rg-name>
```

#### 7. CORS Errors in Browser
**Problem:** Frontend can't call backend APIs

**Solution:** Update CORS settings:
```bash
az webapp cors add \
  --name <api-name> \
  --resource-group <rg-name> \
  --allowed-origins https://<webui-name>.azurewebsites.net
```

### Get Support

**Check deployment status:**
```bash
# View deployment operations
az deployment sub operation list \
  --name <deployment-name> \
  --output table

# Show failed operations
az deployment sub operation list \
  --name <deployment-name> \
  --query "[?properties.provisioningState=='Failed']"
```

**Resource group events:**
```bash
az monitor activity-log list \
  --resource-group <rg-name> \
  --max-events 50
```

## Clean Up Azure Resources

### Delete Everything

To delete all deployed resources and stop incurring charges:

```bash
# Get your resource group name
az group list --output table

# Delete the resource group (WARNING: This deletes EVERYTHING)
az group delete --name <resource-group-name> --yes --no-wait
```

**⚠️ Warning:** This action is **irreversible** and will delete:
- All App Services
- Container Registry and images
- Storage Account and data
- AI Services
- All configurations and logs

### Selective Cleanup

To keep infrastructure but remove containers:

```bash
# Stop App Services (stops billing for compute)
az webapp stop --name <app-name> --resource-group <rg-name>

# Delete containers from ACR
az acr repository delete --name <acr-name> --repository <repo-name> --yes
```

## Next Steps

- **Monitor your application**: Set up Application Insights
- **Configure custom domain**: Add your own domain name
- **Enable HTTPS**: Configure SSL certificates
- **Set up CI/CD**: Automate deployments with GitHub Actions or Azure DevOps
- **Scale your application**: Configure auto-scaling rules
- **Add authentication**: Integrate Azure AD B2C

## Additional Resources

- [Azure App Service Documentation](https://learn.microsoft.com/azure/app-service/)
- [Azure Container Registry Documentation](https://learn.microsoft.com/azure/container-registry/)
- [Azure Bicep Documentation](https://learn.microsoft.com/azure/azure-resource-manager/bicep/)
- [Azure CLI Reference](https://learn.microsoft.com/cli/azure/)
- [Azure Pricing Calculator](https://azure.microsoft.com/pricing/calculator/)
