from pydantic import BaseModel, Field
from typing import Dict, Any, Optional, List, Union


class BoundingRegion(BaseModel):
    """Bounding box region for a field."""
    page_number: int
    polygon: List[float]
    
    class Config:
        from_attributes = True


class DocumentField(BaseModel):
    """Document field with content, confidence, and bounding regions."""
    content: Optional[str] = None
    confidence: Optional[float] = None
    bounding_regions: Optional[List[BoundingRegion]] = None
    
    class Config:
        from_attributes = True


class DocumentResponse(BaseModel):
    doc_type: Optional[str] = None
    fields: Dict[str, DocumentField] = {}
    confidence: Optional[float] = None
    
    class Config:
        from_attributes = True