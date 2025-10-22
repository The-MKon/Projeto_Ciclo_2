from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    API_SECRET_KEY: str
    ENVIRONMENT: str = "development"

    class Config:
        env_file = ".env"

settings = Settings()