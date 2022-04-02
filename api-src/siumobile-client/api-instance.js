import axios from "axios";

const apiInstance = axios.create({
  baseURL: 'http://bhz.siumobile.com.br:6060/siumobile-ws-v01/rest/ws',
  // timeout: 10000,
});

apiInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Aqui é onde todos os erros HTTP passam antes de virarem erros nas rotas.
    // É um intercetor Global, atinge todas as rotas.
    // Se esta função não lançar um erro a rota receberá um sucesso, mas caso
    // ela lançar chegará na rota como um erro.

    if (error.response) {
      // Request failed
      // Aqui podemos testar se é um erro de autenticação
      // e fazer um redirect para o login
    } else {
      // Network Error
      // Situações em que o servidor está inativo
      // ou problemas de conexão do lado do cliente
      // Aqui podemos usar a API navigator.online:
      // https://developer.mozilla.org/en-US/docs/Web/API/Navigator/Online_and_offline_events
      // e checar se o cliente está offline ou se o servidor que está offline
    }

    // É necessário lançar o erro para ele chegar na rota como um erro
    // Na rota que ele será tratado de forma especifica
    throw error;
  }
);

export default apiInstance;
