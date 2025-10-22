from fastapi import Security, HTTPException, status
from fastapi.security import APIKeyHeader
from app.core.settings import settings

api_key_header = APIKeyHeader(name="X-API-Key")

async def get_api_key(api_key_header: str = Security(api_key_header)):
    """Verifica se a chave de API enviada no cabeçalho é válida."""
    if api_key_header == settings.API_SECRET_KEY:
        return api_key_header
    else:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Chave de API inválida ou ausente.",
        )