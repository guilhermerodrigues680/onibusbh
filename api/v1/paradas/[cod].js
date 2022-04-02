import errors from "../../../api-src/errors";
import { routes } from "../../../api-src/siumobile-client";
import { isNumeric, getErrResObj } from "../_utils";

export default async function handler(request, response) {
  const { method } = request;
  if (method !== "GET") {
    response.status(405).end();
    return;
  }

  const { cod } = request.query;
  if (!isNumeric(cod) || +cod < 0) {
    response
      .status(400)
      .json(
        getErrResObj(
          400,
          "bad request",
          "o código da parada é inválido.",
          "o código da parada é um valor númerico maior ou igual a zero.",
          `cod=${cod}`,
          "parâmetro inválido."
        )
      );
    return;
  }

  try {
    const res = await routes.getParada(+cod);
    response.status(200).json(res);
  } catch (error) {
    console.error(error);
    switch (true) {
      case error instanceof errors.NotFoundError:
        response.status(404).json(getErrResObj(404, "not found", error.message));
        return;
      case error instanceof errors.BadGatewayError:
        response.status(502).json(getErrResObj(502, "bad gateway", error.message));
        return;
      case error instanceof errors.InternalServerError:
      default:
        response.status(500).json(getErrResObj(500, "internal server error", "Erro interno"));
        break;
    }
  }
}
