param location string
param suffix string

var resourceName = 'doc-int-${suffix}'

resource doc 'Microsoft.CognitiveServices/accounts@2024-10-01' = {
  name: resourceName
  location: location
  tags: {
    SecurityControl: 'Ignore'
  }
  sku: {
    name: 'S0'
  }
  identity: {
    type: 'SystemAssigned'
  }
  kind: 'FormRecognizer'
  properties: {
    customSubDomainName: resourceName
    publicNetworkAccess: 'Enabled'
    disableLocalAuth: false
    networkAcls: {
      virtualNetworkRules: []
      defaultAction: 'Allow'
    }
  }
}

output resourceName string = doc.name
