# backend/app/preprocessing/preprocessor.py
import pandas as pd
import numpy as np
from sklearn.impute import SimpleImputer
from pathlib import Path

class DataPreprocessor:
    """
    Classe que replica toda a lógica de pré-processamento do notebook.
    """
    
    def __init__(self):
        # Classificação de colunas (do seu dicionário de dados)
        self.col_id = ['Código de Acesso']
        self.col_datetime = ['Data/Hora Último']
        self.col_targets = ['Target1', 'Target2', 'Target3']
        
        # Colunas de texto, Likert, Tempo, NãoLikert (serão preenchidas dinamicamente)
        self.col_texto = []
        self.col_likert = []
        self.col_tempo = []
        self.col_nao_likert = []
    
    def _classificar_colunas(self, df: pd.DataFrame):
        """Classifica todas as colunas do DataFrame."""
        # Colunas de texto (cores, explicações)
        self.col_texto = []
        for col in df.columns:
            if any(pattern in col for pattern in ['Cor', 'Expl', 'Explicação', 'Acordar', ' - ']):
                self.col_texto.append(col)
        
        # Colunas Likert
        self.col_likert = [col for col in df.columns if col.startswith('F07') or 
                          (col.startswith('F11') and 'Tempo' not in col and col not in self.col_texto)]
        
        # Colunas de Tempo
        self.col_tempo = []
        t_cols = [col for col in df.columns if col.startswith('T') and col not in self.col_texto]
        tempo_cols = [col for col in df.columns if 'Tempo' in col and col not in self.col_texto]
        self.col_tempo = list(set(t_cols + tempo_cols))
        
        # Colunas NãoLikert (o que sobrou)
        todas_classificadas = (self.col_id + self.col_datetime + self.col_targets + 
                              self.col_texto + self.col_likert + self.col_tempo)
        self.col_nao_likert = [col for col in df.columns if col not in todas_classificadas]
    
    def limpar_dados(self, df: pd.DataFrame) -> pd.DataFrame:
        """Remove colunas vazias e converte tipos de dados."""
        df_clean = df.copy()
        
        # Remover colunas __EMPTY
        cols_to_drop = [col for col in df_clean.columns if '__EMPTY' in str(col)]
        df_clean = df_clean.drop(columns=cols_to_drop, errors='ignore')
        
        # Classificar colunas
        self._classificar_colunas(df_clean)
        
        # Converter Data/Hora
        if 'Data/Hora Último' in df_clean.columns:
            df_clean['Data/Hora Último'] = pd.to_datetime(df_clean['Data/Hora Último'], errors='coerce')
        
        # Converter colunas numéricas
        colunas_numericas = self.col_likert + self.col_tempo + self.col_nao_likert + self.col_targets
        for col in colunas_numericas:
            if col in df_clean.columns and col not in self.col_texto:
                df_clean[col] = pd.to_numeric(df_clean[col], errors='coerce')
        
        # Garantir que colunas de texto sejam strings
        for col in self.col_texto:
            if col in df_clean.columns:
                df_clean[col] = df_clean[col].fillna('N/A').astype(str)
        
        return df_clean
    
    def tratar_valores_especiais(self, df: pd.DataFrame) -> pd.DataFrame:
        """Substitui valores especiais por NaN."""
        df_treated = df.copy()
        
        # Substituir 'N/A' por NaN
        df_treated = df_treated.replace('N/A', np.nan)
        
        # Substituir -1, -1.0 e códigos de status por NaN
        for col in self.col_likert + self.col_tempo + self.col_nao_likert:
            if col in df_treated.columns:
                df_treated.loc[df_treated[col] == -1, col] = np.nan
                df_treated.loc[df_treated[col] == -1.0, col] = np.nan
                
                if df_treated[col].dtype == 'object':
                    df_treated.loc[df_treated[col].isin(['00', '01', '02', '10', '11', '12']), col] = np.nan
                    df_treated[col] = pd.to_numeric(df_treated[col], errors='coerce')
        
        return df_treated
    
    def criar_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """Cria todas as features de engenharia."""
        df_featured = df.copy()
        
        # 1. Features de Idade
        if 'F0103' in df_featured.columns:
            df_featured['Idade_Anos'] = df_featured['F0103'] * (84 - 53) + 53
        
        # 2. Features Agregadas de Likert
        likert_cols_valid = [col for col in self.col_likert if col in df_featured.columns]
        if likert_cols_valid:
            df_featured['Likert_Score_Medio'] = df_featured[likert_cols_valid].mean(axis=1)
            df_featured['Likert_Score_Std'] = df_featured[likert_cols_valid].std(axis=1)
            df_featured['Likert_Score_Min'] = df_featured[likert_cols_valid].min(axis=1)
            df_featured['Likert_Score_Max'] = df_featured[likert_cols_valid].max(axis=1)
            df_featured['Likert_Missing_Count'] = df_featured[likert_cols_valid].isnull().sum(axis=1)
        
        # 3. Features de Tempo
        tempo_cols_valid = [col for col in self.col_tempo if col in df_featured.columns]
        if tempo_cols_valid:
            df_featured['Tempo_Total'] = df_featured[tempo_cols_valid].sum(axis=1)
            df_featured['Tempo_Medio'] = df_featured[tempo_cols_valid].mean(axis=1)
            df_featured['Tempo_Std'] = df_featured[tempo_cols_valid].std(axis=1)
            df_featured['Tempo_Min'] = df_featured[tempo_cols_valid].min(axis=1)
            df_featured['Tempo_Max'] = df_featured[tempo_cols_valid].max(axis=1)
            df_featured['Tem_Timeout'] = (df_featured[tempo_cols_valid] > 300).any(axis=1).astype(int)
        
        # 4. Features de Performance (Q04XX)
        q04_cols = [col for col in df_featured.columns if col.startswith('Q04')]
        if q04_cols:
            df_featured['Performance_Score_Total'] = df_featured[q04_cols].sum(axis=1)
            df_featured['Performance_Score_Medio'] = df_featured[q04_cols].mean(axis=1)
        
        # 5. Features de Perguntas P
        p_cols = [col for col in df_featured.columns if col.startswith('P') and len(col) > 1 and col[1].isdigit()]
        if p_cols:
            df_featured['Respostas_P_Media'] = df_featured[p_cols].mean(axis=1)
            df_featured['Respostas_P_Std'] = df_featured[p_cols].std(axis=1)
            df_featured['Respostas_P_Missing'] = df_featured[p_cols].isnull().sum(axis=1)
        
        # 6. Features de Quantidade
        qtd_cols = [col for col in df_featured.columns if col.startswith('Qtd')]
        if qtd_cols:
            df_featured['Quantidade_Total'] = df_featured[qtd_cols].sum(axis=1)
            df_featured['Quantidade_Media'] = df_featured[qtd_cols].mean(axis=1)
        
        # 7. Features de Razão
        if 'QtdHorasDormi' in df_featured.columns and 'QtdHorasSono' in df_featured.columns:
            df_featured['Razao_Sono'] = df_featured['QtdHorasDormi'] / (df_featured['QtdHorasSono'] + 1e-6)
        
        if 'Q0413' in df_featured.columns and 'Q0414' in df_featured.columns:
            df_featured['Razao_Q0413_Q0414'] = df_featured['Q0413'] / (df_featured['Q0414'] + 1e-6)
        
        # 8. Features Temporais
        if 'Data/Hora Último' in df_featured.columns:
            df_featured['Hora_do_Dia'] = df_featured['Data/Hora Último'].dt.hour
            df_featured['Dia_da_Semana'] = df_featured['Data/Hora Último'].dt.dayofweek
            df_featured['Fim_de_Semana'] = (df_featured['Dia_da_Semana'] >= 5).astype(int)
        
        # 9. Features de Consistência
        f07_cols = [col for col in df_featured.columns if col.startswith('F07') and col[3:].isdigit()]
        if f07_cols:
            df_featured['Consistencia_F07'] = df_featured[f07_cols].std(axis=1)
        
        f11_cols = [col for col in df_featured.columns if col.startswith('F11') and col[3:].isdigit()]
        if f11_cols:
            df_featured['Consistencia_F11'] = df_featured[f11_cols].std(axis=1)
        
        # ========== FEATURES ESPECIALIZADAS (CRÍTICAS PARA OS MODELOS) ==========
        # Feature 1: Razão de Eficiência (Performance por Tempo)
        if 'Performance_Score_Total' in df_featured.columns and 'Tempo_Total' in df_featured.columns:
            df_featured['Eficiencia_Performance'] = (
                df_featured['Performance_Score_Total'] / (df_featured['Tempo_Total'] + 1e-6)
            )
        
        # Feature 2: Interação entre Atitude e Consistência
        if 'Likert_Score_Medio' in df_featured.columns and 'Consistencia_F07' in df_featured.columns:
            df_featured['Atitude_Consistente'] = (
                df_featured['Likert_Score_Medio'] * df_featured['Consistencia_F07']
            )
        
        # Feature 3: Idade ao Quadrado (Feature Polinomial)
        if 'Idade_Anos' in df_featured.columns:
            df_featured['Idade_Anos_Sq'] = df_featured['Idade_Anos'] ** 2
        
        return df_featured
    
    def imputar_missing_values(self, df: pd.DataFrame) -> pd.DataFrame:
        """Imputa valores ausentes usando estratégias apropriadas."""
        df_imputed = df.copy()
        
        # Imputar Likert com mediana
        likert_to_impute = [col for col in self.col_likert if col in df_imputed.columns]
        if likert_to_impute:
            imputer = SimpleImputer(strategy='median')
            df_imputed[likert_to_impute] = imputer.fit_transform(df_imputed[likert_to_impute])
        
        # Imputar Tempo com mediana
        tempo_to_impute = [col for col in self.col_tempo if col in df_imputed.columns]
        if tempo_to_impute:
            imputer = SimpleImputer(strategy='median')
            df_imputed[tempo_to_impute] = imputer.fit_transform(df_imputed[tempo_to_impute])
        
        # Imputar NãoLikert com mediana
        naolikert_to_impute = [col for col in self.col_nao_likert 
                               if col in df_imputed.columns and df_imputed[col].dtype in ['float64', 'int64']]
        if naolikert_to_impute:
            imputer = SimpleImputer(strategy='median')
            df_imputed[naolikert_to_impute] = imputer.fit_transform(df_imputed[naolikert_to_impute])
        
        # Preencher texto com 'UNKNOWN'
        texto_to_fill = [col for col in self.col_texto if col in df_imputed.columns]
        for col in texto_to_fill:
            df_imputed[col] = df_imputed[col].fillna('UNKNOWN')
        
        return df_imputed
    
    def processar(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Método principal que executa todo o pipeline de pré-processamento.
        """
        print("🔄 Iniciando pré-processamento...")
        
        # 1. Limpeza inicial
        df_clean = self.limpar_dados(df)
        print(f"  ✓ Limpeza concluída: {df_clean.shape}")
        
        # 2. Tratar valores especiais
        df_treated = self.tratar_valores_especiais(df_clean)
        print(f"  ✓ Valores especiais tratados")
        
        # 3. Criar features
        df_featured = self.criar_features(df_treated)
        print(f"  ✓ Features criadas: {df_featured.shape}")
        
        # 4. Imputar missing values
        df_final = self.imputar_missing_values(df_featured)
        print(f"  ✓ Missing values imputados")
        
        print(f"✅ Pré-processamento concluído! Shape final: {df_final.shape}")
        return df_final