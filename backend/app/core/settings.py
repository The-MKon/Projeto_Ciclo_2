from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    API_SECRET_KEY: str = "chave-padrao-desenvolvimento"  # Valor padrão
    ENVIRONMENT: str = "development"

    class Config:
        env_file = ".env"
        env_file_encoding = 'utf-8'
        extra = "ignore"  # Ignora variáveis extras no .env

settings = Settings()