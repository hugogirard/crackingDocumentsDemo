from pydantic import BaseModel, Field
from typing import Literal, List, Optional
from datetime import datetime

class ConfigAnalyzer(BaseModel):
    enableFormula: bool = Field(default=False)
    returnDetails: bool = Field(default=True)
    disableContentFiltering: bool = Field(default=False)
    estimateFieldSourceAndConfidence: bool = Field(default=True)
    tableFormat: str = Field(default="html")

class Analyzer(BaseModel):
    analyzerId: str
    description: str
    baseAnalyzerId: Literal["prebuilt-documentAnalyzer"] = Field(default="prebuilt-documentAnalyzer")
    config: ConfigAnalyzer
    fieldSchema: dict # JSON object of the schema
    #trainingData: TrainingData
    
class AnalyzerResponse(BaseModel):
    analyzerId: str
    description: str
    createdAt: datetime
    lastModifiedAt: datetime
    baseAnalyzerId: str
    fieldSchema: dict
    warnings: List[str]
    status: str
    processingLocation: str
    mode: str    
