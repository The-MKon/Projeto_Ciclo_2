from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
import pandas as pd
import io
from fastapi.responses import StreamingResponse
from app.security.auth import get_api_key
from app.preprocessing.preprocessor import DataPreprocessor
from app.routers.previsao import artefatos, metadados_modelos  # IMPORTAR metadados_modelos

router = APIRouter(
    prefix="/processar",
    tags=["Upload e Previsão Completa"],
    dependencies=[Depends(get_api_key)]
)

preprocessor = DataPreprocessor()

@router.post("/excel-completo-com-preprocessamento")
async def processar_excel_bruto_e_prever(file: UploadFile = File(...)):
    """
    📊 ENDPOINT COMPLETO COM PRÉ-PROCESSAMENTO:
    1. Recebe Excel com dados BRUTOS de jogadores
    2. Aplica TODO o pré-processamento (limpeza, features, imputação)
    3. Faz previsão dos 3 targets para TODOS os jogadores
    4. Retorna dados COMPLETOS processados + previsões + informações dos modelos
    """
    
    if file.filename is None:
        raise HTTPException(
            status_code=400,
            detail="Nome do arquivo não foi fornecido"
        )
    
    if not file.filename.endswith(('.xlsx', '.xls')):
        raise HTTPException(
            status_code=415,
            detail="Arquivo deve ser Excel (.xlsx ou .xls)"
        )
    
    try:
        contents = await file.read()
        df_bruto = pd.read_excel(io.BytesIO(contents), sheet_name='Session Activities')
        
        print(f"✅ Excel recebido: {len(df_bruto)} jogadores")
        
        df_processado = preprocessor.processar(df_bruto)
        
        resultados = []
        erros = []
        
        for idx in range(len(df_processado)):
            codigo_acesso = None
            try:
                linha = df_processado.iloc[idx]
                jogador_dados = linha.to_dict()
                codigo_acesso = jogador_dados.get('Código de Acesso', f'Jogador_{idx+1}')
                
                df_jogador = pd.DataFrame([jogador_dados])
                previsoes_jogador = {}
                
                for target_name in ["Target1", "Target2", "Target3"]:
                    key = target_name.lower()
                    
                    if key not in artefatos:
                        continue
                    
                    modelo = artefatos[key]["modelo"]
                    scaler = artefatos[key]["scaler"]
                    features_modelo = artefatos[key]["features"]
                    features_scaler = scaler.feature_names_in_
                    
                    dados_para_scaler = df_jogador[features_scaler]
                    dados_scaled = scaler.transform(dados_para_scaler)
                    dados_scaled_df = pd.DataFrame(dados_scaled, columns=features_scaler)
                    
                    df_final = pd.concat([
                        dados_scaled_df, 
                        df_jogador.drop(columns=features_scaler, errors='ignore')
                    ], axis=1)
                    
                    dados_para_previsao = df_final[features_modelo]
                    pred = modelo.predict(dados_para_previsao)[0]
                    previsoes_jogador[target_name] = round(float(pred), 2)
                
                dados_completos_processados = {}
                for col, value in jogador_dados.items():
                    if pd.isna(value):
                        dados_completos_processados[col] = None
                    elif isinstance(value, (pd.Timestamp, pd.Timedelta)):
                        dados_completos_processados[col] = str(value)
                    elif isinstance(value, (int, float)):
                        dados_completos_processados[col] = float(value)
                    else:
                        dados_completos_processados[col] = str(value)
                
                resultados.append({
                    "codigo_acesso": codigo_acesso,
                    "previsoes": previsoes_jogador,
                    "dados_processados_completos": dados_completos_processados
                })
                
            except Exception as e:
                print(f"⚠️ Erro ao processar jogador {idx+1}: {str(e)}")
                codigo_fallback = codigo_acesso if codigo_acesso else f'Jogador_{idx+1}'
                erros.append({
                    "codigo_acesso": codigo_fallback,
                    "erro": str(e),
                    "linha": idx + 1
                })
        
        resultados_sucesso = [r for r in resultados if "previsoes" in r]
        
        estatisticas = {}
        if resultados_sucesso:
            for target in ["Target1", "Target2", "Target3"]:
                valores = [r["previsoes"][target] for r in resultados_sucesso if target in r["previsoes"]]
                if valores:
                    estatisticas[f"{target.lower()}_media"] = round(sum(valores) / len(valores), 2)
                    estatisticas[f"{target.lower()}_min"] = round(min(valores), 2)
                    estatisticas[f"{target.lower()}_max"] = round(max(valores), 2)
        
        return {
            "status": "sucesso",
            "total_jogadores": len(df_bruto),
            "processados_com_sucesso": len(resultados_sucesso),
            "com_erros": len(erros),
            "total_features": len(df_processado.columns),
            "lista_features": df_processado.columns.tolist(),
            "modelos_utilizados": {  # NOVO!
                "Target1": metadados_modelos.get("target1", {}),
                "Target2": metadados_modelos.get("target2", {}),
                "Target3": metadados_modelos.get("target3", {})
            },
            "resultados": resultados,
            "erros": erros if erros else None,
            "estatisticas": estatisticas
        }
        
    except pd.errors.EmptyDataError:
        raise HTTPException(
            status_code=422,
            detail="❌ O arquivo Excel está vazio"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"❌ Erro ao processar arquivo: {str(e)}"
        )
        
