# API de Análise Preditiva de Perfil de Jogadores

## 🧠 Sobre o Projeto

Este projeto consiste em uma API backend desenvolvida em Python com FastAPI, projetada para servir modelos de Machine Learning. O objetivo principal é analisar dados de sessões de jogos para prever três métricas-alvo (`Target1`, `Target2`, `Target3`).

A API é o resultado final de um pipeline de ciência de dados completo, que inclui:
1.  **Pré-processamento e Limpeza de Dados:** Um notebook dedicado que transforma os dados brutos em um dataset limpo e enriquecido.
2.  **Modelagem Especializada:** Notebooks individuais para cada target que treinam, otimizam e avaliam modelos de regressão específicos.
3.  **Serviço de Previsão:** Esta API, que carrega os modelos treinados e oferece endpoints para consulta e previsão em tempo real.

## ✨ Funcionalidades Principais

A API oferece quatro tipos de funcionalidades:

1.  **Consulta de Dados Processados:** Acesso aos dados limpos, relatórios de performance e metadados gerados pelo pipeline de pré-processamento.
2.  **Previsão em Tempo Real:** Um endpoint que recebe os dados de um único jogador e retorna as previsões para os três targets.
3.  **Upload e Análise em Lote:** Endpoints que permitem o upload de um arquivo Excel com dados brutos de jogadores para aplicar todo o pipeline de pré-processamento e previsão em lote, retornando um JSON detalhado ou um arquivo CSV com os resultados.
4.  **Segurança:** Todos os endpoints são protegidos por chave de API e incluem medidas de segurança como rate limiting e CORS.

## 📂 Arquitetura do Projeto

O projeto segue uma estrutura modular para facilitar a manutenção e escalabilidade:

```
backend/
├── app/
│   ├── core/         # Configurações globais (leitura do .env)
│   ├── data/         # Dados processados e índices (gerados pelo Colab)
│   ├── models/       # Modelos, scalers e listas de features (.pkl)
│   ├── preprocessing/  # Lógica de pré-processamento replicada para a API
│   ├── results/      # Relatórios finais em JSON e CSV
│   ├── routers/      # Lógica dos endpoints da API (analise, previsao, upload)
│   ├── schemas/      # Validação de dados de entrada/saída com Pydantic
│   └── security/     # Lógica de autenticação com chave de API
│   └── main.py       # Ponto de entrada da aplicação FastAPI
├── .env.example      # Exemplo de arquivo de variáveis de ambiente
├── get_test_player.py  # Script para gerar um JSON de teste
└── requirements.txt  # Dependências do projeto
```

## 🚀 Como Executar Localmente

Siga os passos abaixo para configurar e rodar o projeto na sua máquina.

### 1. Pré-requisitos

-   Python 3.10 ou superior
-   `pip` (gerenciador de pacotes do Python)

### 2. Configuração do Ambiente

**a. Clone o repositório:**
```bash
git clone https://github.com/The-MKon/Projeto_Ciclo_2.git
cd backend
```

**b. Crie e ative um ambiente virtual:**
É uma boa prática isolar as dependências do projeto.
```bash
# Criar o ambiente
python -m venv .venv

# Ativar no Windows (PowerShell)
.\.venv\Scripts\Activate

# Ativar no macOS/Linux
source .venv/bin/activate
```

**c. Instale as dependências:**
```bash
pip install -r requirements.txt
```

**d. Configure as variáveis de ambiente:**
Crie um arquivo chamado `.env` na raiz da pasta `backend`, baseado no arquivo `.env.example`.
```bash
# Crie o arquivo .env
# No Windows:
copy .env.example .env

# No macOS/Linux:
cp .env.example .env
```
Abra o arquivo `.env` e substitua o valor de `API_SECRET_KEY` por uma chave secreta forte de sua escolha.

### 3. Popule os Dados e Modelos

Certifique-se de que as pastas `app/data`, `app/models`, e `app/results` contenham os artefatos corretos gerados pelos seus notebooks do Colab. A estrutura deve corresponder à descrita na seção de arquitetura.

### 4. Inicie a API

Com o ambiente virtual ativado, execute o seguinte comando no terminal:
```bash
uvicorn app.main:app --reload
```
O servidor estará rodando em `http://127.0.0.1:8000`. A opção `--reload` reinicia o servidor automaticamente a cada alteração no código.

## ⚙️ Como Usar a API

### Documentação Interativa (Swagger UI)

A forma mais fácil de explorar e testar a API é através da documentação interativa. Com o servidor rodando, acesse:
**http://127.0.0.1:8000/docs**

1.  **Autorize:** Clique no botão "Authorize" no canto superior direito e insira a `API_SECRET_KEY` que você definiu no seu arquivo `.env`.
2.  **Teste os Endpoints:** Expanda qualquer uma das seções (`Consulta de Análise`, `Previsão de Targets`, etc.), clique em "Try it out" e execute as requisições.

### Exemplos de Endpoints Principais

-   **`GET /analise/relatorio/{target_id}`**: Retorna o relatório de performance detalhado para um target específico (`t1`, `t2`, ou `t3`).
-   **`POST /prever`**: Recebe um JSON com os dados de um jogador e retorna as previsões para os três targets. Use o script `get_test_player.py` para gerar um JSON de teste:
    ```bash
    python get_test_player.py
    ```
-   **`POST /processar/excel-completo-com-preprocessamento`**: Faz o upload de um arquivo `JogadoresV2.xlsx` bruto, aplica todo o pipeline e retorna um JSON completo com os dados processados e as previsões para cada jogador.

## 🤝 Colaboradores

-   Maikon Junior Evangelista
-   Matheus Eduardo
-   Rafael Arati
-   Vinicius Paiva

---

### Anexo: Arquivo `.env.example`

Para garantir que outros desenvolvedores possam configurar o ambiente corretamente, inclua um arquivo chamado `.env.example` na raiz da pasta `backend`. Este arquivo serve como um modelo para o arquivo `.env` real, que não deve ser enviado para o Git.

**Conteúdo para o arquivo `.env.example`:**
```
# =======================================================
#    VARIÁVEIS DE AMBIENTE PARA A API DE ANÁLISE
# =======================================================

# Chave secreta para proteger os endpoints da API.
# Em um ambiente de produção, substitua por uma chave forte e aleatória
# gerada por um gerenciador de senhas ou um comando como `openssl rand -hex 32`.
API_SECRET_KEY="IMSIRA_ALGUMA_CHAVE_PARA"

# Ambiente de execução.
# Use "development" para rodar localmente (ativa o modo de debug).
# Use "production" quando for fazer o deploy em um servidor.
ENVIRONMENT="development"
```
