targetScope = 'subscription'

param mainLocation string
param contentUnderstandingLocation string
param resourceGroupName string

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
module foundry 'br/public:avm/res/cognitive-services/account:0.14.1' = {
  scope: rg
  name: 'foundry'
  params: {
    kind: 'AIServices'
    name: 'ai-${suffix}'
    location: contentUnderstandingLocation
    publicNetworkAccess: 'Enabled'
    disableLocalAuth: false
    tags: {
      SecurityControl: 'Ignore'
    }
  }
}

module project 'modules/project.bicep' = {
  scope: rg
  params: {
    location: contentUnderstandingLocation
    foundryResourceName: foundry.outputs.name
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
