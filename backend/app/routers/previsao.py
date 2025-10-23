import warnings
warnings.filterwarnings('ignore', category=UserWarning)
warnings.filterwarnings('ignore', message='.*unpickle estimator.*')

import joblib
import pandas as pd
import json
from fastapi import APIRouter, Depends, HTTPException
from pathlib import Path

from app.security.auth import get_api_key
from app.schemas.previsao_schemas import EntradaPrevisao, SaidaPrevisao

router = APIRouter(
    prefix="/prever",
    tags=["Previsão de Targets"],
    dependencies=[Depends(get_api_key)]
)

BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_DIR = BASE_DIR / "models"

artefatos = {}
metadados_modelos = {}

@router.on_event("startup")
def carregar_modelos():
    """Carrega todos os artefatos .pkl de cada subpasta de target."""
    print("Carregando artefatos de Machine Learning (estrutura modular)...")
    print(f"📁 Diretório de modelos: {MODEL_DIR}\n")
    
    target_folders = {"Target1": "target1", "Target2": "Target2", "Target3": "Target3"}

    for target_api, target_folder_name in target_folders.items():
        key = target_api.lower()
        folder_path = MODEL_DIR / target_folder_name
        
        try:
            # Verificar qual versão do modelo existe
            model_aprimorado_path = folder_path / "final_model_aprimorado.pkl"
            model_normal_path = folder_path / "final_model.pkl"
            
            features_aprimoradas_path = folder_path / "selected_features_aprimoradas.pkl"
            features_normal_path = folder_path / "selected_features.pkl"
            
            usar_aprimorado = model_aprimorado_path.exists()
            
            if usar_aprimorado:
                model_path = model_aprimorado_path
                features_path = features_aprimoradas_path if features_aprimoradas_path.exists() else features_normal_path
                versao = "APRIMORADO"
            else:
                model_path = model_normal_path
                features_path = features_normal_path
                versao = "NORMAL"
            
            print(f"📊 {target_api}:")
            print(f"   Versão: {versao}")
            print(f"   Modelo: {model_path.name}")
            print(f"   Features: {features_path.name}")

            modelo_carregado = joblib.load(model_path)
            
            artefatos[key] = {
                "modelo": modelo_carregado,
                "scaler": joblib.load(folder_path / "scaler.pkl"),
                "features": joblib.load(features_path),
                "versao": versao
            }
            
            # ========== MUDANÇA AQUI: SEMPRE PRIORIZAR REPORT APRIMORADO ==========
            results_dir = folder_path.parent.parent / "results" / target_folder_name
            
            # Tentar carregar report aprimorado PRIMEIRO (independente do modelo)
            report_aprimorado_path = results_dir / "final_report_aprimorado.json"
            report_normal_path = results_dir / "final_report.json"
            
            # SEMPRE tentar o aprimorado primeiro
            if report_aprimorado_path.exists():
                report_path = report_aprimorado_path
                print(f"   Report: final_report_aprimorado.json ✅")
            else:
                report_path = report_normal_path
                print(f"   Report: final_report.json")
            
            if report_path.exists():
                with open(report_path, 'r', encoding='utf-8') as f:
                    report = json.load(f)
                    metadados_modelos[key] = {
                        "nome_modelo": report["model"]["name"],
                        "parametros": report["model"]["best_params"],
                        "versao": versao,
                        "metricas_treino": {
                            "r2": round(report["metrics"]["train"]["r2"], 4),
                            "rmse": round(report["metrics"]["train"]["rmse"], 2),
                            "mae": round(report["metrics"]["train"]["mae"], 2)
                        },
                        "metricas_teste": {
                            "r2": round(report["metrics"]["test"]["r2"], 4),
                            "rmse": round(report["metrics"]["test"]["rmse"], 2),
                            "mae": round(report["metrics"]["test"]["mae"], 2)
                        },
                        "overfitting": {
                            "diferenca_r2": round(report["overfitting_analysis"]["r2_difference"], 4),
                            "queda_percentual": round(report["overfitting_analysis"]["relative_drop_percentage"], 2),
                            "status": report["overfitting_analysis"]["status"]
                        },
                        "total_features": report["features"]["final_selected"],
                        "features_originais": report["features"]["original_count"],
                        "reducao_features": round(report["features"]["reduction_percentage"], 2)
                    }
            else:
                print(f"   ⚠️ Nenhum report encontrado")
                metadados_modelos[key] = {
                    "nome_modelo": type(modelo_carregado).__name__,
                    "parametros": {},
                    "versao": versao,
                    "metricas_treino": {"r2": None, "rmse": None, "mae": None},
                    "metricas_teste": {"r2": None, "rmse": None, "mae": None},
                    "overfitting": {"diferenca_r2": None, "queda_percentual": None, "status": "unknown"},
                    "total_features": len(artefatos[key]["features"]),
                    "features_originais": None,
                    "reducao_features": None
                }
            
            print(f"   ✅ R² Treino: {metadados_modelos[key]['metricas_treino']['r2']}")
            print(f"   ✅ R² Teste: {metadados_modelos[key]['metricas_teste']['r2']}")
            print(f"   ✅ Total Features: {metadados_modelos[key]['total_features']}\n")

        except FileNotFoundError as e:
            print(f"  ⚠️ AVISO: Falha ao carregar artefatos para {target_api}. Arquivo não encontrado: {e}\n")
        except Exception as e:
            print(f"  ❌ ERRO ao carregar {target_api}: {e}\n")

    if not artefatos:
        raise RuntimeError("Nenhum artefato de modelo foi carregado. A API não pode fazer previsões.")

    print("=" * 70)
    print("✅ Todos os artefatos disponíveis foram carregados!")
    print("=" * 70)


