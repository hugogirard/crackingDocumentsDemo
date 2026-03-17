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
MODEL_BUILDER_DIR="$PROJECT_ROOT/src/utility/modelBuilder"
ENV_FILE="$MODEL_BUILDER_DIR/.env"

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║      Model Builder Environment Setup                      ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Check if Azure deployment exists
echo -e "${YELLOW}Checking for Azure deployment...${NC}"
DEPLOYMENT_NAME=$(az deployment sub list --query "[?contains(name, 'doc-intelligence-deployment')].name | sort(@) | [-1]" -o tsv 2>/dev/null || echo "")

if [ -n "$DEPLOYMENT_NAME" ]; then
    echo -e "${GREEN}✓ Found Azure deployment: $DEPLOYMENT_NAME${NC}"
    echo -e "${YELLOW}Extracting configuration from Azure deployment...${NC}"
    
    # Get outputs from the deployment
    OUTPUTS=$(az deployment sub show --name "$DEPLOYMENT_NAME" --query properties.outputs -o json)
    
    DOC_INTELLIGENCE_ENDPOINT=$(echo "$OUTPUTS" | jq -r '.documentIntelligenceEndpoint.value // empty')
    STORAGE_ACCOUNT_NAME=$(echo "$OUTPUTS" | jq -r '.storageAccountName.value // empty')
    RESOURCE_GROUP=$(echo "$OUTPUTS" | jq -r '.resourceGroupName.value // empty')
    DOC_INTELLIGENCE_NAME=$(echo "$OUTPUTS" | jq -r '.documentIntelligenceName.value // empty')
    CONTENT_UNDERSTANDING_ENDPOINT=$(echo "$OUTPUTS" | jq -r '.contentUnderstandingEndpoint.value // empty')
    
    # Get Document Intelligence API key
    if [ -n "$DOC_INTELLIGENCE_NAME" ] && [ -n "$RESOURCE_GROUP" ]; then
        echo -e "${YELLOW}Retrieving Document Intelligence API key...${NC}"
        DOC_INTELLIGENCE_KEY=$(az cognitiveservices account keys list \
            --name "$DOC_INTELLIGENCE_NAME" \
            --resource-group "$RESOURCE_GROUP" \
            --query key1 -o tsv)
    fi
    
    # Get Storage Account credentials
    if [ -n "$STORAGE_ACCOUNT_NAME" ] && [ -n "$RESOURCE_GROUP" ]; then
        echo -e "${YELLOW}Retrieving Storage Account credentials...${NC}"
        STORAGE_CONNECTION_STRING=$(az storage account show-connection-string \
            --name "$STORAGE_ACCOUNT_NAME" \
            --resource-group "$RESOURCE_GROUP" \
            --query connectionString -o tsv)
        
        STORAGE_ACCOUNT_KEY=$(az storage account keys list \
            --account-name "$STORAGE_ACCOUNT_NAME" \
            --resource-group "$RESOURCE_GROUP" \
            --query "[0].value" -o tsv)
    fi
    
    # Create .env file
    echo -e "${YELLOW}Creating $ENV_FILE...${NC}"
    cat > "$ENV_FILE" << EOF
# Model Builder Configuration
# Generated automatically from Azure deployment: $DEPLOYMENT_NAME
# Generated at: $(date)

# Azure Document Intelligence
DOCUMENT_INTELLIGENCE_ENDPOINT=$DOC_INTELLIGENCE_ENDPOINT
DOCUMENT_INTELLIGENCE_API_KEY=$DOC_INTELLIGENCE_KEY

# Azure Storage
STORAGE_CONNECTION_STRING=$STORAGE_CONNECTION_STRING
STORAGE_ACCOUNT_KEY=$STORAGE_ACCOUNT_KEY
DOC_INTELLIGENCE_TRAINING_CONTAINER=training-data

# Azure Content Understanding (Optional)
CONTENT_UNDERSTANDING_ENDPOINT=${CONTENT_UNDERSTANDING_ENDPOINT:-}

