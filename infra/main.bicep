targetScope = 'subscription'

param mainLocation string
param contentUnderstandingLocation string
param resourceGroupName string

@description('The model for the chat completion')
param chatCompleteionDeploymentName string

@description('The SKU of the chat completion model')
param chatDeploymentSku string

@description('The properties of the chat model')
param chatModelProperties object

@description('The chat model SKU capacity')
param chatModelSkuCapacity int

resource rg 'Microsoft.Resources/resourceGroups@2025-04-01' = {
  name: resourceGroupName
  location: mainLocation
}

var suffix = uniqueString(rg.id)

module doc 'modules/docIntelligence.bicep' = {
  scope: rg
  name: 'docIntelligence'
  params: {
    location: mainLocation
    suffix: suffix
  }
}

/* Content understanding reside in foundry */
module project 'modules/foundry.bicep' = {
  scope: rg
  params: {
    location: contentUnderstandingLocation
    suffix: suffix
  }
}

module model 'modules/model.bicep' = {
  scope: rg
  params: {
    aiFoundryAccountName: project.outputs.foundryResourceName
    deploymentName: chatCompleteionDeploymentName
    deploymentSku: chatDeploymentSku
    modelProperties: chatModelProperties
    skuCapacity: chatModelSkuCapacity
    versionUpgradeOption: 'OnceNewDefaultVersionAvailable'
  }
}

/* Application Stack */
module registry 'br/public:avm/res/container-registry/registry:0.10.0' = {
  scope: rg
  params: {
    name: 'acr${toLower(replace(suffix,'-',''))}'
    location: mainLocation
    publicNetworkAccess: 'Enabled'
    acrAdminUserEnabled: true
    acrSku: 'Standard'
    tags: {
      SecurityControl: 'Ignore'
    }
  }
}

module serverFarm 'modules/serverFarm.bicep' = {
  scope: rg
  params: {
    location: mainLocation
    suffix: suffix
  }
}

/* Storage to upload training documents */
module storageAccount 'br/public:avm/res/storage/storage-account:0.31.0' = {
  scope: rg
  name: 'storage'
  params: {
    name: 'str${replace(suffix,'-','')}'
    kind: 'StorageV2'
    skuName: 'Standard_LRS'
    publicNetworkAccess: 'Enabled'
    networkAcls: {
      defaultAction: 'Allow'
      ipRules: []
      bypass: 'AzureServices'
      virtualNetworkRules: []
    }
    allowBlobPublicAccess: true
    allowSharedKeyAccess: true
    blobServices: {
      corsRules: [
        {
          allowedOrigins: ['https://documentintelligence.ai.azure.com']
          allowedHeaders: ['*']
          allowedMethods: ['CONNECT', 'DELETE', 'GET', 'HEAD', 'MERGE', 'OPTIONS', 'PATCH', 'POST', 'PUT', 'TRACE']
          exposedHeaders: ['*']
          maxAgeInSeconds: 120
        }
        {
          allowedOrigins: ['http://localhost:5500']
          allowedHeaders: ['*']
          allowedMethods: ['OPTIONS', 'PUT']
          exposedHeaders: ['*']
          maxAgeInSeconds: 120
        }
      ]
    }
    tags: {
      SecurityControl: 'Ignore'
    }
  }
}
