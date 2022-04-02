import { routes } from "../../../api-src/siumobile-client";

export default async function handler(request, response) {
  const { method } = request;
  if (method !== "GET") {
    response.status(405).end();
    return;
  }

  try {
    const res = await routes.getLinhas();
    response.status(200).json(res);
  } catch (error) {
    console.error(error);
    // TODO: Aqui posso retornar 500, 502, 504
    response.status(500).json({
      error: {
        code: 500,
        message: "Erro interno",
        details: ["Erro interno"]
      }
    });
  }
}
