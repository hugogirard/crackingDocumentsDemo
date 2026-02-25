from dotenv import load_dotenv
import os

class Config:
    def __init__(self):
        load_dotenv(override=True)

    @property
    def storage_connection_string(self) -> str:
        return os.getenv('STORAGE_CONNECTION_STRING')
    
    @property
    def storage_account_key(self) -> str:
        return os.getenv('STORAGE_ACCOUNT_KEY')

    @property
    def container_name(self) -> str:
        return 'upload'