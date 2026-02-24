targetScope = 'subscription'

param mainLocation string
param contentUnderstandingLocation string
param resourceGroupName string

resource rg 'Microsoft.Resources/resourceGroups@2025-04-01' = {
  name: resourceGroupName
  location: mainLocation
}

var suffix = uniqueString(rg.id)

module docIntelligence 'br/public:avm/res/cognitive-services/account:0.14.1' = {
  scope: rg
  name: 'docIntelligence'
  params: {
    kind: 'FormRecognizer'
    name: 'doc-${suffix}'
    location: mainLocation
    publicNetworkAccess: 'Enabled'
    disableLocalAuth: false
    tags: {
      SecurityControl: 'Ignore'
    }
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
      ]
    }
    tags: {
      SecurityControl: 'Ignore'
    }
  }
}
