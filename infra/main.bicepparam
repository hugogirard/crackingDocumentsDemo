using 'main.bicep'

param mainLocation = 'canadacentral'

param resourceGroupName = 'rg-doc-intelligence'

param contentUnderstandingLocation = 'swedencentral'

param chatModelProperties = {
  format: 'OpenAI'
  name: 'gpt-5-mini'
  version: '2025-08-07'
}

param chatModelSkuCapacity = 150

param chatCompleteionDeploymentName = 'gpt-5-mini'

param chatDeploymentSku = 'GlobalStandard'
