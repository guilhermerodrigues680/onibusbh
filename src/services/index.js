import { jsonpbh } from "./jsonp.js";

const apiBaseUrl = 'http://mobile-l.sitbus.com.br:6060/siumobile-ws-v01/rest/ws'

async function getLinhas() {
  try {
    const apiRes = await jsonpbh(`${apiBaseUrl}/buscarLinhas`) // /retornoJSONListaLinhas
    console.debug(apiRes)
    const linhasStr = apiRes.linhas[0].replace(/^\{{1}|\}{1}$/gm, '')
      .split('},{')
      .map(linStrObj => linStrObj.replaceAll("\'", "\""))
      .map(linStrObj => '{' + linStrObj + '}');

    const linhasArr = []
    // Parse individual para rastreamento de erros
    for (const linStrObj of linhasStr) {
      try {
        const parsed = JSON.parse(linStrObj)
        linhasArr.push(parsed)
      } catch (error) {
        console.error('Erro no parse da linha', linStrObj, error)
      }
    }

    const res = {
      sucesso: apiRes.sucesso,
      linhas: linhasArr,
      subLinhas: apiRes.subLinhas
    }
    console.debug(res)
    return res
  } catch (error) {
    console.error(error)
    throw error
  }
}

async function getParadasProximas(longitude, latitude) {
  //http://mobile-l.sitbus.com.br:6060/siumobile-ws-v01/rest/ws/buscarParadasProximas/$longitude/$latitude/0/retornoJSON
  try {
    const apiRes = await jsonpbh(`${apiBaseUrl}/buscarParadasProximas/${longitude}/${latitude}/0`) // /retornoJSON
    console.debug(apiRes)
    const { paradas, postosVenda, sucesso } = apiRes
    return {
      paradas,
      postosVenda,
      sucesso
    }
  } catch (error) {
    console.error(error)
    throw error
  }
}

async function getDadosParada(codParada) {
  //http://mobile-l.sitbus.com.br:6060/siumobile-ws-v01/rest/ws/buscarDadosParada/$codParada/0/retornoJSONPontosItinerario
  try {
    const apiRes = await jsonpbh(`${apiBaseUrl}/buscarDadosParada/${codParada}/0`) // /retornoJSONPontosItinerario
    console.debug(apiRes)
    // const { paradas, postosVenda, sucesso } = apiRes
    // return {
    //   paradas,
    //   postosVenda,
    //   sucesso
    // }
  } catch (error) {
    console.error(error)
    throw error
  }
}

async function getPrevisoesParada(codParada) {
  // http://mobile-l.sitbus.com.br:6060/siumobile-ws-v01/rest/ws/buscarPrevisoes/$codParada/0/retornoJSON
  try {
    const apiRes = await jsonpbh(`${apiBaseUrl}/buscarPrevisoes/${codParada}/0`) // /retornoJSON
    console.debug(apiRes)
    const { horaConsulta, previsoes, sucesso } = apiRes
    return {
      horaConsulta,
      previsoes,
      sucesso
    }
  } catch (error) {
    console.error(error)
    throw error
  }
}

async function getParadasPorLinha(codLinha) {
  // http://mobile-l.sitbus.com.br:6060/siumobile-ws-v01/rest/ws/buscarParadasPorLinha/$codLinha/0/retornoJSON
  try {
    const apiRes = await jsonpbh(`${apiBaseUrl}/buscarParadasPorLinha/${codLinha}/0`) // /retornoJSON
    console.debug(apiRes)
    const { horaConsulta, previsoes, sucesso } = apiRes
    return {
      horaConsulta,
      previsoes,
      sucesso
    }
  } catch (error) {
    console.error(error)
    throw error
  }
}

async function getItinerario(codItinerario) {
  // http://mobile-l.sitbus.com.br:6060/siumobile-ws-v01/rest/ws/buscarItinerario/$codItinerario/0/retornoJSONItinerario
  try {
    const apiRes = await jsonpbh(`${apiBaseUrl}/buscarItinerario/${codItinerario}/0`) // /retornoJSONItinerario
    console.debug(apiRes)
    const { itinerarios, sucesso } = apiRes
    return {
      itinerarios,
      sucesso
    }
  } catch (error) {
    console.error(error)
    throw error
  }
}

/**
 * Retorna a localização de todos os veículos que estão em rota fazendo o itinerario
 * @see {@link https://gist.github.com/brunoarmanelli/71193578d84b929799653aa61cdb4ba9#obtendo-coordenadas-dos-ve%C3%ADculos-da-linha | UsodaAPIdoSIU.md}
 * @param {Number} codItinerario 
 * @returns Localização de todos os veículos que estão em rota fazendo o itinerario
 */
async function getVeiculosMapa(codItinerario) {
  // http://mobile-l.sitbus.com.br:6060/siumobile-ws-v01/rest/ws/retornaVeiculosMapa/$codItinerario/0/retornoJSONVeiculos
  try {
    const apiRes = await jsonpbh(`${apiBaseUrl}/retornaVeiculosMapa/${codItinerario}/0`) // /retornoJSONItinerario
    console.debug(apiRes)
    const { mensagem, veiculos, sucesso } = apiRes
    return {
      mensagem,
      veiculos,
      sucesso
    }
  } catch (error) {
    console.error(error)
    throw error
  }
}

export default {
  getLinhas,
  getParadasProximas,
  getDadosParada,
  getPrevisoesParada,
  getParadasPorLinha,
  getItinerario,
  getVeiculosMapa
}
