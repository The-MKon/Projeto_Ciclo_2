const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

const headers = new Headers();
headers.append('X-API-Key', API_KEY);

// Função principal para fazer o upload e obter a análise JSON
export const uploadAndProcessFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch(`${API_BASE_URL}/processar/excel-completo-com-preprocessamento`, {
      method: 'POST',
      headers: headers,
      body: formData,
      // Não defina 'Content-Type', o navegador fará isso por você com o boundary correto para FormData
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `Erro HTTP: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Erro no serviço de API:", error);
    throw error;
  }
};

// Função para o download do CSV
export const downloadProcessedCsv = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch(`${API_BASE_URL}/processar/excel-para-csv-processado`, {
            method: 'POST',
            headers: headers,
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || `Erro HTTP: ${response.status}`);
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'dados_processados_com_previsoes.csv';
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);

    } catch (error) {
        console.error("Erro ao baixar CSV:", error);
        throw error;
    }
};