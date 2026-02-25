param suffix string
param location string

resource asp 'Microsoft.Web/serverfarms@2025-03-01' = {
  name: 'asp-${suffix}'
  location: location
  kind: 'linux'
  properties: {
    reserved: true
    zoneRedundant: false
  }
  sku: {
    name: 'P1V3'
    tier: 'PremiumV3'
  }
}
