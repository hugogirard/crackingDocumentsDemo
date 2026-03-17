targetScope = 'subscription'

param mainLocation string
param contentUnderstandingLocation string
param resourceGroupName string

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
    storageResourceName: storageAccount.outputs.name
    documentIntelligenceResourceName: doc.outputs.resourceName
    foundryResourceName: foundry.outputs.foundryResourceName
    acrResourceName: registry.outputs.name
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
          allowedOrigins: ['*']
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

// output variables
output resourceGroupName string = rg.name
output containerRegistryName string = registry.outputs.name
output containerRegistryLoginServer string = registry.outputs.loginServer
output webuiName string = serverFarm.outputs.webuiName
output webuiUrl string = 'https://${serverFarm.outputs.webuiDefaultHostName}'
output documentApiName string = serverFarm.outputs.documentApiName
output documentApiUrl string = 'https://${serverFarm.outputs.documentApiDefaultHostName}'
output valetApiName string = serverFarm.outputs.valetApiName
output valetApiUrl string = 'https://${serverFarm.outputs.valetApiDefaultHostName}'
