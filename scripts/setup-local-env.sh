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
ENV_FILE="$PROJECT_ROOT/src/.env"
ENV_EXAMPLE="$PROJECT_ROOT/src/.env.example"

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║      Local Environment Setup                              ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Check if .env already exists
if [ -f "$ENV_FILE" ]; then
    echo -e "${YELLOW}⚠️  $ENV_FILE already exists.${NC}"
    read -p "Do you want to overwrite it? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${YELLOW}Setup cancelled. Edit $ENV_FILE manually.${NC}"
        exit 0
    fi
fi

# Check for Azure deployment
echo -e "${YELLOW}Checking for Azure deployment...${NC}"
DEPLOYMENT_NAME=$(az deployment sub list --query "[?contains(name, 'doc-intelligence-deployment')].name | sort(@) | [-1]" -o tsv 2>/dev/null || echo "")

if [ -n "$DEPLOYMENT_NAME" ]; then
    echo -e "${GREEN}✓ Found Azure deployment: $DEPLOYMENT_NAME${NC}"
    echo -e "${YELLOW}Extracting configuration from Azure...${NC}"
    echo ""
    
    # Get outputs from the deployment
    OUTPUTS=$(az deployment sub show --name "$DEPLOYMENT_NAME" --query properties.outputs -o json)
    
    DOC_INTELLIGENCE_ENDPOINT=$(echo "$OUTPUTS" | jq -r '.documentIntelligenceEndpoint.value // empty')
    STORAGE_ACCOUNT_NAME=$(echo "$OUTPUTS" | jq -r '.storageAccountName.value // empty')
    RESOURCE_GROUP=$(echo "$OUTPUTS" | jq -r '.resourceGroupName.value // empty')
    DOC_INTELLIGENCE_NAME=$(echo "$OUTPUTS" | jq -r '.documentIntelligenceName.value // empty')
    CONTENT_UNDERSTANDING_ENDPOINT=$(echo "$OUTPUTS" | jq -r '.contentUnderstandingEndpoint.value // empty')
    CONTENT_UNDERSTANDING_NAME=$(echo "$OUTPUTS" | jq -r '.contentUnderstandingName.value // empty')
    
    # Retrieve API keys from Azure
    echo -e "${YELLOW}Retrieving API keys from Azure resources...${NC}"
    
    if [ -n "$DOC_INTELLIGENCE_NAME" ] && [ -n "$RESOURCE_GROUP" ]; then
        DOC_INTELLIGENCE_KEY=$(az cognitiveservices account keys list \
            --name "$DOC_INTELLIGENCE_NAME" \
            --resource-group "$RESOURCE_GROUP" \
            --query key1 -o tsv)
        echo -e "  ${GREEN}✓${NC} Document Intelligence key retrieved"
    fi
    
    if [ -n "$CONTENT_UNDERSTANDING_NAME" ] && [ -n "$RESOURCE_GROUP" ]; then
        CONTENT_UNDERSTANDING_KEY=$(az cognitiveservices account keys list \
            --name "$CONTENT_UNDERSTANDING_NAME" \
            --resource-group "$RESOURCE_GROUP" \
            --query key1 -o tsv 2>/dev/null || echo "")
        if [ -n "$CONTENT_UNDERSTANDING_KEY" ]; then
            echo -e "  ${GREEN}✓${NC} Content Understanding key retrieved"
        fi
    fi
    
    if [ -n "$STORAGE_ACCOUNT_NAME" ] && [ -n "$RESOURCE_GROUP" ]; then
        STORAGE_CONNECTION_STRING=$(az storage account show-connection-string \
            --name "$STORAGE_ACCOUNT_NAME" \
            --resource-group "$RESOURCE_GROUP" \
            --query connectionString -o tsv)
        
        STORAGE_ACCOUNT_KEY=$(az storage account keys list \
            --account-name "$STORAGE_ACCOUNT_NAME" \
            --resource-group "$RESOURCE_GROUP" \
            --query "[0].value" -o tsv)
        echo -e "  ${GREEN}✓${NC} Storage Account credentials retrieved"
    fi
    
    # Create .env file with Azure values
    echo ""
    echo -e "${YELLOW}Creating $ENV_FILE with Azure credentials...${NC}"
    cat > "$ENV_FILE" << EOF
