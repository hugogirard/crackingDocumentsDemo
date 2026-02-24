from dotenv import load_dotenv
import os

class Config:

    def __init__(self):
        load_dotenv(override=True)

    @property
    def doc_intelligence_endpoint(self) -> str:
        return os.environ["DOCUMENT_INTELLIGENCE_ENDPOINT"]
    
    @property
    def doc_intelligence_key(self) -> str:
        return os.environ["DOCUMENT_INTELLIGENCE_API_KEY"]
    
    @property
    def custom_invoice_model_id(self) -> str:
        return "CUSTOM_INVOICE_MODEL"     

    @property
    def storage_connection_string(self) -> str:
        return os.getenv('STORAGE_CONNECTION_STRING')
    
    @property
    def storage_account_key(self) -> str:
        return os.getenv('STORAGE_ACCOUNT_KEY')

    @property
    def doc_intelligence_training_container(self) -> str:
        return os.getenv('DOC_INTELLIGENCE_TRAINING_CONTAINER')