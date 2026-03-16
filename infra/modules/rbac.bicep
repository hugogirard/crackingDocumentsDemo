@description('Built-in Role: [Cognitive Service Contributor]')
resource cognitive_service_contributor 'Microsoft.Authorization/roleDefinitions@2022-04-01' existing = {
  name: '25fbc0a9-bd7c-42a3-aa1a-3b75d497ee68'
  scope: subscription()
}

module webArcPull 'br/public:avm/ptn/authorization/resource-role-assignment:0.1.2' = [
  for id in webAppPrincipalIds: {
    name: 'webArcPull-${id}'
    params: {
      principalId: id
      resourceId: containerRegistryResourceId
      roleDefinitionId: acr_pull.id
    }
  }
]