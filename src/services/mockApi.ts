interface SimulateApiOptions {
  delayMs?: number
  shouldFail?: boolean
  errorMessage?: string
}

const clonePayload = <T>(payload: T): T => {
  if (typeof structuredClone === 'function') {
    return structuredClone(payload)
  }

  return JSON.parse(JSON.stringify(payload)) as T
}

export function simulateApiCall<T>(
  payload: T,
  {
    delayMs = 600,
    shouldFail = false,
    errorMessage = 'Error simulado al consultar el servicio.',
  }: SimulateApiOptions = {},
): Promise<T> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) {
        reject(new Error(errorMessage))
        return
      }

      resolve(clonePayload(payload))
    }, delayMs)
  })
}
