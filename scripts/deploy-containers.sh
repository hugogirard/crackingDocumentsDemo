#!/bin/bash

# Exit on error
set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get the directory where the script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║      Document Intelligence Container Deployment           ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Check prerequisites
echo -e "${YELLOW}Checking prerequisites...${NC}"
if ! command -v az &> /dev/null; then
    echo -e "${RED}✗ Azure CLI is not installed. Please install it first.${NC}"
    exit 1
fi

if ! command -v docker &> /dev/null; then
    echo -e "${RED}✗ Docker is not installed. Please install it first.${NC}"
    exit 1
fi

if ! az account show &> /dev/null; then
    echo -e "${RED}✗ Not logged in to Azure. Please run 'az login' first.${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Prerequisites check passed${NC}"
echo ""

# Get deployment name from bicep outputs
echo -e "${YELLOW}Fetching Azure resources information...${NC}"
DEPLOYMENT_NAME=$(az deployment sub list --query "[?contains(name, 'doc-intelligence-deployment')].name | sort(@) | [-1]" -o tsv)

if [ -z "$DEPLOYMENT_NAME" ]; then
    echo -e "${RED}✗ No deployment found. Please run 'make deploy-infra' first.${NC}"
    exit 1
fi

# Get outputs from the deployment
OUTPUTS=$(az deployment sub show --name "$DEPLOYMENT_NAME" --query properties.outputs -o json)

RESOURCE_GROUP=$(echo "$OUTPUTS" | jq -r '.resourceGroupName.value')
ACR_NAME=$(echo "$OUTPUTS" | jq -r '.containerRegistryName.value')
ACR_LOGIN_SERVER=$(echo "$OUTPUTS" | jq -r '.containerRegistryLoginServer.value')
WEBUI_NAME=$(echo "$OUTPUTS" | jq -r '.webuiName.value')
WEBUI_URL=$(echo "$OUTPUTS" | jq -r '.webuiUrl.value')
DOCUMENT_API_NAME=$(echo "$OUTPUTS" | jq -r '.documentApiName.value')
DOCUMENT_API_URL=$(echo "$OUTPUTS" | jq -r '.documentApiUrl.value')
VALET_API_NAME=$(echo "$OUTPUTS" | jq -r '.valetApiName.value')
VALET_API_URL=$(echo "$OUTPUTS" | jq -r '.valetApiUrl.value')

echo -e "${GREEN}✓ Found deployment: $DEPLOYMENT_NAME${NC}"
echo -e "  Resource Group: $RESOURCE_GROUP"
echo -e "  Container Registry: $ACR_NAME"
echo -e "  Web UI: $WEBUI_NAME"
echo -e "  Document API: $DOCUMENT_API_NAME"
echo -e "  Valet API: $VALET_API_NAME"
echo ""
echo -e "${BLUE}Frontend will be configured with:${NC}"
echo -e "  VALET_API_URL: ${VALET_API_URL}/api"
echo -e "  DOCUMENT_API_URL: ${DOCUMENT_API_URL}"
echo ""

# Login to ACR
echo -e "${YELLOW}Logging into Azure Container Registry...${NC}"
az acr login --name "$ACR_NAME"
echo -e "${GREEN}✓ Logged into ACR${NC}"
echo ""

# Build and push containers
IMAGE_TAG="latest"

echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}Building and pushing containers...${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo ""

# 1. Document API
echo -e "${YELLOW}[1/3] Building document-api...${NC}"
docker build -t "${ACR_LOGIN_SERVER}/document-api:${IMAGE_TAG}" \
    "$PROJECT_ROOT/src/api/document-api"
echo -e "${GREEN}✓ Built document-api${NC}"

echo -e "${YELLOW}Pushing document-api to ACR...${NC}"
docker push "${ACR_LOGIN_SERVER}/document-api:${IMAGE_TAG}"
echo -e "${GREEN}✓ Pushed document-api${NC}"
echo ""

# 2. Valet API
echo -e "${YELLOW}[2/3] Building valet-api...${NC}"
docker build -t "${ACR_LOGIN_SERVER}/valet-api:${IMAGE_TAG}" \
    "$PROJECT_ROOT/src/api/valet-api"
echo -e "${GREEN}✓ Built valet-api${NC}"

echo -e "${YELLOW}Pushing valet-api to ACR...${NC}"
docker push "${ACR_LOGIN_SERVER}/valet-api:${IMAGE_TAG}"
echo -e "${GREEN}✓ Pushed valet-api${NC}"
echo ""

# 3. WebUI
echo -e "${YELLOW}[3/3] Building webui...${NC}"
docker build -t "${ACR_LOGIN_SERVER}/webui:${IMAGE_TAG}" \
    "$PROJECT_ROOT/src/webui"
echo -e "${GREEN}✓ Built webui${NC}"

echo -e "${YELLOW}Pushing webui to ACR...${NC}"
docker push "${ACR_LOGIN_SERVER}/webui:${IMAGE_TAG}"
echo -e "${GREEN}✓ Pushed webui${NC}"
echo ""

echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}Configuring Azure Web Apps...${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo ""

# Configure Document API - only set container image
echo -e "${YELLOW}[1/3] Configuring document-api...${NC}"
az webapp config container set \
    --name "$DOCUMENT_API_NAME" \
    --resource-group "$RESOURCE_GROUP" \
    --container-image-name "${ACR_LOGIN_SERVER}/document-api:${IMAGE_TAG}" \
    --container-registry-url "https://${ACR_LOGIN_SERVER}" \
    --output none

echo -e "${GREEN}✓ Configured document-api${NC}"
echo ""

# Configure Valet API - only set container image
echo -e "${YELLOW}[2/3] Configuring valet-api...${NC}"
az webapp config container set \
    --name "$VALET_API_NAME" \
    --resource-group "$RESOURCE_GROUP" \
    --container-image-name "${ACR_LOGIN_SERVER}/valet-api:${IMAGE_TAG}" \
    --container-registry-url "https://${ACR_LOGIN_SERVER}" \
    --output none

echo -e "${GREEN}✓ Configured valet-api${NC}"
echo ""

# Configure WebUI - set container image and environment variables
echo -e "${YELLOW}[3/3] Configuring webui...${NC}"
az webapp config container set \
    --name "$WEBUI_NAME" \
    --resource-group "$RESOURCE_GROUP" \
    --container-image-name "${ACR_LOGIN_SERVER}/webui:${IMAGE_TAG}" \
    --container-registry-url "https://${ACR_LOGIN_SERVER}" \
    --output none

az webapp config appsettings set \
    --name "$WEBUI_NAME" \
    --resource-group "$RESOURCE_GROUP" \
    --settings \
        VALET_API_URL="${VALET_API_URL}/api" \
        DOCUMENT_API_URL="$DOCUMENT_API_URL" \
        STORAGE_CONTAINER_NAME="documents" \
        WEBSITES_PORT=80 \
    --output none

echo -e "${GREEN}✓ Configured webui${NC}"
echo ""

# Restart all apps to apply changes
echo -e "${YELLOW}Restarting web apps...${NC}"
az webapp restart --name "$DOCUMENT_API_NAME" --resource-group "$RESOURCE_GROUP" --output none &
az webapp restart --name "$VALET_API_NAME" --resource-group "$RESOURCE_GROUP" --output none &
az webapp restart --name "$WEBUI_NAME" --resource-group "$RESOURCE_GROUP" --output none &
wait

echo -e "${GREEN}✓ All apps restarted${NC}"
echo ""

echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✓ Deployment completed successfully!${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "Your application URLs:"
echo -e "  ${BLUE}Web UI:${NC}         $WEBUI_URL"
echo -e "  ${BLUE}Document API:${NC}   $DOCUMENT_API_URL"
echo -e "  ${BLUE}Valet API:${NC}      $VALET_API_URL"
echo ""
echo -e "${YELLOW}Note: It may take a few minutes for the containers to start.${NC}"
echo -e "${YELLOW}You can monitor the logs with:${NC}"
echo -e "  az webapp log tail --name $WEBUI_NAME --resource-group $RESOURCE_GROUP"
echo ""
