from pydantic import BaseModel


class DocumentInfo(BaseModel):
    url: str