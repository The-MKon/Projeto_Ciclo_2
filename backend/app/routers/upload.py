from fastapi import APIRouter, UploadFile, File, HTTPException, Depends, status
from pydantic import ValidationError
import io
import pandas as pd
from app.security.auth import get_api_key
from app.schemas.upload_schemas import SessionActivityRow, FeatureRow

MAX_FILE_SIZE_MB = 5
ALLOWED_CONTENT_TYPE = (
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-excel"
)
EXPECTED_SHEETS = {
    "Session Activities": SessionActivityRow,
    "Features": FeatureRow
}

router = APIRouter(
    prefix="/upload",
    tags=["Upload de Arquivos"],
    dependencies=[Depends(get_api_key)]
)


@router.post("/excel")
async def processar_planilha_excel(file: UploadFile = File(...)):
    """
    Recebe um arquivo Excel, valida seu tipo, tamanho, estrutura e conteúdo,
    e retorna os dados validados.
    
    ✅ Aceita planilhas COM ou SEM os valores de Target1/2/3
    """
    # === CAMADA 1: Validação de Tipo e Tamanho do Arquivo ===
    if file.content_type not in ALLOWED_CONTENT_TYPE:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail=f"Tipo de arquivo não suportado. Envie um arquivo Excel (.xlsx)."
        )
    
    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE_MB * 1024 * 1024:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"Arquivo muito grande. O tamanho máximo é de {MAX_FILE_SIZE_MB}MB."
        )
   
    # === CAMADA 2: Validação de Estrutura (Abas) ===
    try:
        dicionario_de_abas = pd.read_excel(io.BytesIO(contents), sheet_name=None)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Não foi possível ler o arquivo Excel. Ele pode estar corrompido. Erro: {e}"
        )
    
    for sheet_name in EXPECTED_SHEETS.keys():
        if sheet_name not in dicionario_de_abas:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=f"A aba obrigatória '{sheet_name}' não foi encontrada no arquivo."
            )
    
    # === CAMADA 3: Validação de Conteúdo (Linha por Linha) ===
    resultado_validado = {}
   
    for sheet_name, schema in EXPECTED_SHEETS.items():
        df = dicionario_de_abas[sheet_name]
        records = df.to_dict('records')
       
        try:
            validated_data = [
                schema(**{str(k): v for k, v in row.items()}).model_dump() 
                for row in records
            ]
            resultado_validado[sheet_name] = validated_data
       
        except ValidationError as e:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=f"Erro de validação na aba '{sheet_name}'. Detalhes: {e.errors()}"
            )
    
    # ✅ NOVO: Verificar se os Targets estão presentes
    session_data = resultado_validado.get("Session Activities", [])
    tem_targets = False
    
    if session_data:
        primeira_linha = session_data[0]
        tem_targets = all([
            primeira_linha.get("Target1") is not None,
            primeira_linha.get("Target2") is not None,
            primeira_linha.get("Target3") is not None
        ])
    
    return {
        "status": "sucesso",
        "mensagem": "Arquivo Excel validado e processado com sucesso.",
        "tem_targets": tem_targets,  # ✅ Informa se a planilha tem targets
        "total_jogadores": len(session_data),
        "dados": resultado_validado
    }