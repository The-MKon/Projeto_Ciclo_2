# /meu_projeto_backend/app/schemas/upload_schemas.py

from pydantic import BaseModel, Field, validator
from typing import Optional

# Este schema valida UMA ÚNICA LINHA da aba 'Session Activities'
# Ele garante que as colunas esperadas existem e têm o tipo certo.
class SessionActivityRow(BaseModel):
    Codigo_de_Acesso: str
    F0101: int = Field(..., alias='F0101') # 'alias' permite que o nome do campo no Pydantic seja diferente do cabeçalho da coluna
    Target1: float
    Target2: float
    Target3: float
    
    # Adicione outros campos obrigatórios que você espera no arquivo
    # Exemplo:
    # QtdHorasSono: Optional[float] = None # Opcional, pode ser nulo

    # Isso permite que existam outras colunas no Excel que não estão definidas aqui
    class Config:
        extra = 'allow' 

# Este schema valida UMA ÚNICA LINHA da aba 'Features'
class FeatureRow(BaseModel):
    Coluna: str
    Features: str

