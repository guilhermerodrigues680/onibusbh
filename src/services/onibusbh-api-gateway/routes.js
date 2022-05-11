import apiInstance from "./api-instance";
import { handleRequest } from "./handle-request";

const ROUTE = "/api/v1";

const getLinhas = () => handleRequest(apiInstance.get(`${ROUTE}/linhas`));
const getParadasPorLinha = cod => handleRequest(apiInstance.get(`${ROUTE}/linhas/${cod}/paradas`));
const getParadasProximas = (lat, lng) =>
  handleRequest(apiInstance.get(`${ROUTE}/paradas`, { params: { lat, lng } }));
const getParada = cod => handleRequest(apiInstance.get(`${ROUTE}/paradas/${cod}`));
const getPrevisoesParada = cod =>
  handleRequest(apiInstance.get(`${ROUTE}/paradas/${cod}/previssoes`));
const getItinerario = cod => handleRequest(apiInstance.get(`${ROUTE}/itinerarios/${cod}`));
const getVeiculosMapa = cod =>
  handleRequest(apiInstance.get(`${ROUTE}/itinerarios/${cod}/veiculos-tempo-real`));
const getVeiculosProximos = (lat, lng) =>
  handleRequest(apiInstance.get(`${ROUTE}/veiculos-proximos-tempo-real`, { params: { lat, lng } }));

export {
  getLinhas,
  getParadasProximas,
  getParada,
  getPrevisoesParada,
  getParadasPorLinha,
  getItinerario,
  getVeiculosMapa,
  getVeiculosProximos
};
