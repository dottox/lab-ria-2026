import { createReadStream } from 'node:fs'
import { readFile, stat } from 'node:fs/promises'
import { createServer } from 'node:http'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DIST_DIR = path.join(__dirname, 'dist')
const TRANSPORT_API_BASE = 'https://api.montevideo.gub.uy/api/transportepublico'
const TRANSPORT_AUTH_URL =
  'https://mvdapi-auth.montevideo.gub.uy/auth/realms/pci/protocol/openid-connect/token'
const TOKEN_EXPIRY_BUFFER_MS = 30_000
const TRANSPORT_PROXY_PREFIX = '/api/montevideo-transport'

const MIME_TYPES = {
  '.avif': 'image/avif',
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ttf': 'font/ttf',
  '.txt': 'text/plain; charset=utf-8',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
}

// ponytail: single-process token cache; with many replicas, each replica refreshes its own token.
let tokenCache = null

export const isTransportConfigured = (env = process.env) => {
  return Boolean(
    env.MONTEVIDEO_TRANSPORT_CLIENT_ID?.trim() &&
      env.MONTEVIDEO_TRANSPORT_CLIENT_SECRET?.trim(),
  )
}

export const createRuntimeConfigScript = (env = process.env) => {
  return `<script>window.__RIA_CONFIG__=${JSON.stringify({
    montevideoTransportConfigured: isTransportConfigured(env),
  })};</script>`
}

export const getStaticRequestPath = (pathname) => {
  let decodedPath

  try {
    decodedPath = decodeURIComponent(pathname)
  } catch {
    return null
  }

  if (decodedPath.includes('\0')) {
    return null
  }

  const hasParentTraversal = decodedPath
    .split(/[\\/]/)
    .some((segment) => segment === '..')

  if (hasParentTraversal) {
    return null
  }

  const normalizedPath = path.posix.normalize(decodedPath)

  return normalizedPath === '/' ? '/index.html' : normalizedPath
}

const getAccessToken = async () => {
  if (!isTransportConfigured()) {
    throw new Error('Faltan las credenciales de Montevideo API en el entorno.')
  }

  if (tokenCache && tokenCache.expiresAt > Date.now() + TOKEN_EXPIRY_BUFFER_MS) {
    return tokenCache.accessToken
  }

  const body = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: process.env.MONTEVIDEO_TRANSPORT_CLIENT_ID.trim(),
    client_secret: process.env.MONTEVIDEO_TRANSPORT_CLIENT_SECRET.trim(),
  })

  const response = await fetch(TRANSPORT_AUTH_URL, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body.toString(),
  })

  if (!response.ok) {
    throw new Error(`No se pudo obtener el token OAuth de Montevideo API (${response.status}).`)
  }

  const data = await response.json()

  if (!data.access_token) {
    throw new Error('Montevideo API no devolvio un access token utilizable.')
  }

  tokenCache = {
    accessToken: data.access_token,
    expiresAt: Date.now() + Number(data.expires_in ?? 300) * 1000,
  }

  return tokenCache.accessToken
}

const respondJson = (res, statusCode, body) => {
  const json = JSON.stringify(body)

  res.writeHead(statusCode, {
    'Cache-Control': 'no-store',
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(json),
  })
  res.end(json)
}

