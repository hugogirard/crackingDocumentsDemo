from dotenv import load_dotenv
import os

class Config:
    def __init__(self):
        load_dotenv(override=True)

    @property
    def document_intelligence_endpoint(self) -> str:
        return os.getenv('DOCUMENT_INTELLIGENCE_ENDPOINT')
    
    @property
    def document_intelligence_key(self) -> str:
        return os.getenv('DOCUMENT_INTELLIGENCE_API_KEY')
    
    @property
    def model_id(self) -> str:
        return 'custom_invoice'
    
    @property
    def token_endpoint(self) -> str:
        return 'https://cognitiveservices.azure.com/.default'