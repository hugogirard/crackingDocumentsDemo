from azure.storage.blob import (
    BlobServiceClient, 
    BlobClient, 
    ContainerClient, 
    generate_container_sas, 
    ContainerSasPermissions
)
import os
from logging import Logger
from datetime import datetime, timezone, timedelta

class StorageService:

    def __init__(self,storage_conn_string:str, container_name:str, logger: Logger):
        self.blob_service_client = BlobServiceClient.from_connection_string(storage_conn_string)
        self.container_client = self.blob_service_client.get_container_client(container_name)                
        self.logger = logger

    def create_container(self):
        if not self.container_client.exists():
            self.container_client.create_container()

    def upload_doc_intelligence_training_assets(self):
        
        # Get the project root directory (3 levels up from current file)
        current_dir = os.path.dirname(os.path.abspath(__file__))
        project_root = os.path.abspath(os.path.join(current_dir, '../../../..'))
        training_dir = os.path.join(project_root, 'samples/training/docIntelligence')

        self.logger.info(f"Project directory: {project_root}")

        for entry in os.scandir(training_dir):
            if entry.is_file():
                blob = self.blob_service_client.get_blob_client(container=self.container_client.container_name,
                                                                blob=entry.name)                
                
                self.logger.info(f"Uploading file: {entry.name} in directory: {entry.path}")

                with open(entry.path,mode="rb") as data:
                    blob.upload_blob(data,overwrite=True)

    def create_container_sas(self, account_key:str) -> str:
        
        start_time = datetime.now(timezone.utc)
        expiry_time = start_time + timedelta(hours=1)

        sas_token = generate_container_sas(
            account_name=self.container_client.account_name,
            container_name=self.container_client.container_name,
            account_key=account_key,
            permission=ContainerSasPermissions(read=True,list=True),
            expiry=expiry_time,
            start=start_time
        )

        self.container_client.ge

        container_url = self.container_client.url

        return f'{container_url}?{sas_token}'
    



