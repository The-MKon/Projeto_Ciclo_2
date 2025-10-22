from pydantic import BaseModel, Field
from typing import List, Dict, Any

# Define a estrutura do payload completo que esperamos do Colab
class AnalisePayload(BaseModel):
    comparacao_modelos: List[Dict[str, Any]]
    analise_clusters: List[Dict[str, Any]]
    importancia_features_t2: List[Dict[str, Any]]
    importancia_features_t3: List[Dict[str, Any]]
    metadata_modelos: Dict[str, Any]
    dataset_final: List[Dict[str, Any]]

class ComparacaoModeloItem(BaseModel):
    Target: str
    R2_Modelo_Anterior: float = Field(..., alias="R² Modelo Anterior")
    R2_Modelo_Aprimorado: float = Field(..., alias="R² Modelo Aprimorado")
    Melhoria_Percentual: float = Field(..., alias="Melhoria %")
    Algoritmo_Anterior: str = Field(..., alias="Algoritmo Anterior")
    Algoritmo_Novo: str = Field(..., alias="Algoritmo Novo")
    class Config:
        populate_by_name = True


class ClusterItem(BaseModel):
    Cluster: int
    Quiz_Taxa_de_Acerto: float
    Quiz_Tempo_Total: float
    Performance_Score_Medio: float
    Likert_Score_Medio: float

class ImportanciaFeatureItem(BaseModel):
    Feature: str
    Importancia: float

class MetadataModelos(BaseModel):
    data_geracao: str
    equipe: List[str]
    modelos: Dict[str, Any]
    total_features_dataset: int
    total_jogadores: int