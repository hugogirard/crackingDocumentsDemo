from azure.ai.documentintelligence import DocumentIntelligenceAdministrationClient
from azure.ai.documentintelligence.models import (
    BuildDocumentModelRequest, 
    DocumentBuildMode, 
    DocumentModelDetails,
    AzureBlobContentSource
)
from azure.core.credentials import AzureKeyCredential

class DocumentService:

    def __init__(self,endpoint:str, key:str):
        
        self.doc_admin_client = DocumentIntelligenceAdministrationClient(endpoint=endpoint,
                                                                         credential=AzureKeyCredential(key))
        
    def create_custom_model(self,model_id:str,description:str,container_sas_url:str) -> DocumentModelDetails:

        model = BuildDocumentModelRequest(model_id=model_id,
                                          description=description,
                                          build_mode=DocumentBuildMode.TEMPLATE,
                                          azure_blob_source=AzureBlobContentSource(container_url=container_sas_url),                                          
                                          allow_overwrite=True)

        poller = self.doc_admin_client.begin_build_document_model(body=model)

        poller.wait()

        return poller.result()