const proxyTransportRequest = async (req, res, requestUrl) => {
  if (requestUrl.pathname === `${TRANSPORT_PROXY_PREFIX}/status`) {
    respondJson(res, 200, { configured: isTransportConfigured() })
    return
  }

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, {
      Allow: 'GET, HEAD',
      'Cache-Control': 'no-store',
      'Content-Length': 0,
    })
    res.end()
    return
  }

  if (!isTransportConfigured()) {
    respondJson(res, 503, {
      message: 'El proxy de transporte no tiene credenciales configuradas.',
    })
    return
  }

  const endpointPath = requestUrl.pathname.slice(TRANSPORT_PROXY_PREFIX.length) || '/'
  const targetUrl = new URL(`${TRANSPORT_API_BASE}${endpointPath}`)
  targetUrl.search = requestUrl.search

  try {
    let upstreamResponse = await fetchTransport(targetUrl, req.method)

    if (upstreamResponse.status === 401 || upstreamResponse.status === 403) {
      tokenCache = null
      upstreamResponse = await fetchTransport(targetUrl, req.method)
    }

    const responseBody = Buffer.from(await upstreamResponse.arrayBuffer())

    res.writeHead(upstreamResponse.status, {
      'Cache-Control': 'no-store',
      'Content-Type': upstreamResponse.headers.get('content-type') ?? 'application/json; charset=utf-8',
      'Content-Length': responseBody.length,
    })
    res.end(req.method === 'HEAD' ? undefined : responseBody)
  } catch (error) {
    respondJson(res, 500, {
      message: error instanceof Error ? error.message : 'Fallo el proxy de Montevideo Transport.',
    })
  }
}

const fetchTransport = async (targetUrl, method) => {
  const accessToken = await getAccessToken()

  return fetch(targetUrl, {
    method,
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  })
}

const serveStatic = async (req, res, requestUrl) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, {
      Allow: 'GET, HEAD',
      'Cache-Control': 'no-store',
      'Content-Length': 0,
    })
    res.end()
    return
  }

  const staticPath = getStaticRequestPath(requestUrl.pathname)

  if (!staticPath) {
    respondJson(res, 400, { message: 'Ruta invalida.' })
    return
  }

  let filePath = path.join(DIST_DIR, staticPath)
  let fileStat = await getFileStat(filePath)

  if (!fileStat && !path.extname(staticPath)) {
    filePath = path.join(DIST_DIR, 'index.html')
    fileStat = await getFileStat(filePath)
  }

  if (!fileStat) {
    respondJson(res, 404, { message: 'Recurso no encontrado.' })
    return
  }

  if (fileStat.isDirectory()) {
    filePath = path.join(filePath, 'index.html')
    fileStat = await getFileStat(filePath)
  }

  if (!fileStat?.isFile()) {
    respondJson(res, 404, { message: 'Recurso no encontrado.' })
    return
  }

  const extension = path.extname(filePath)

  if (extension === '.html') {
    const html = await readFile(filePath, 'utf8')
    const body = injectRuntimeConfig(html)

    res.writeHead(200, {
      'Cache-Control': 'no-store',
      'Content-Type': MIME_TYPES['.html'],
      'Content-Length': Buffer.byteLength(body),
    })
    res.end(req.method === 'HEAD' ? undefined : body)
    return
  }

  res.writeHead(200, {
    'Cache-Control': staticPath.startsWith('/assets/')
      ? 'public, max-age=31536000, immutable'
      : 'public, max-age=3600',
    'Content-Type': MIME_TYPES[extension] ?? 'application/octet-stream',
    'Content-Length': fileStat.size,
  })

  if (req.method === 'HEAD') {
    res.end()
    return
  }

  createReadStream(filePath).pipe(res)
}

const getFileStat = async (filePath) => {
  try {
    return await stat(filePath)
  } catch {
    return null
  }
}

const injectRuntimeConfig = (html) => {
  const runtimeConfig = createRuntimeConfigScript()

  return html.includes('</head>')
    ? html.replace('</head>', `${runtimeConfig}\n</head>`)
    : `${runtimeConfig}\n${html}`
}

export const createAppServer = () => {
  return createServer((req, res) => {
    const requestUrl = new URL(req.url ?? '/', 'http://localhost')

    if (requestUrl.pathname.startsWith(TRANSPORT_PROXY_PREFIX)) {
      void proxyTransportRequest(req, res, requestUrl)
      return
    }

    void serveStatic(req, res, requestUrl)
  })
}

const startServer = () => {
  const configuredPort = Number.parseInt(process.env.PORT ?? '8080', 10)
  const port = Number.isInteger(configuredPort) ? configuredPort : 8080
  const host = process.env.HOST || '0.0.0.0'
  const server = createAppServer()

  server.listen(port, host, () => {
    console.log(`RIA app listening on http://${host}:${port}`)
  })
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  startServer()
}
