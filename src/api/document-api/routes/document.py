from fastapi import APIRouter, Depends, HTTPException, Query
from dependencies import get_document_service
from models import DocumentResponse, DocModel
from infrastructure import ProcessorType
from config import Config
from services import BaseDocumentService
from contract import DocumentInfo
from typing import List, Annotated
import logging

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/chat"
)

@router.post('/analyze', description="Analyze a document for a specific custom model")
async def analyze(doc_info:DocumentInfo, 
                  document_service: Annotated[BaseDocumentService, Depends(get_document_service)]):# -> DocumentResponse | None:
    try:
        return await document_service.start_analyzing(doc_info.url)
    except Exception as err:
        logger.error(err)
        raise HTTPException(status_code=500, detail='Internal Server Error')

@router.get('/models', description="Return the list of all availables model")
async def get_models(document_service: Annotated[BaseDocumentService, Depends(get_document_service)]) -> List[DocModel]:
    try:
        return await document_service.get_models()
    except Exception as err:
        logger.error(err)
        raise HTTPException(status_code=500, detail='Internal Server Error')
