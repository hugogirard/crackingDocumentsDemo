from abc import ABC, abstractmethod
from models.document_response import DocumentResponse
from models import DocModel
from typing import List

class BaseDocumentService(ABC):
    
    @abstractmethod
    async def start_analyzing(self,url_document:str) -> DocumentResponse | None:
        pass
    
    @abstractmethod
    async def get_models(self) -> List[DocModel]:
        pass