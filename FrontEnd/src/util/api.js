import axios from 'axios';

// endereço da API (pode ser trocado no arquivo .env.local com REACT_APP_API_URL)
export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
});

// monta o endereço da imagem do produto salva na API
export function urlImagem(nomeArquivo) {
  return nomeArquivo ? `${API_URL}/images/${nomeArquivo}` : null;
}

// pega a mensagem de erro que a API devolveu
export function mensagemErro(err, padrao = 'Não foi possível conectar na API.') {
  return err?.response?.data?.message || padrao;
}

export default api;
