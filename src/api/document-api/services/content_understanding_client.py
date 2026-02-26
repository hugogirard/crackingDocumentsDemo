from config import Config
from azure.identity.aio import DefaultAzureCredential
import aiohttp

class ContentUnderstandingClient:

    def __init__(self,config:Config):
        self.credential = DefaultAzureCredential()

    #def get_list_analyzer(self):

    async def _get_token(self) -> str:
        bearer = await self.credential.get_token()
        return bearer.token