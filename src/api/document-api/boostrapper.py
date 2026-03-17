from fastapi import FastAPI
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
from config import Config
from services import DocumentService, ContentUnderstandingClient
import aiohttp

@asynccontextmanager
async def lifespan_event(app: FastAPI):
    
    app.state.http_client = aiohttp.ClientSession()

    config = Config()

    app.state.document_intelligence_service = DocumentService(config)

    app.state.content_understanding_service = ContentUnderstandingClient(config)

    yield

    app.state.http_client.close()

class Bootstrapper:

    def run(self) -> FastAPI:

        app = FastAPI(lifespan=lifespan_event,
                      title="Document-API",
                      description="Provide wrapper around AI service for Document API in Azure",
                      version="1.0")

        app.add_middleware(
            CORSMiddleware,
            allow_origins=['*'],
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )

        self._configure_monitoring(app)

        return app        

    def _configure_monitoring(self, app: FastAPI):
        pass    