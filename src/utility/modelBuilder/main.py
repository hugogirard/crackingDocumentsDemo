from azure.ai.documentintelligence.models import DocumentModelDetails
from services import DocumentService, StorageService, ContentUnderstandingClient
from config import Config
from logging import Logger
import logging

def main():
    
    logging.basicConfig(level=logging.INFO)
    
    # Disable Azure SDK logging
    logging.getLogger('azure').setLevel(logging.WARNING)

    logger = logging.getLogger(__name__)

    configure_document_intelligence(logger=logger)

    configure_content_understanding(logger)

def configure_content_understanding(logger:Logger):    
    client = ContentUnderstandingClient(Config())
    
    defaults = client.set_defaults()
    
    logger.info(defaults)

    custom_model = client.create_custom_model()

    logger.info(custom_model)

def configure_document_intelligence(logger:Logger):

    config = Config()

    document_service = DocumentService(endpoint=config.doc_intelligence_endpoint,
                                       key=config.doc_intelligence_key)

    logger.info('Uploading storage')

    storage_service = StorageService(storage_conn_string=config.storage_connection_string,
                                     container_name=config.doc_intelligence_training_container,
                                     logger=logger)

    storage_service.create_container()

    storage_service.upload_doc_intelligence_training_assets()
    
    logger.info('Creating document intelligence custom model')

    sas = storage_service.create_container_sas(config.storage_account_key)
        
    result = document_service.create_custom_model(model_id="custom_invoice",
                                                  description="cus-task-invoice",
                                                  container_sas_url=sas)  



if __name__ == "__main__":
    main()
