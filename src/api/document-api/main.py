from fastapi import FastAPI, HTTPException
from fastapi.responses import RedirectResponse
from models import DocumentResponse, DocModel
from config import Config
from services import DocumentService
from contract import DocumentInfo
from typing import List
import logging
import sys


document_service = DocumentService(Config())

#### Configure logger ####
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)
stream_handler = logging.StreamHandler(sys.stdout)
log_formatter = logging.Formatter("%(asctime)s [%(processName)s: %(process)d] [%(threadName)s: %(thread)d] [%(levelname)s] %(name)s: %(message)s")
stream_handler.setFormatter(log_formatter)
logger.addHandler(stream_handler)

#### Configure App and Endpoint ####
app = FastAPI(title="Document-API",
              description="Provide wrapper around AI service for Document API in Azure",
              version="1.0")

@app.post('/api/analyze')
async def analyze(doc_info:DocumentInfo) -> DocumentResponse | None:
    try:
        return await document_service.start_analyzing(doc_info.url)
    except Exception as err:
        logger.error(err)
        raise HTTPException(status_code=500, detail='Internal Server Error')

@app.get('/api/models')
async def get_models() -> List[DocModel]:
    try:
        return await document_service.get_models()
    except Exception as err:
        logger.error(err)
        raise HTTPException(status_code=500, detail='Internal Server Error')

@app.get('/', include_in_schema=False)
async def root():
    return RedirectResponse(url="/docs")    