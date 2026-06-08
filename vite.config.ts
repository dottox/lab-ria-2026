import path from 'path'
import { defineConfig, loadEnv, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'

const TRANSPORT_API_BASE = 'https://api.montevideo.gub.uy/api/transportepublico'
const TRANSPORT_AUTH_URL =
  'https://mvdapi-auth.montevideo.gub.uy/auth/realms/pci/protocol/openid-connect/token'
const TOKEN_EXPIRY_BUFFER_MS = 30_000

const createMontevideoTransportDevProxy = (mode: string): Plugin => {
  const env = loadEnv(mode, process.cwd(), '')
  const clientId = env.MONTEVIDEO_TRANSPORT_CLIENT_ID?.trim() ?? ''
  const clientSecret = env.MONTEVIDEO_TRANSPORT_CLIENT_SECRET?.trim() ?? ''
  const credentialsConfigured = Boolean(clientId && clientSecret)
  let tokenCache: { accessToken: string; expiresAt: number } | null = null

  const respondJson = (
    res: {
      statusCode: number
      setHeader: (name: string, value: string) => void
      end: (body: string) => void
    },
    statusCode: number,
    body: Record<string, unknown>,
  ) => {
    res.statusCode = statusCode
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify(body))
  }

  const getAccessToken = async () => {
    if (!credentialsConfigured) {
      throw new Error(
        'Faltan MONTEVIDEO_TRANSPORT_CLIENT_ID y MONTEVIDEO_TRANSPORT_CLIENT_SECRET en .env.local.',
      )
    }

    if (tokenCache && tokenCache.expiresAt > Date.now() + TOKEN_EXPIRY_BUFFER_MS) {
      return tokenCache.accessToken
    }

    const body = new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
    })

    const response = await fetch(TRANSPORT_AUTH_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
      body: body.toString(),
    })

    if (!response.ok) {
      throw new Error(`No se pudo obtener el token OAuth de Montevideo API (${response.status}).`)
    }

    const data = (await response.json()) as {
      access_token?: string
      expires_in?: number
    }

    if (!data.access_token) {
      throw new Error('Montevideo API no devolvio un access token utilizable.')
    }

    tokenCache = {
      accessToken: data.access_token,
      expiresAt: Date.now() + (data.expires_in ?? 300) * 1000,
    }

    return tokenCache.accessToken
  }

  return {
    name: 'montevideo-transport-dev-proxy',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const requestUrl = req.url ?? ''

        if (!requestUrl.startsWith('/api/montevideo-transport')) {
          next()
          return
        }

        const incomingUrl = new URL(requestUrl, 'http://localhost')

        if (incomingUrl.pathname === '/api/montevideo-transport/status') {
          respondJson(res, 200, {
            configured: credentialsConfigured,
          })
          return
        }

        const endpointPath = incomingUrl.pathname.replace('/api/montevideo-transport', '') || '/'

        try {
          const token = await getAccessToken()
          const targetUrl = new URL(`${TRANSPORT_API_BASE}${endpointPath}`)
          targetUrl.search = incomingUrl.search

          let upstreamResponse = await fetch(targetUrl, {
            method: req.method ?? 'GET',
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${token}`,
            },
          })

          if (upstreamResponse.status === 401 || upstreamResponse.status === 403) {
            tokenCache = null
            const refreshedToken = await getAccessToken()
            upstreamResponse = await fetch(targetUrl, {
              method: req.method ?? 'GET',
              headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${refreshedToken}`,
              },
            })
          }

          const responseText = await upstreamResponse.text()
          res.statusCode = upstreamResponse.status

          const contentType = upstreamResponse.headers.get('content-type')
          if (contentType) {
            res.setHeader('Content-Type', contentType)
          } else {
            res.setHeader('Content-Type', 'application/json')
          }

          res.end(responseText)
        } catch (error) {
          const message =
            error instanceof Error
              ? error.message
              : 'Fallo el proxy local de Montevideo Transport.'

          respondJson(res, 500, { message })
        }
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const credentialsConfigured = Boolean(
    env.MONTEVIDEO_TRANSPORT_CLIENT_ID?.trim() &&
      env.MONTEVIDEO_TRANSPORT_CLIENT_SECRET?.trim(),
  )

  return {
    define: {
      'import.meta.env.VITE_MONTEVIDEO_TRANSPORT_CONFIGURED': JSON.stringify(credentialsConfigured),
    },
    plugins: [vue(), createMontevideoTransportDevProxy(mode)],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      port: 3000,
      hmr: {
        overlay: false,
      },
    },
  }
})
