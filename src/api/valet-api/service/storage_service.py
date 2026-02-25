from config import Config
from azure.storage.blob.aio import BlobClient, BlobServiceClient
from azure.storage.blob import generate_blob_sas, BlobSasPermissions
from datetime import datetime, timedelta, timezone

class StorageService:

    def __init__(self,config:Config):
        self.blob_service_client = BlobServiceClient.from_connection_string(config.storage_connection_string)
        self.container_name = config.container_name
        self.account_key = config.storage_account_key

    def get_sas_blob(self,blob_name:str) -> str:
        
        start_time = datetime.now(timezone.utc)
        expiry_time = start_time + timedelta(hours=1)

        blob = self.blob_service_client.get_blob_client(container=self.container_name,
                                                        blob=blob_name)
        
        sas_token = generate_blob_sas(
            account_name=blob.account_name,
            container_name=blob.container_name,
            blob_name=blob.blob_name,
            account_key=self.account_key,
            permission=BlobSasPermissions(write=True),
            expiry=expiry_time,
            start=start_time
        )

        return f'{blob.url}?{sas_token}'