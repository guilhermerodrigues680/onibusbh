import { routes } from "../../api-src/siumobile-client";
import { isNumeric, getErrResObj } from "./_utils";

export default async function handler(request, response) {
  const { method } = request;
  if (method !== "GET") {
    response.status(405).end();
    return;
  }

  const { lat, lng } = request.query;
  if (!lat || !lng) {
    response
      .status(400)
      .json(
        getErrResObj(
          400,
          "bad request",
          "latitude e/ou longitude são obrigatórios.",
          "latitude e/ou longitude não informados.",
          `lat=${lat}, lng=${lng}`,
          "parâmentros inválidos."
        )
      );
    return;
  }

  if (!isNumeric(lat) || !isNumeric(lng)) {
    response
      .status(400)
      .json(
        getErrResObj(
          400,
          "bad request",
          "latitude e/ou longitude precisam ser valores númericos.",
          "latitude e/ou longitude não são valores númericos.",
          `lat=${lat}, lng=${lng}`,
          "parâmentros inválidos."
        )
      );
    return;
  }

  try {
    const res = await routes.getParadasProximas(+lat, +lng);
    response.status(200).json(res);
  } catch (error) {
    console.error(error);
    // TODO: Aqui posso retornar 500, 502, 504
    response
      .status(500)
      .json(getErrResObj(500, "internal server error", "Erro interno", "Erro interno"));
  }
}