@router.post("/excel-para-csv-processado")
async def processar_e_exportar_csv(file: UploadFile = File(...)):
    """
    📊 ENDPOINT COMPLETO (CSV):
    1. Recebe Excel com dados BRUTOS de jogadores
    2. Aplica TODO o pré-processamento
    3. Faz previsão dos 3 targets para TODOS os jogadores
    4. Retorna um arquivo CSV completo com os dados processados e as previsões
    """
    if not file.filename or not file.filename.endswith(('.xlsx', '.xls')):
        raise HTTPException(
            status_code=415,
            detail="Arquivo deve ser Excel (.xlsx ou .xls)"
        )
        
    try:
        contents = await file.read()
        df_bruto = pd.read_excel(io.BytesIO(contents), sheet_name='Session Activities')
        
        df_processado = preprocessor.processar(df_bruto)
        
        previsoes_t1, previsoes_t2, previsoes_t3 = [], [], []
        
        for idx in range(len(df_processado)):
            previsoes_jogador = {}
            try:
                linha = df_processado.iloc[idx]
                df_jogador = pd.DataFrame([linha.to_dict()])
                
                for target_name in ["Target1", "Target2", "Target3"]:
                    key = target_name.lower()
                    if key not in artefatos: continue
                    
                    modelo = artefatos[key]["modelo"]
                    scaler = artefatos[key]["scaler"]
                    features_modelo = artefatos[key]["features"]
                    features_scaler = scaler.feature_names_in_

                    dados_para_scaler = df_jogador[features_scaler]
                    dados_scaled = scaler.transform(dados_para_scaler)
                    dados_scaled_df = pd.DataFrame(dados_scaled, columns=features_scaler)
                    
                    df_final = pd.concat([
                        dados_scaled_df, 
                        df_jogador.drop(columns=features_scaler, errors='ignore')
                    ], axis=1)
                    
                    dados_para_previsao = df_final[features_modelo]
                    pred = modelo.predict(dados_para_previsao)[0]
                    previsoes_jogador[target_name] = round(float(pred), 4)

                previsoes_t1.append(previsoes_jogador.get("Target1"))
                previsoes_t2.append(previsoes_jogador.get("Target2"))
                previsoes_t3.append(previsoes_jogador.get("Target3"))

            except Exception as e:
                print(f"⚠️ Erro na predição para linha {idx+1}: {e}. Inserindo None.")
                previsoes_t1.append(None)
                previsoes_t2.append(None)
                previsoes_t3.append(None)

        df_processado['Target1_Previsto'] = previsoes_t1
        df_processado['Target2_Previsto'] = previsoes_t2
        df_processado['Target3_Previsto'] = previsoes_t3
        
        # Preparar o CSV para download
        csv_buffer = io.StringIO()
        df_processado.to_csv(csv_buffer, index=False, sep=';', decimal=',')
        csv_buffer.seek(0)
        
        return StreamingResponse(
            iter([csv_buffer.getvalue()]),
            media_type="text/csv",
            headers={"Content-Disposition": "attachment; filename=dados_processados_com_previsoes.csv"}
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"❌ Erro fatal ao processar arquivo para CSV: {str(e)}"
        )