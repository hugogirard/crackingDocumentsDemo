from fastapi import FastAPI, HTTPException
from fastapi.responses import RedirectResponse
from boostrapper import Bootstrapper
from models import DocumentResponse, DocModel
from config import Config
from services import DocumentService
from contract import DocumentInfo
from typing import List
from routes import routes
import logging
import sys


app = Bootstrapper().run()

# Load all the routes
for route in routes:
    app.include_router(route,prefix="/api")

#document_service = DocumentService(Config())

#### Configure logger ####
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)
stream_handler = logging.StreamHandler(sys.stdout)
log_formatter = logging.Formatter("%(asctime)s [%(processName)s: %(process)d] [%(threadName)s: %(thread)d] [%(levelname)s] %(name)s: %(message)s")
stream_handler.setFormatter(log_formatter)
logger.addHandler(stream_handler)



@app.get('/', include_in_schema=False)
async def root():
    return RedirectResponse(url="/docs")    