targetScope = 'subscription'

param mainLocation string
param contentUnderstandingLocation string
param resourceGroupName string
param servicePrincipalObjectId string

// **** Model for Content Understanding Custom Task and ChatAgent *****

var models = {
  chatModels: [
    {
      deploymentName: 'gpt-5-mini'
      deploymentSku: 'GlobalStandard'
      modelProperties: {
        format: 'OpenAI'
        name: 'gpt-5-mini'
        version: '2025-08-07'
      }
      skuCapacity: 150
    }
    {
      deploymentName: 'gpt-4.1'
      deploymentSku: 'GlobalStandard'
      modelProperties: {
        format: 'OpenAI'
        name: 'gpt-4.1'
        version: '2025-04-14'
      }
      skuCapacity: 120
    }
    {
      deploymentName: 'gpt-4.1-mini'
      deploymentSku: 'GlobalStandard'
      modelProperties: {
        format: 'OpenAI'
        name: 'gpt-4.1-mini'
        version: '2025-04-14'
      }
      skuCapacity: 250
    }
    {
      deploymentName: 'text-embedding-3-large'
      deploymentSku: 'GlobalStandard'
      modelProperties: {
        format: 'OpenAI'
        name: 'text-embedding-3-large'
        version: '1'
      }
      skuCapacity: 150
    }
  ]
}

// *******************************************************

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
module foundry 'modules/foundry.bicep' = {
  scope: rg
  params: {
    location: contentUnderstandingLocation
    suffix: suffix
  }
}

// Content Understanding model
@batchSize(1) // Running in parallel make the template crash
module contentChatModels 'modules/model.bicep' = [
  for model in models.chatModels: {
    scope: rg
    params: {
      aiFoundryAccountName: foundry.outputs.foundryResourceName
      deploymentName: model.deploymentName
      deploymentSku: model.deploymentSku
      modelProperties: model.modelProperties
      skuCapacity: model.skuCapacity
      versionUpgradeOption: 'OnceNewDefaultVersionAvailable'
    }
  }
]

module storageAccountFoundry 'br/public:avm/res/storage/storage-account:0.31.0' = {
  scope: rg
  name: 'storageAccountFoundry'
  params: {
    name: 'strf${replace(suffix,'-','')}'
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
    tags: {
      SecurityControl: 'Ignore'
    }
  }
}

module connection 'modules/connections.bicep' = {
  scope: rg
  params: {
    foundryResourceName: foundry.outputs.foundryResourceName
    storageResourceId: storageAccountFoundry.outputs.resourceId
    storageResourceName: storageAccountFoundry.outputs.name
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
      containers: [
        {
          name: 'upload'
        }
      ]
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

// output variables
output documentIntelligenceEndpoint string = 'https://${doc.outputs.resourceName}.cognitiveservices.azure.com/'
output documentIntelligenceResourceName string = doc.outputs.resourceName
output contentUnderstandingEndpoint string = 'https://${foundry.outputs.foundryResourceName}.services.ai.azure.com/'
output contentUnderstandingResourceName string = foundry.outputs.foundryResourceName
output resourceGroupName string = rg.name
output storageTrainingResourceName string = storageAccountFoundry.outputs.name
