import pandas as pd
import json

# Carrega o seu dataset processado localmente
try:
    df = pd.read_parquet('app/data/processed/dados_processados.parquet')
except FileNotFoundError:
    print("ERRO: O arquivo 'dados_processados.parquet' não foi encontrado na pasta 'app/data/processed/'.")
    print("Certifique-se de que você copiou as pastas do Colab para o seu projeto local.")
    exit()

# Pega a primeira linha como nosso "jogador de teste"
jogador_teste_series = df.iloc[10]

# Converte a linha do Pandas para um dicionário Python padrão
# .replace({pd.NA: None}) lida com possíveis valores nulos
jogador_teste_dict = jogador_teste_series.replace({pd.NA: None}).to_dict()

# Monta o payload final no formato que a API espera
payload_final = {
    "dados_jogador": jogador_teste_dict
}

def default_converter(o):
    if isinstance(o, (pd.Timestamp, pd.Timedelta)):
        return str(o)
    raise TypeError("Tipo não serializável")

# Imprime o JSON formatado, pronto para ser copiado e colado
print("=== COPIE O JSON ABAIXO PARA USAR NO TESTE DA API ===")
print(json.dumps(payload_final, indent=2, ensure_ascii=False, default=default_converter))