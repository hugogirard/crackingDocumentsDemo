from config import Config
from azure.ai.documentintelligence.aio import DocumentIntelligenceClient, DocumentIntelligenceAdministrationClient
from azure.ai.documentintelligence.models import AnalyzeDocumentRequest, DocumentModelDetails
from azure.core.credentials import AzureKeyCredential
from models import (
    DocumentResponse, 
    DocModel, 
    DocumentField, 
    BoundingRegion,
    OrderDetailsField,
    OrderDetailItem
)
from typing import List, Any, Optional
from .base_document_service import BaseDocumentService

class DocumentService(BaseDocumentService):

    def __init__(self, config:Config):
        self.client = DocumentIntelligenceClient(endpoint=config.document_intelligence_endpoint,
                                                 credential=AzureKeyCredential(config.document_intelligence_key))
        
        self.admin_client = DocumentIntelligenceAdministrationClient(endpoint=config.document_intelligence_endpoint,
                                                                     credential=AzureKeyCredential(config.document_intelligence_key))
        self.model_id = config.doc_intelligence_model_id

    async def start_analyzing(self,url_document:str) -> DocumentResponse | None:

        request = AnalyzeDocumentRequest(url_source=url_document)

        poller = await self.client.begin_analyze_document(model_id=self.model_id,
                                                          body=request)
        
        # This is a bad practices, won't scale only for demo purpose
        result = await poller.result()

        # Return only the first document
        if result.documents:
            doc = result.documents[0]
            
            # Convert fields to DocumentField objects
            converted_fields = {}
            order_details_field = None
            
            if doc.fields:
                for k, v in doc.fields.items():
                    if k == 'OrderDetails':
                        # Handle OrderDetails separately
                        order_details_field = self._convert_order_details(v)
                    else:
                        # Handle simple fields
                        converted_fields[k] = self._convert_field(v)

            return DocumentResponse(
                doc_type=doc.doc_type,
                fields=converted_fields,
                order_details=order_details_field,
                confidence=doc.confidence
            )
        
        return None
    
    async def get_models(self) -> List[DocModel]:

        docs = self.admin_client.list_models()

        doc_models = []
        async for doc in docs:
            doc_models.append(DocModel(model_id=doc.model_id,description=doc.description))

        return doc_models
    
    def _convert_field(self, field: Any) -> DocumentField:
        """Convert Azure DI field to our DocumentField model."""
        field_data = {
            'content': getattr(field, 'content', None),
            'confidence': getattr(field, 'confidence', None),
        }
        
        # Convert bounding regions
        if bounding_regions := getattr(field, 'bounding_regions', None):
            field_data['bounding_regions'] = [
                BoundingRegion(page_number=r.page_number, polygon=r.polygon)
                for r in bounding_regions
            ]
        
        return DocumentField(**field_data) 

    def _convert_order_details(self, field: Any) -> OrderDetailsField:
        """Convert OrderDetails array field to OrderDetailsField."""
        items = []
        
        if hasattr(field, 'value_array') and field.value_array:
            for item in field.value_array:
                if hasattr(item, 'value_object') and item.value_object:
                    obj = item.value_object
                    items.append(OrderDetailItem(
                        details=self._get_field_value(obj, 'Details'),
                        quantity=self._get_field_value(obj, 'Quantity'),
                        unit_price=self._get_field_value(obj, 'Unit Price'),
                        total=self._get_field_value(obj, 'Total')
                    ))
        
        return OrderDetailsField(items=items)

    def _get_field_value(self, obj: Any, key: str) -> Optional[str]:
        """Extract value_string from a nested field object."""
        if hasattr(obj, 'get'):
            field = obj.get(key)
            if field and hasattr(field, 'value_string'):
                return field.value_string
        elif hasattr(obj, key):
            field = getattr(obj, key)
            if field and hasattr(field, 'value_string'):
                return field.value_string
        return None       
