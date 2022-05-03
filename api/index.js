export default async function handler(request, response) {
  const { method } = request;
  if (method !== "GET") {
    response.status(405).end();
    return;
  }

  response
    .status(200)
    .send("Gui o Dev - Ônibus BH API Gateway | Visite /swagger para acessar a documentação.");
}
