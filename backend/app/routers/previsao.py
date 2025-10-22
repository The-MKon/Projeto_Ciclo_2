# /app/routers/previsao.py
import joblib
import pandas as pd
from fastapi import APIRouter, Depends, HTTPException
from pathlib import Path

from app.security.auth import get_api_key
from app.schemas.previsao_schemas import EntradaPrevisao, SaidaPrevisao

router = APIRouter(
    prefix="/prever",
    tags=["Previsão de Targets"],
    dependencies=[Depends(get_api_key)]
)

# --- Carregamento Otimizado de Modelos ---
# Apontamos para a raiz da pasta 'app' e depois para 'models'
BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_DIR = BASE_DIR / "models"

artefatos = {}

@router.on_event("startup")
def carregar_modelos():
    """Carrega todos os artefatos .pkl de cada subpasta de target."""
    print("Carregando artefatos de Machine Learning (estrutura modular)...")
    
    # Nomes das pastas como na sua imagem (lidando com a inconsistência de maiúsculas/minúsculas)
    target_folders = {"Target1": "target1", "Target2": "Target2", "Target3": "Target3"}

    for target_api, target_folder_name in target_folders.items():
        key = target_api.lower() # Chave interna será 'target1', 'target2', etc.
        folder_path = MODEL_DIR / target_folder_name
        
        try:
            # Lógica para lidar com os múltiplos nomes de modelo no target1
            if target_api == 'Target1' and (folder_path / "final_model_aprimorado.pkl").exists():
                model_path = folder_path / "final_model_aprimorado.pkl"
                features_path = folder_path / "selected_features_aprimoradas.pkl"
            else:
                model_path = folder_path / "final_model.pkl"
                features_path = folder_path / "selected_features.pkl"

            artefatos[key] = {
                "modelo": joblib.load(model_path),
                "scaler": joblib.load(folder_path / "scaler.pkl"),
                "features": joblib.load(features_path)
            }
            print(f"  ✅ Artefatos para {target_api} carregados de '{folder_path}'")

        except FileNotFoundError as e:
            print(f"  ⚠️ AVISO: Falha ao carregar artefatos para {target_api}. Arquivo não encontrado: {e}")

    if not artefatos:
        raise RuntimeError("Nenhum artefato de modelo foi carregado. A API não pode fazer previsões.")

    print("✅ Todos os artefatos disponíveis foram carregados!")

def engenharia_de_features_especializada(df: pd.DataFrame) -> pd.DataFrame:
    """
    Esta função REPLICA a engenharia de features que é feita nos notebooks
    de modelagem. Ela cria as colunas que não existem no 'dados_processados.parquet'.
    """
    print("Executando engenharia de features especializada...")
    df_com_novas_features = df.copy()

    # Feature 1: Razão de Eficiência (Performance por Tempo)
    if 'Performance_Score_Total' in df.columns and 'Tempo_Total' in df.columns:
        df_com_novas_features['Eficiencia_Performance'] = df_com_novas_features['Performance_Score_Total'] / (df_com_novas_features['Tempo_Total'] + 1e-6)

    # Feature 2: Interação entre Atitude e Consistência
    if 'Likert_Score_Medio' in df.columns and 'Consistencia_F07' in df.columns:
        df_com_novas_features['Atitude_Consistente'] = df_com_novas_features['Likert_Score_Medio'] * df_com_novas_features['Consistencia_F07']

    # Feature 3: Idade ao Quadrado (Feature Polinomial)
    if 'Idade_Anos' in df.columns:
        df_com_novas_features['Idade_Anos_Sq'] = df_com_novas_features['Idade_Anos']**2
    
    # Adicione aqui qualquer outra feature especializada de outros notebooks, se houver.
    
    print("Novas features criadas: ", [col for col in df_com_novas_features.columns if col not in df.columns])
    return df_com_novas_features

@router.post("/", response_model=SaidaPrevisao)
async def fazer_previsao(entrada: EntradaPrevisao):
    """
    Recebe os dados de um jogador, replica a engenharia de features
    e retorna as previsões para os três targets.
    """
    try:
        dados_df = pd.DataFrame([entrada.dados_jogador])
        
        # --- 🔥 FLUXO DE TRABALHO CORRIGIDO E FINAL 🔥 ---
        
        # 1. ENGENHARIA DE FEATURES PRIMEIRO, a partir dos dados brutos
        dados_enriquecidos_df = engenharia_de_features_especializada(dados_df)
        
        previsoes = {}

        # Fazer a Previsão para cada Target, com seu pipeline INDEPENDENTE
        for target_name in ["Target1", "Target2", "Target3"]:
            key = target_name.lower()
            if key not in artefatos: continue

            modelo = artefatos[key]["modelo"]
            scaler = artefatos[key]["scaler"]
            features_modelo = artefatos[key]["features"]
            
            # 2. Pegar as colunas que o SCALER espera
            features_scaler = scaler.feature_names_in_

            try:
                # Seleciona do DataFrame ENRIQUECIDO apenas as colunas que o scaler conhece
                dados_para_scaler = dados_enriquecidos_df[features_scaler]
            except KeyError as e:
                raise HTTPException(status_code=422, detail=f"A feature {e} (necessária para o pré-processamento) não foi encontrada. Verifique se o JSON de entrada está completo e se a função de engenharia está correta.")

            # 3. Aplica o Scaler
            dados_scaled_np = scaler.transform(dados_para_scaler)
            dados_scaled_df = pd.DataFrame(dados_scaled_np, columns=features_scaler)

            # 4. AGORA, seleciona do DataFrame JÁ ESCALADO, o conjunto final de features que o MODELO espera
            # Note que as novas features ('Atitude_Consistente', etc.) NÃO são escaladas,
            # o que corresponde à lógica do seu notebook, onde o scaler foi treinado antes delas.
            # Portanto, precisamos juntar os dados escalados com os não escalados.
            
            # DataFrame final para o modelo: junta as features escaladas com as novas features não escaladas
            df_final_para_modelo = pd.concat([dados_scaled_df, dados_enriquecidos_df.drop(columns=features_scaler)], axis=1)

            try:
                dados_para_previsao = df_final_para_modelo[features_modelo]
            except KeyError as e:
                # Se uma feature do modelo não está aqui, significa que a engenharia de features falhou em criá-la.
                raise HTTPException(status_code=422, detail=f"A feature {e} (necessária para o modelo {target_name}) não foi encontrada após a engenharia de features.")
            
            # 5. Faz a previsão
            pred = modelo.predict(dados_para_previsao)[0]
            previsoes[target_name] = float(pred)
            
        return SaidaPrevisao(**previsoes)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ocorreu um erro inesperado: {str(e)}")