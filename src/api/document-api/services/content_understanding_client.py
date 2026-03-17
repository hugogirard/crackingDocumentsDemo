from config import Config
from fastapi import Depends
from azure.identity.aio import DefaultAzureCredential
from .base_document_service import BaseDocumentService
from models import DocumentResponse, DocModel, DocumentField, BoundingRegion
from typing import List
from aiohttp import ClientSession

class ContentUnderstandingClient(BaseDocumentService):

    def __init__(self,client_session:ClientSession,config:Config):
        self.credential = DefaultAzureCredential()
        self.headers = self._get_headers(subscription_key=config.content_understanding_api_key,
                                         x_ms_useragent='document-api')
        self.endpoint = config.content_understanding_endpoint
        self.analyzer_id = config.content_understanding_custom_model_id
        self.api_version = config.content_understanding_api_version
        self.http_client = client_session

    async def start_analyzing(self,url_document:str) -> DocumentResponse | None:
        url = f"{self.endpoint}/contentunderstanding/analyzers/{self.analyzer_id}:analyze?api-version={self.api_version}&stringEncoding=utf16"

        data = {"url": url_document}

        async with self.http_client.post(url=url,data=data,headers=self.headers) as resp:
            json_result = await resp.json()

        return self._create_response(json_result)
        #await requests.post(url=url,headers=self.headers,json=data)

    async def get_models(self) -> List[DocModel]:
        pass


    def _get_headers(
        self, subscription_key: str, x_ms_useragent: str
    ) -> dict[str, str]:
        """Returns the headers for the HTTP requests.
        Args:
            subscription_key (str): The subscription key for the service.
            api_token (str): The API token for the service.
            enable_face_identification (bool): A flag to enable face identification.
        Returns:
            dict: A dictionary containing the headers for the HTTP requests.
        """
        headers = {
            "Ocp-Apim-Subscription-Key": subscription_key,
            "x-ms-useragent": x_ms_useragent,
            "Content-Type": "application/json"
        }
        return headers
    
    def _create_response(self,json_result:any) -> DocumentResponse:

        contents = json_result.get("result", {}).get("contents", [])
        
        if not contents:
            return None
        
        content = contents[0]
        api_fields = content.get("fields", {})
        
        # Map to DocumentResponse
        document_fields = {}
        for field_name, field_data in api_fields.items():
            # Extract the value based on type
            content_value = None
            if "valueString" in field_data:
                content_value = field_data["valueString"]
            elif "valueNumber" in field_data:
                content_value = str(field_data["valueNumber"])
            elif "valueInteger" in field_data:
                content_value = str(field_data["valueInteger"])
            elif "valueDate" in field_data:
                content_value = field_data["valueDate"]
            elif "valueArray" in field_data:
                content_value = str(field_data["valueArray"])  # or handle arrays specially
            
            # Parse bounding regions from source string
            bounding_regions = None
            if "source" in field_data:
                bounding_regions = self._parse_bounding_regions(field_data["source"])
            
            document_fields[field_name] = DocumentField(
                content=content_value,
                confidence=field_data.get("confidence"),
                bounding_regions=bounding_regions
            )       

        return DocumentResponse(
            doc_type=content.get("kind"),  # or use analyzer_id
            fields=document_fields,
            confidence=None  # overall confidence not provided in response
        )         

    def _parse_bounding_regions(self, source: str) -> List[BoundingRegion]:
        """Parse bounding regions from source string like 'D(1,x1,y1,x2,y2,...)'"""
        import re
        
        bounding_regions = []
        # Pattern: D(page_number,coords...)
        pattern = r'D\((\d+),([\d.,]+)\)'
        
        for match in re.finditer(pattern, source):
            page_number = int(match.group(1))
            coords_str = match.group(2)
            polygon = [float(x) for x in coords_str.split(',')]
            
            bounding_regions.append(BoundingRegion(
                page_number=page_number,
                polygon=polygon
            ))
        
        return bounding_regions if bounding_regions else None        