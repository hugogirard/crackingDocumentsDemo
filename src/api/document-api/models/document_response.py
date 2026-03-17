from pydantic import BaseModel, Field
from typing import Dict, Any, Optional, List, Union


class BoundingRegion(BaseModel):
    """Bounding box region for a field."""
    page_number: int
    polygon: List[float]
    
    class Config:
        from_attributes = True


class OrderDetailItem(BaseModel):
    """Individual order line item."""
    details: Optional[str] = None
    quantity: Optional[str] = None
    unit_price: Optional[str] = None
    total: Optional[str] = None
    
    class Config:
        from_attributes = True

class OrderDetailsField(BaseModel):
    """Field containing array of order detail items."""
    items: List[OrderDetailItem] = []
    
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
    order_details: Optional[OrderDetailsField] = None
    confidence: Optional[float] = None
    
    class Config:
        from_attributes = True