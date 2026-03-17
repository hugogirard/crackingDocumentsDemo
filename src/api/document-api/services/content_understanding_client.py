from config import Config
from azure.identity.aio import DefaultAzureCredential
from .base_document_service import BaseDocumentService
from models import DocumentResponse, DocModel
from typing import List
import requests
import aiohttp
import asyncio

class ContentUnderstandingClient(BaseDocumentService):

    def __init__(self,config:Config):
        self.credential = DefaultAzureCredential()
        self.headers = self._get_headers(subscription_key=config.content_understanding_api_key,
                                         x_ms_useragent='document-api')
        self.endpoint = config.content_understanding_endpoint
        self.analyzer_id = config.content_understanding_custom_model_id
        self.api_version = config.content_understanding_api_version

    async def start_analyzing(self,url_document:str) -> DocumentResponse | None:
        url = f"{self.endpoint}/contentunderstanding/analyzers/{self.analyzer_id}:analyze?api-version={self.api_version}&stringEncoding=utf16"

        data = {"url": url_document}

        #await requests.post(url=url,headers=self.headers,json=data)

    async def get_models(self) -> List[DocModel]:
        pass

    #def get_list_analyzer(self):

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