# Model Deployments (Optional - for Content Understanding)
MODEL_DEPLOYMENTS={"deployments":[]}
EOF
    
    echo -e "${GREEN}✓ Successfully created $ENV_FILE${NC}"
    echo ""
    
elif [ -f "$PROJECT_ROOT/src/.env" ]; then
    echo -e "${YELLOW}No Azure deployment found. Using local configuration from src/.env${NC}"
    
    # Extract only the needed variables from src/.env
    SOURCE_ENV="$PROJECT_ROOT/src/.env"
    
    echo -e "${YELLOW}Creating $ENV_FILE from local configuration...${NC}"
    
    # Read values from src/.env
    DOC_INTELLIGENCE_ENDPOINT=$(grep "^DOCUMENT_INTELLIGENCE_ENDPOINT=" "$SOURCE_ENV" | cut -d '=' -f2- || echo "")
    DOC_INTELLIGENCE_KEY=$(grep "^DOCUMENT_INTELLIGENCE_API_KEY=" "$SOURCE_ENV" | cut -d '=' -f2- || echo "")
    STORAGE_CONNECTION_STRING=$(grep "^STORAGE_CONNECTION_STRING=" "$SOURCE_ENV" | cut -d '=' -f2- || echo "")
    STORAGE_ACCOUNT_KEY=$(grep "^STORAGE_ACCOUNT_KEY=" "$SOURCE_ENV" | cut -d '=' -f2- || echo "")
    DOC_TRAINING_CONTAINER=$(grep "^DOC_INTELLIGENCE_TRAINING_CONTAINER=" "$SOURCE_ENV" | cut -d '=' -f2- || echo "training-data")
    CONTENT_UNDERSTANDING_ENDPOINT=$(grep "^CONTENT_UNDERSTANDING_ENDPOINT=" "$SOURCE_ENV" | cut -d '=' -f2- || echo "")
    MODEL_DEPLOYMENTS=$(grep "^MODEL_DEPLOYMENTS=" "$SOURCE_ENV" | cut -d '=' -f2- || echo '{"deployments":[]}')
    
    # Create .env file
    cat > "$ENV_FILE" << EOF
# Model Builder Configuration
# Copied from local configuration: src/.env
# Generated at: $(date)

# Azure Document Intelligence
DOCUMENT_INTELLIGENCE_ENDPOINT=$DOC_INTELLIGENCE_ENDPOINT
DOCUMENT_INTELLIGENCE_API_KEY=$DOC_INTELLIGENCE_KEY

# Azure Storage
STORAGE_CONNECTION_STRING=$STORAGE_CONNECTION_STRING
STORAGE_ACCOUNT_KEY=$STORAGE_ACCOUNT_KEY
DOC_INTELLIGENCE_TRAINING_CONTAINER=${DOC_TRAINING_CONTAINER:-training-data}

# Azure Content Understanding (Optional)
CONTENT_UNDERSTANDING_ENDPOINT=$CONTENT_UNDERSTANDING_ENDPOINT

# Model Deployments (Optional - for Content Understanding)
MODEL_DEPLOYMENTS=$MODEL_DEPLOYMENTS
EOF
    
    echo -e "${GREEN}✓ Successfully created $ENV_FILE${NC}"
    echo ""
    
else
    echo -e "${RED}✗ Error: No Azure deployment found and src/.env does not exist${NC}"
    echo -e "${YELLOW}Please either:${NC}"
    echo -e "  1. Run 'make deploy-infra' to deploy Azure resources, or"
    echo -e "  2. Run 'make setup' and configure src/.env with your Azure credentials"
    exit 1
fi

echo -e "${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║      Model Builder Environment Ready                       ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}Configuration file:${NC} $ENV_FILE"
echo ""
echo -e "${YELLOW}Next step:${NC} Run 'make build-models' to build custom models"
echo ""
