export default function handler(request, response) {
  const {method} = request

  switch (method) {
    case "GET":
      break;
    case "HEAD":
      break;
    case "OPTIONS":
      response.setHeader('Allow', "GET,HEAD,OPTIONS" );
      return;
    default:
      response.status(405).end();
      return;
  }

  const d = {
    method,
    request: Object.keys(request),
    body: request.body,
    query: request.query,
    cookies: request.cookies,
  };

  if (method === "HEAD") {
    response.setHeader("content-length", JSON.stringify(d).length);
    response.status(200).end();
  } else {
    response.status(200).json(d);
  }
}
