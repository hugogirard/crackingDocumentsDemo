from pydantic import BaseModel

class DocModel(BaseModel):
    model_id:str
    description:str