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
    def content_understanding_endpoint(self) -> str:
        return os.getenv('CONTENT_UNDERSTANDING_ENDPOINT')
    
    @property
    def content_understanding_api_version(self) -> str:
        return os.getenv('CONTENT_UNDERSTANDING_API_VERSION')
    
    @property
    def content_understanding_api_key(self) -> str:
        return os.getenv('CONTENT_UNDERSTANDING_API_KEY')
    
    @property
    def content_understanding_custom_model_id(self) -> str:
        ## Hardcoded can be changed
        return 'CUSTOM_INVOICE_MODEL'

    @property
    def doc_intelligence_model_id(self) -> str:
        ## Hardcoded can be changed
        return 'custom_invoice'
    
    @property
    def token_endpoint(self) -> str:
        return 'https://cognitiveservices.azure.com/.default'