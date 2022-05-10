import { routes } from "../siumobile-client";
import { calcCrow } from "./coords-helper";
import { roundToDecimalPlaces } from "./math-helper";

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
  const res = await routes.getParadasProximas(lat, lng);
  // const cods = res.paradas.map(p => p.cod);
  // console.debug(cods.length);
  console.debug(res.paradas.length);

  // const codItinerarios = [];
  // const veics = [];
  const codItinerarios = new Map();
  const veics = new Map();
  for (const { cod: codParada } of res.paradas) {
    const prevParada = await routes.getPrevisoesParada(codParada);
    console.debug("prevParada OK: ", codParada);

    for (const { codItinerario } of prevParada.previsoes) {
      if (!codItinerario || codItinerarios.has(codItinerario)) {
        continue;
      }
      codItinerarios.set(codItinerario);

      console.debug("parada", codParada, "itinerario OK: ", codItinerario);
      const veicMapaItinerario = await routes.getVeiculosMapa(codItinerario);
      for (const cv of veicMapaItinerario.veiculos) {
        if (veics.has(cv.numVeicGestor)) {
          continue;
        }

        const distance = calcCrow(lat, lng, cv.lat, cv.long);
        const v = {
          ...cv,
          distance: roundToDecimalPlaces(distance)
        };

        if (distance < 3) {
          veics.set(cv.numVeicGestor, v);
        }
      }
    }

    if (veics.size > 10) {
      break;
    }
  }

  const veicList = Array.from(veics.values());

  return { veicList };
}

export default { getVeiculosProximos };
