param foundryResourceName string
param storageResourceName string
param storageResourceId string

resource storage 'Microsoft.Storage/storageAccounts@2025-06-01' existing = {
  name: storageResourceName
}

resource foundry 'Microsoft.CognitiveServices/accounts@2025-09-01' existing = {
  name: foundryResourceName
}

resource storageConnection 'Microsoft.CognitiveServices/accounts/connections@2025-06-01' = {
  name: storageResourceName
  parent: foundry
  properties: {
    authType: 'AccountKey'
    category: 'AzureStorageAccount'
    target: 'https://${storageResourceName}.blob.core.windows.net/'
    useWorkspaceManagedIdentity: false
    isSharedToAll: true
    peRequirement: 'NotRequired'
    peStatus: 'NotApplicable'
    credentials: {
      key: storage.listKeys().keys[0].value
    }
    metadata: {
      ApiType: 'Azure'
      ResourceId: storageResourceId
    }
  }
}
