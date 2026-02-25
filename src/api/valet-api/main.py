from fastapi import FastAPI, HTTPException
from fastapi.responses import RedirectResponse
from service import StorageService
from config import Config
import logging
import sys

#### Configure logger ####
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)
stream_handler = logging.StreamHandler(sys.stdout)
log_formatter = logging.Formatter("%(asctime)s [%(processName)s: %(process)d] [%(threadName)s: %(thread)d] [%(levelname)s] %(name)s: %(message)s")
stream_handler.setFormatter(log_formatter)
logger.addHandler(stream_handler)

#### Services
storage_service = StorageService(Config())

#### Configure App and Endpoint ####
app = FastAPI(title="ValetKey-API",
              description="Provide SAS token for the blob",
              version="1.0")

@app.get('/api/sas',description="Return a SAS for a specific blob")
def get_sas_blob(blob_name:str) -> str:
    try:
        return storage_service.get_sas_blob(blob_name=blob_name)
    except Exception as err:
        logger.error(err)
        raise HTTPException(status_code=500, detail='Internal Server Error')
    
@app.get('/', include_in_schema=False)
async def root():
    return RedirectResponse(url="/docs")        