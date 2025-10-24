from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from .routers import analise, upload, previsao, upload_e_prever
from .core.settings import settings

# Configuração do Rate Limiter: 5 requisições por minuto por IP
limiter = Limiter(key_func=get_remote_address, default_limits=["5/minute"])

app = FastAPI(
    title="API de Análise de Dados",
    debug=(settings.ENVIRONMENT == "development"),
    description="API para análise de dados com FastAPI",
    version="0.0.1"
)

# Adiciona os middlewares de rate limiting
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler) #type: ignore

origins = [
    "http://localhost:3000",  # Exemplo: para o frontend rodando localmente
    "http://127.0.0.1:5500",
    "http://localhost:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

app.include_router(analise.router)
app.include_router(upload.router)
app.include_router(previsao.router)
app.include_router(upload_e_prever.router)

@app.get("/", tags=["Root"])
def read_root():
    """
    Verifica se a API está funcionando.
    """
    return {"message": "API funcionando"}