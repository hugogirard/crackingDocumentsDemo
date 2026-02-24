#!/bin/bash

# Exit on error
set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Get the directory where the script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Configuration
BICEP_FILE="$PROJECT_ROOT/infra/main.bicep"
BICEPPARAM_FILE="$PROJECT_ROOT/infra/main.bicepparam"
DEPLOYMENT_NAME="doc-intelligence-deployment-$(date +%Y%m%d-%H%M%S)"

echo -e "${YELLOW}Starting deployment...${NC}"
echo "Deployment name: $DEPLOYMENT_NAME"

# Check if Azure CLI is installed
if ! command -v az &> /dev/null; then
    echo -e "${RED}Azure CLI is not installed. Please install it first.${NC}"
    exit 1
fi

# Check if logged in to Azure
if ! az account show &> /dev/null; then
    echo -e "${RED}Not logged in to Azure. Please run 'az login' first.${NC}"
    exit 1
fi

# Display current subscription
SUBSCRIPTION_NAME=$(az account show --query name -o tsv)
SUBSCRIPTION_ID=$(az account show --query id -o tsv)
echo -e "${YELLOW}Current subscription:${NC} $SUBSCRIPTION_NAME ($SUBSCRIPTION_ID)"

# Confirm deployment
read -p "Do you want to proceed with the deployment? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}Deployment cancelled.${NC}"
    exit 0
fi

# Deploy the Bicep template
echo -e "${YELLOW}Deploying Bicep template...${NC}"

az deployment sub create \
    --name "$DEPLOYMENT_NAME" \
    --location "canadacentral" \
    --template-file "$BICEP_FILE" \
    --parameters "$BICEPPARAM_FILE"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}Deployment completed successfully!${NC}"
else
    echo -e "${RED}Deployment failed!${NC}"
    exit 1
fi
