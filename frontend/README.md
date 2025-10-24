# Analytics Dashboard - Frontend

## 📊 Sobre o Projeto

Este é o frontend para a API de Análise Preditiva de Perfil de Jogadores. Construído com **React**, **Vite** e **Tailwind CSS**, este dashboard interativo permite que os usuários façam upload de arquivos Excel com dados brutos de jogadores, visualizem os resultados do pré-processamento, e explorem as previsões geradas pelos modelos de Machine Learning servidos pelo backend.

O objetivo é fornecer uma interface clara e intuitiva para extrair insights dos dados e da performance dos modelos preditivos.

## ✨ Funcionalidades

-   **Upload Interativo:** Permite arrastar e soltar (`drag-and-drop`) ou selecionar arquivos Excel (`.xlsx`, `.xls`).
-   **Visualização Multi-abas:** A análise é organizada em quatro seções principais:
    -   **Visão Geral:** Métricas de alto nível sobre a performance dos modelos (R², MAE, MAPE) e detalhes da engenharia de features.
    -   **Dados:** Uma tabela completa e paginada com todos os dados processados e as previsões, com funcionalidades de filtro e ordenação.
    -   **Tendências:** Gráficos de dispersão que mostram as correlações entre os targets previstos.
    -   **Detalhada:** Análises aprofundadas sobre a distribuição dos dados, uso do tempo, perfis comportamentais e um "deep dive" nos parâmetros dos modelos.
-   **Download de Resultados:** Funcionalidade para baixar um arquivo CSV completo contendo os dados originais, as features criadas e as previsões dos modelos.
-   **Feedback em Tempo Real:** Indicadores de carregamento, sucesso e mensagens de erro claras durante a interação com a API.

## 🛠️ Tecnologias Utilizadas

-   **Framework:** [React](https://react.dev/) com [Vite](https://vitejs.dev/)
-   **Estilização:** [Tailwind CSS](https://tailwindcss.com/)
-   **Gráficos:** [Recharts](https://recharts.org/)
-   **Ícones:** [Lucide React](https://lucide.dev/)
-   **Linting:** [ESLint](https://eslint.org/)

## 🚀 Como Executar Localmente

Siga os passos abaixo para configurar e rodar o frontend na sua máquina.

### 1. Pré-requisitos

-   [Node.js](https://nodejs.org/) (versão 18 ou superior)
-   `npm` (gerenciador de pacotes do Node.js, vem com a instalação)
-   **API Backend Rodando:** O frontend precisa da API backend para funcionar. Certifique-se de que o [servidor backend](../backend/README.md) está configurado e em execução.

### 2. Configuração do Ambiente

**a. Navegue até a pasta do frontend:**
```bash
cd frontend
```

**b. Instale as dependências:**
```bash
npm install
```

**c. Configure as variáveis de ambiente:**
Crie um arquivo chamado `.env` na raiz da pasta `frontend`. Este arquivo conterá a URL da sua API backend e a chave de API.
```
# Conteúdo para o arquivo frontend/.env

# URL base da sua API backend.
# Se você estiver rodando o backend localmente na porta 8000, use esta URL.
VITE_API_BASE_URL=http://127.0.0.1:8000

# Chave de API para autenticar com o backend.
# Deve ser a mesma chave definida no arquivo .env do backend.
VITE_API_KEY="INSIRA_ALGUMA_CHAVE_PARA"
```
**Importante:** Substitua `INSIRA_ALGUMA_CHAVE_PARA` pela mesma chave que você configurou no seu backend.

### 3. Inicie o Servidor de Desenvolvimento

Com as dependências instaladas e o `.env` configurado, inicie o servidor de desenvolvimento do Vite:
```bash
npm run dev
```
O servidor estará rodando, geralmente em `http://localhost:5173`. Abra esta URL no seu navegador para ver o dashboard em ação.

## 🏗️ Estrutura de Pastas

O código-fonte está organizado da seguinte maneira dentro da pasta `src/`:

```
src/
├── components/
│   ├── features/  # Componentes complexos que representam uma funcionalidade (ex: tabela, gráficos)
│   ├── ui/        # Componentes de UI genéricos e reutilizáveis (ex: Pagination)
│   └── views/     # Componentes que representam as abas principais (Overview, Data, etc.)
├── services/
│   └── apiService.js  # Lógica centralizada para todas as chamadas à API backend
├── App.jsx            # Componente principal que gerencia o estado e a navegação
└── main.jsx           # Ponto de entrada da aplicação React
```

## 📜 Scripts Disponíveis

-   `npm run dev`: Inicia o servidor de desenvolvimento com hot-reloading.
-   `npm run build`: Compila a aplicação para produção, gerando os arquivos estáticos na pasta `dist/`.
-   `npm run lint`: Executa o ESLint para verificar a qualidade do código.
-   `npm run preview`: Inicia um servidor local para visualizar a versão de produção (após rodar `npm run build`).