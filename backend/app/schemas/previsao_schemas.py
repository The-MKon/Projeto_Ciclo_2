# /app/schemas/previsao_schemas.py
from pydantic import BaseModel
from typing import Dict, Any

# O que a API espera receber: os dados de um jogador
class EntradaPrevisao(BaseModel):
    # Usamos um dicionário genérico. Em um projeto real, você poderia
    # definir cada uma das 100+ features aqui para validação máxima.
    dados_jogador: Dict[str, Any]

# O que a API vai retornar: as previsões
class SaidaPrevisao(BaseModel):
    Target1: float
    Target2: float
    Target3: float