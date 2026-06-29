/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MONTEVIDEO_TRANSPORT_CONFIGURED?: boolean
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

interface Window {
  readonly __RIA_CONFIG__?: {
    readonly montevideoTransportConfigured?: boolean
  }
}
