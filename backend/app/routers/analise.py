# /meu_projeto_backend/app/routers/analise.py

import pandas as pd
import joblib
import json
import numpy as np
from fastapi import APIRouter, HTTPException, Depends, status
from pathlib import Path
from typing import List, Dict, Any

from app.security.auth import get_api_key

router = APIRouter(
    prefix="/analise",
    tags=["Consulta de Análise"],
    dependencies=[Depends(get_api_key)]
)

# Armazenamento em memória para todos os dados carregados
artefatos_globais = {}

# --- Carregamento dos Dados na Inicialização da API (VERSÃO COMPLETA) ---
@router.on_event("startup")
def carregar_dados_e_modelos():
    """
    Carrega todos os artefatos essenciais do disco para a memória.
    """
    print("Iniciando carregamento de artefatos do disco...")
    
    BASE_DIR = Path(__file__).resolve().parent.parent
    DATA_DIR = BASE_DIR / "data" / "processed"
    RESULTS_DIR = BASE_DIR / "results"
    
    try:
        # Carrega o DataFrame principal
        path_parquet = DATA_DIR / "dados_processados.parquet"
        artefatos_globais['dataframe'] = pd.read_parquet(path_parquet)
        print(f"  ✅ DataFrame carregado de '{path_parquet}'")

        # --- MODIFICAÇÃO 1: Carregar relatórios para TODOS os targets ---
        # (Lidando com a inconsistência de maiúsculas/minúsculas nos nomes das pastas)
        target_folders = {"t1": "target1", "t2": "Target2", "t3": "Target3"}
        
        for key, folder_name in target_folders.items():
            path_report = RESULTS_DIR / folder_name / "final_report.json"
            
            if path_report.exists():
                with open(path_report, 'r', encoding='utf-8') as f:
                    artefatos_globais[f'relatorio_{key}'] = json.load(f)
                print(f"  ✅ Relatório do {key.upper()} carregado de '{path_report}'")
            else:
                print(f"  ⚠️ AVISO: Relatório para {key.upper()} não encontrado em '{path_report}'.")

    except FileNotFoundError as e:
        print(f"❌ ERRO CRÍTICO: Arquivo essencial não encontrado durante a inicialização: {e}")
    
    print("✅ Carregamento de artefatos concluído!")


# --- ENDPOINTS DE CONSULTA (VERSÃO COMPLETA) ---

@router.get("/dataset-completo", response_model=List[Dict[str, Any]])
def get_dataset_completo():
    """Retorna o dataset processado completo em formato JSON."""
    if 'dataframe' not in artefatos_globais:
        raise HTTPException(status_code=503, detail="Dados ainda não carregados.")
    return artefatos_globais['dataframe'].replace({np.nan: None}).to_dict('records')

@router.get("/clusters", response_model=List[Dict[str, Any]])
def get_analise_clusters():
    """Calcula e retorna a análise de centroides dos clusters."""
    if 'dataframe' not in artefatos_globais:
        raise HTTPException(status_code=503, detail="Dados ainda não carregados.")
    df = artefatos_globais['dataframe']
    if 'Cluster' not in df.columns:
        raise HTTPException(status_code=404, detail="Coluna 'Cluster' não encontrada.")
    features_cluster = ['Quiz_Taxa_de_Acerto', 'Quiz_Tempo_Total', 'Performance_Score_Medio', 'Likert_Score_Medio']
    cluster_analysis = df.groupby('Cluster')[features_cluster].mean().reset_index()
    return cluster_analysis.to_dict('records')

# --- MODIFICAÇÃO 2: Endpoint dinâmico para os relatórios ---
@router.get("/relatorio/{target_id}", response_model=Dict[str, Any])
def get_relatorio_por_target(target_id: str):
    """
    Retorna o JSON do relatório final para um Target específico.
    Use 't1', 't2', ou 't3' para o target_id.
    """
    clean_target_id = target_id.lower()
    
    # Validação da entrada
    if clean_target_id not in ["t1", "t2", "t3"]:
        raise HTTPException(status_code=400, detail="ID de Target inválido. Use 't1', 't2', ou 't3'.")
        
    key = f"relatorio_{clean_target_id}"
    
    if key not in artefatos_globais:
        raise HTTPException(status_code=404, detail=f"Relatório para {target_id} não foi carregado ou não existe.")
        
    return artefatos_globais[key]