param foundryResourceName string
param location string

resource account 'Microsoft.CognitiveServices/accounts@2025-04-01-preview' existing = {
  name: foundryResourceName
}

resource project 'Microsoft.CognitiveServices/accounts/projects@2025-04-01-preview' = {
  parent: account
  name: 'PurchaseOrder'
  location: location
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    description: 'Purchase order Automation'
    displayName: 'PurchaseOrder'
  }
}
