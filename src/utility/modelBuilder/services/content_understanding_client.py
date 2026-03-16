from config import Config
from azure.identity import AzureCliCredential
from models import Analyzer, ConfigAnalyzer
import requests
import json

class ContentUnderstandingClient:

    def __init__(self,config:Config):
        self.endpoint = config.content_understanding_endpoint
        self.custom_model_name = config.custom_invoice_model_id
        self.credential = AzureCliCredential()
        self.token_endpoint = config.token_endpoint
        self.default_payload = config.model_deployments

    def get_defaults(self) -> str:       
       url = f"{self.endpoint}contentunderstanding/defaults?api-version=2025-11-01"
       response = requests.get(url,headers=self._get_headers())
       return response.text

    def set_defaults(self) -> str:
        url = f"{self.endpoint}contentunderstanding/defaults?api-version=2025-11-01"
        response = requests.patch(url,json=self.default_payload,headers=self._get_headers())
        return response.text

    def create_custom_model(self) -> str:
        url = f"{self.endpoint}contentunderstanding/analyzers/{self.custom_model_name}?api-version=2025-05-01-preview"

        with open('schema/invoice_model_prebuilt-documentAnalyzer_2025-05-01-preview.json', 'r') as f:
            schema = json.load(f)

        analyzer = Analyzer(    
            analyzerId=self.custom_model_name,        
            description="Custom invoice model",
            config=ConfigAnalyzer(),
            fieldSchema=schema["fieldSchema"]
        )

        payload = analyzer.model_dump_json(indent=4)        

        response = requests.put(url,data=payload,headers=self._get_headers())
        return response.text        

    def _get_headers(self) -> dict[str,str]:
        bearer = self.credential.get_token(self.token_endpoint)
        headers = {
            'Authorization': f'Bearer {bearer.token}'
        }
        return headers