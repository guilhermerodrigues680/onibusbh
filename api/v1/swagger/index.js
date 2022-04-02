// https://github.com/swagger-api/swagger-ui/tree/v4.10.3/dist
// https://vercel.com/support/articles/how-can-i-use-files-in-serverless-functions

const { readFileSync } = require('fs')
const { join } = require('path')
const file = readFileSync(join(__dirname, '_files', 'swagger.yaml'), 'utf8')

export default function handler(req, res) {
  // https://vercel.com/docs/concepts/edge-network/caching
  res.setHeader('Cache-Control',  's-maxage=60' );
  res.setHeader('Content-type',  'text/yaml' );
  res.end(file);
}
