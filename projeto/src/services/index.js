import { jsonpbh } from "./jsonp.js";

async function getLinhas() {
  try {
    const apiRes = await jsonpbh('http://mobile-l.sitbus.com.br:6060/siumobile-ws-v01/rest/ws/buscarLinhas') // /retornoJSONListaLinhas
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

export default { getLinhas }
