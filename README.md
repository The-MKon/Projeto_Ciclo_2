# 🧠 Projeto Daruma: Plataforma de Análise Preditiva de Perfil de Jogadores

![Screenshot do Dashboard](frontend\public\dashboard.jpeg)  

## 📜 Sobre o Projeto

O Projeto Daruma é uma plataforma de **Data Science e Machine Learning de ponta a ponta**, projetada para analisar dados de sessões de jogos e prever perfis comportamentais de jogadores. A solução completa consiste em dois componentes principais:

1.  **Backend (API):** Uma API robusta desenvolvida com **Python** e **FastAPI**, responsável por servir modelos de Machine Learning treinados, processar dados brutos e fornecer previsões em tempo real.
2.  **Frontend (Dashboard):** Uma interface de usuário moderna e interativa, construída com **React**, **Vite** e **Tailwind CSS**, que permite a visualização de dados, a exploração de insights e a interação direta com os modelos preditivos.

Este repositório contém o código-fonte para ambos os componentes.

## ✨ Arquitetura Geral

O sistema é projetado com uma arquitetura cliente-servidor desacoplada, onde o frontend consome os serviços expostos pelo backend através de uma API RESTful.

```
      +-----------------------------+
      |      Frontend (React)       |
      | (Dashboard Interativo)      |
      +-----------------------------+
                  |
                  | (Requisições HTTP: Upload, Previsão)
                  |
      +-----------------------------+
      |       Backend (FastAPI)     |
      | (Serviço de ML com Python)  |
      +--------------+--------------+
                     |
                     | (Carrega Artefatos)
                     |
  +------------------+------------------+
  |      Modelos (.pkl)      |   Dados Processados (.parquet)  |
  +--------------------------+--------------------------+

```

## 🛠️ Stack de Tecnologias

| Área | Tecnologia | Propósito |
| :--- | :--- | :--- |
| **Backend** | ![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white) | Linguagem principal para Data Science e API |
| | ![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white) | Framework web de alta performance para a API |
| | ![Pandas](https://img.shields.io/badge/Pandas-150458?style=for-the-badge&logo=pandas&logoColor=white) | Manipulação e pré-processamento de dados |
| | ![Scikit-learn](https://img.shields.io/badge/scikit--learn-F7931E?style=for-the-badge&logo=scikit-learn&logoColor=white) | Treinamento e avaliação dos modelos de ML |
| **Frontend** | ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) | Biblioteca para construção da interface de usuário |
| | ![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white) | Ferramenta de build e servidor de desenvolvimento |
| | ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white) | Framework CSS para estilização rápida |
| | ![Recharts](https://img.shields.io/badge/Recharts-8884d8?style=for-the-badge) | Biblioteca para criação de gráficos interativos |

## 🚀 Como Começar

O projeto está dividido em duas pastas principais: `backend/` e `frontend/`. Cada uma possui seu próprio ambiente e instruções detalhadas de configuração.

### 1. Configurar o Backend (API)

O backend é responsável por toda a lógica de dados e Machine Learning. É o cérebro da aplicação.

➡️ **Para instruções detalhadas de como configurar e rodar o servidor, acesse o [README do Backend](./backend/README.md).**

### 2. Configurar o Frontend (Dashboard)

O frontend é a interface visual que permite interagir com os dados e as previsões da API.

➡️ **Para instruções detalhadas de como configurar e rodar o dashboard, acesse o [README do Frontend](./frontend/README.md).**

**Nota:** É necessário que o **backend esteja em execução** para que o frontend possa funcionar corretamente.

## 🤝 Colaboradores

-   Maikon Evangelista
-   Matheus Eduardo
-   Rafael Arati
-   Vinicius Paiva
```