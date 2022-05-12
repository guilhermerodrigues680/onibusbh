import { routes } from "../siumobile-client";
import { calcCrow } from "./coords-helper";
import { roundToDecimalPlaces } from "./math-helper";
import { performance } from "perf_hooks";

/**
 * Busca veiculos proximos de uma latitude e longitude.
 *
 * A estrategia utilizada é de buscar as paradas próximas,
 * buscar o itinerários, buscar os veiculos online deste itinerário e
 * calcular os veiculos próximos.
 *
 * @param {number} lat
 * @param {number} lng
 */
async function getVeiculosProximos(lat, lng) {
  const perfTimes = {
    startTime: performance.now(),
    getParadasProximas: 0,
    loopGetPrevisoesParada: 0,
    loopGetVeiculosMapa: 0
  };
  const metrics = {
    paradasLength: 0,
    countGetPrevisoesParada: 0,
    countGetVeiculosMapa: 0
  };
  const nearbyVehicles = new Map();
  // mapa para filtrar itinerário já pesquisados, não uso o Set pois
  // o Set é uma estrutura ordenada, ou seja ordena sempre após uma inserção.
  const codItinerarios = new Map();

  const { paradas } = await routes.getParadasProximas(lat, lng);
  metrics.paradasLength = paradas.length;
  perfTimes.getParadasProximas = performance.now() - perfTimes.startTime;

  // Para cada parada preciso saber as previsoes dela (na verdades os itinerarios)

  const proms = paradas.map(({ cod }) => async () => {
    metrics.countGetPrevisoesParada++;
    const prevParada = await routes.getPrevisoesParada(cod);
    return prevParada.previsoes.map(({ codItinerario }) => codItinerario);
  });

  // Faz as requisições duas a duas

  // TODO: Parametrizar MIN_NUM_NEARBY_VEHICLES
  const MIN_NUM_NEARBY_VEHICLES = 10; // default: 10
  // TODO: Parametrizar MAX_DISTANCE
  const MAX_DISTANCE = 5; // distancia em km, default: 3

  const batchSize = 2;
  while (proms.length && nearbyVehicles.size < MIN_NUM_NEARBY_VEHICLES) {
    const itemsForBatch = proms.splice(0, batchSize);
    const promsRes = await Promise.all(itemsForBatch.map(f => f()));
    const itinerarios = promsRes
      .reduce((acc, cur) => acc.concat(cur), [])
      .filter(item => {
        // Filtra e já adiciona ao mapa de codItinerarios
        if (codItinerarios.has(item)) {
          return false;
        }
        codItinerarios.set(item, null);
        return true;
      });

    // Faz as requisições duas a duas

    const batchSizeIti = 2;
    const promsIti = itinerarios.map(codItinerario => async () => {
      metrics.countGetVeiculosMapa++;
      const { veiculos } = await routes.getVeiculosMapa(codItinerario);
      return veiculos.map(v => ({
        ...v,
        distance: roundToDecimalPlaces(calcCrow(lat, lng, v.lat, v.long))
      }));
    });

    while (promsIti.length && nearbyVehicles.size < MIN_NUM_NEARBY_VEHICLES) {
      const itiItemsForBatch = promsIti.splice(0, batchSizeIti);
      const promsRes = await Promise.all(itiItemsForBatch.map(f => f()));
      const veics = promsRes.reduce((acc, cur) => [...acc, ...cur], []);

      veics
        .filter(v => v.distance < MAX_DISTANCE)
        .forEach(v => nearbyVehicles.set(v.numVeicGestor, v));
    }
  }
  perfTimes.loopGetPrevisoesParada = performance.now() - perfTimes.startTime;

  console.debug(
    "metrics",
    metrics,
    "\nnearbyVehicles.size",
    nearbyVehicles.size,
    "\nperf",
    perfTimes
  );

  return { veicList: [...nearbyVehicles.values()] };
}

export default { getVeiculosProximos };