# Resto do código permanece igual...
def engenharia_de_features_especializada(df: pd.DataFrame) -> pd.DataFrame:
    """
    Esta função REPLICA a engenharia de features que é feita nos notebooks
    de modelagem. Ela cria as colunas que não existem no 'dados_processados.parquet'.
    """
    print("Executando engenharia de features especializada...")
    df_com_novas_features = df.copy()

    if 'Performance_Score_Total' in df.columns and 'Tempo_Total' in df.columns:
        df_com_novas_features['Eficiencia_Performance'] = df_com_novas_features['Performance_Score_Total'] / (df_com_novas_features['Tempo_Total'] + 1e-6)

    if 'Likert_Score_Medio' in df.columns and 'Consistencia_F07' in df.columns:
        df_com_novas_features['Atitude_Consistente'] = df_com_novas_features['Likert_Score_Medio'] * df_com_novas_features['Consistencia_F07']

    if 'Idade_Anos' in df.columns:
        df_com_novas_features['Idade_Anos_Sq'] = df_com_novas_features['Idade_Anos']**2
    
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
        dados_enriquecidos_df = engenharia_de_features_especializada(dados_df)
        
        previsoes = {}

        for target_name in ["Target1", "Target2", "Target3"]:
            key = target_name.lower()
            if key not in artefatos: continue

            modelo = artefatos[key]["modelo"]
            scaler = artefatos[key]["scaler"]
            features_modelo = artefatos[key]["features"]
            features_scaler = scaler.feature_names_in_

            try:
                dados_para_scaler = dados_enriquecidos_df[features_scaler]
            except KeyError as e:
                raise HTTPException(status_code=422, detail=f"A feature {e} (necessária para o pré-processamento) não foi encontrada. Verifique se o JSON de entrada está completo e se a função de engenharia está correta.")

            dados_scaled_np = scaler.transform(dados_para_scaler)
            dados_scaled_df = pd.DataFrame(dados_scaled_np, columns=features_scaler)
            df_final_para_modelo = pd.concat([dados_scaled_df, dados_enriquecidos_df.drop(columns=features_scaler)], axis=1)

            try:
                dados_para_previsao = df_final_para_modelo[features_modelo]
            except KeyError as e:
                raise HTTPException(status_code=422, detail=f"A feature {e} (necessária para o modelo {target_name}) não foi encontrada após a engenharia de features.")
            
            pred = modelo.predict(dados_para_previsao)[0]
            previsoes[target_name] = float(pred)
            
        return SaidaPrevisao(**previsoes)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ocorreu um erro inesperado: {str(e)}")