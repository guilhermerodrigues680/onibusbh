import { getErrResObj } from "./_utils";

export default async function handler(request, response) {
  response
    .status(404)
    .json(
      getErrResObj(
        404,
        "not found",
        "Ônibus BH API Gateway v1 - essa rota não foi encontrada",
        `rota '${request.url}' não encontrada`
      )
    );
}
