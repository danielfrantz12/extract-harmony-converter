/**
 * Interfaces para tipagem das respostas da API
 */
export interface ConversionResult {
  success: boolean;
  data?: {
    suggestions: Array<{
      texto: string;
      sugestao: string;
      tipo: string;
    }>;
    outputFile: string;
  };
  errorMessage?: string;
}

// URL base da API - ajuste conforme necessário
const API_BASE_URL = 'http://localhost:3000';

// Função para converter o extrato bancário
export const convertBankStatement = async (
  file: File, 
  bankName: string,
  password?: string
): Promise<ConversionResult> => {
  try {
    const formData = new FormData();
    formData.append('statement', file);
    formData.append('bank', bankName);
    if (password) {
      formData.append('password', password);
    }

    const response = await fetch(`${API_BASE_URL}/api/convert-suggest`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        errorMessage: errorData.error || 'Erro ao processar o arquivo'
      };
    }

    const data = await response.json();
    return {
      success: true,
      data: {
        suggestions: data.suggestions,
        outputFile: data.outputFile
      }
    };
  } catch (error) {
    console.error('Erro na conversão:', error);
    return {
      success: false,
      errorMessage: 'Erro ao se comunicar com o servidor'
    };
  }
};

// Função para aprovar sugestões
export const approveSuggestions = async (suggestions: Array<{ texto: string; sugestao: string }>) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/approve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(suggestions)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erro ao aprovar sugestões');
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao aprovar sugestões:', error);
    throw error;
  }
};

// Lista de bancos suportados
export const getSupportedBanks = (): string[] => {
  return [
    "C6",
    "XP"
  ];
};