# Local Development Environment Configuration
# Auto-generated from Azure deployment: $DEPLOYMENT_NAME
# Generated at: $(date)

# Azure Document Intelligence
DOCUMENT_INTELLIGENCE_ENDPOINT=$DOC_INTELLIGENCE_ENDPOINT
DOCUMENT_INTELLIGENCE_API_KEY=$DOC_INTELLIGENCE_KEY

# Azure Content Understanding
CONTENT_UNDERSTANDING_ENDPOINT=${CONTENT_UNDERSTANDING_ENDPOINT:-}
CONTENT_UNDERSTANDING_API_VERSION=2024-02-01
CONTENT_UNDERSTANDING_API_KEY=${CONTENT_UNDERSTANDING_KEY:-}

# Azure Storage
STORAGE_CONNECTION_STRING=$STORAGE_CONNECTION_STRING
STORAGE_ACCOUNT_KEY=$STORAGE_ACCOUNT_KEY
STORAGE_CONTAINER_NAME=documents

# Model Builder (for custom model training)
DOC_INTELLIGENCE_TRAINING_CONTAINER=training-data
MODEL_DEPLOYMENTS={"deployments":[]}

# Optional: Valet API settings
VALET_API_URL=http://localhost:8000
EOF
    
    echo -e "${GREEN}✓ Successfully created $ENV_FILE with Azure credentials!${NC}"
    echo ""
    echo -e "${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║      Environment Setup Complete!                          ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${BLUE}Configuration:${NC}"
    echo -e "  Resource Group: ${GREEN}$RESOURCE_GROUP${NC}"
    echo -e "  Document Intelligence: ${GREEN}$DOC_INTELLIGENCE_NAME${NC}"
    echo -e "  Storage Account: ${GREEN}$STORAGE_ACCOUNT_NAME${NC}"
    echo ""
    echo -e "${YELLOW}Next steps:${NC}"
    echo -e "  1. Review the configuration: ${BLUE}nano $ENV_FILE${NC}"
    echo -e "  2. Copy to API services: ${BLUE}make setup-local${NC}"
    echo -e "  3. Start services: ${BLUE}make up${NC}"
    echo ""
    
elif [ -f "$ENV_EXAMPLE" ]; then
    echo -e "${YELLOW}No Azure deployment found.${NC}"
    echo -e "${YELLOW}Creating $ENV_FILE from template...${NC}"
    echo ""
    
    cp "$ENV_EXAMPLE" "$ENV_FILE"
    
    echo -e "${GREEN}✓ Created $ENV_FILE from .env.example${NC}"
    echo ""
    echo -e "${YELLOW}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${YELLOW}║      Manual Configuration Required!                        ║${NC}"
    echo -e "${YELLOW}╚════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${RED}You need to manually configure Azure credentials.${NC}"
    echo ""
    echo -e "${YELLOW}Option 1: Deploy Azure infrastructure first${NC}"
    echo -e "  ${BLUE}make deploy-infra${NC}"
    echo -e "  ${BLUE}make setup${NC}  (will auto-populate from Azure)"
    echo ""
    echo -e "${YELLOW}Option 2: Use existing Azure resources${NC}"
    echo -e "  Edit ${BLUE}$ENV_FILE${NC} and add your Azure credentials:"
    echo -e "  - DOCUMENT_INTELLIGENCE_ENDPOINT"
    echo -e "  - DOCUMENT_INTELLIGENCE_API_KEY"
    echo -e "  - CONTENT_UNDERSTANDING_ENDPOINT"
    echo -e "  - CONTENT_UNDERSTANDING_API_KEY"
    echo -e "  - STORAGE_CONNECTION_STRING"
    echo -e "  - STORAGE_ACCOUNT_KEY"
    echo ""
    echo -e "${YELLOW}Next steps:${NC}"
    echo -e "  1. Edit configuration: ${BLUE}nano $ENV_FILE${NC}"
    echo -e "  2. Copy to API services: ${BLUE}make setup-local${NC}"
    echo -e "  3. Start services: ${BLUE}make up${NC}"
    echo ""
    
else
    echo -e "${RED}✗ Error: .env.example not found at $ENV_EXAMPLE${NC}"
    exit 1
fi
