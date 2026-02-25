param suffix string
param location string

var foundryResourceName = 'foundry-${suffix}'

#disable-next-line BCP036
resource account 'Microsoft.CognitiveServices/accounts@2025-04-01-preview' = {
  name: foundryResourceName
  location: location
  tags: {
    SecurityControl: 'Ignore'
  }
  sku: {
    name: 'S0'
  }
  kind: 'AIServices'
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    allowProjectManagement: true
    customSubDomainName: foundryResourceName
    networkAcls: {
      defaultAction: 'Allow'
      virtualNetworkRules: []
      ipRules: []
      bypass: 'AzureServices'
    }
    publicNetworkAccess: 'Enabled'
    networkInjections: null
    disableLocalAuth: false
  }
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

output foundryResourceName string = account.name
