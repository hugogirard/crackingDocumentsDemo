from services import BaseDocumentService
from fastapi import Request, HTTPException, Query
from infrastructure import ProcessorType
from aiohttp import ClientSession


def get_http_client(request:Request) -> ClientSession:
    return request.app.state.http_client

def get_document_service(request:Request,
                         processor_type:ProcessorType = Query(...,description="The processor model to use to process the document")) -> BaseDocumentService:

    try:
        if processor_type == ProcessorType.DOC_INTELLIGENCE:
            return request.app.state.document_intelligence_service
        else:
            return request.app.state.content_understanding_service

    except ValueError:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid analyzer type. Must be one of: {[e.value for e in ProcessorType]}"
        )    

    
