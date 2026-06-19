import { computed, onMounted, ref } from 'vue'
import { getCurrencyRates, type CurrencyResponse } from '@/services/currencyService'

const CURRENCY_CACHE_KEY = 'ria:currency:mock'

interface CurrencyCachePayload {
  data: CurrencyResponse
  cachedAt: string
}

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : 'No se pudieron cargar las cotizaciones.'

const readCurrencyCache = (): CurrencyCachePayload | null => {
  if (typeof window === 'undefined') {
    return null
  }

  const rawCache = window.localStorage.getItem(CURRENCY_CACHE_KEY)

  if (!rawCache) {
    return null
  }

  try {
    return JSON.parse(rawCache) as CurrencyCachePayload
  } catch {
    window.localStorage.removeItem(CURRENCY_CACHE_KEY)
    return null
  }
}

const writeCurrencyCache = (payload: CurrencyCachePayload) => {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(CURRENCY_CACHE_KEY, JSON.stringify(payload))
}

export function useCurrency() {
  const data = ref<CurrencyResponse | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const cachedAt = ref<string | null>(null)
  const fromCache = ref(false)

  const hasData = computed(() => data.value !== null)

  const loadCurrency = async () => {
    loading.value = true
    error.value = null
    fromCache.value = false

    try {
      const response = await getCurrencyRates()
      const cacheTimestamp = new Date().toISOString()

      data.value = response
      cachedAt.value = cacheTimestamp
      writeCurrencyCache({
        data: response,
        cachedAt: cacheTimestamp,
      })
    } catch (requestError) {
      const cachedPayload = readCurrencyCache()

      if (cachedPayload) {
        data.value = cachedPayload.data
        cachedAt.value = cachedPayload.cachedAt
        fromCache.value = true
        error.value = `${getErrorMessage(requestError)} Se muestran los últimos datos guardados.`
      } else {
        data.value = null
        cachedAt.value = null
        error.value = getErrorMessage(requestError)
      }
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    void loadCurrency()
  })

  return {
    data,
    loading,
    error,
    cachedAt,
    fromCache,
    hasData,
    loadCurrency,
  }
}
