import { computed, onMounted, ref } from 'vue'
import { getHomicidesStats, type HomicidesResponse } from '@/services/homicidesService'

const HOMICIDES_CACHE_KEY = 'ria:homicides:mock'

interface HomicidesCachePayload {
  data: HomicidesResponse
  cachedAt: string
}

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : 'No se pudieron cargar los datos de homicidios.'

const readHomicidesCache = (): HomicidesCachePayload | null => {
  if (typeof window === 'undefined') {
    return null
  }

  const rawCache = window.localStorage.getItem(HOMICIDES_CACHE_KEY)

  if (!rawCache) {
    return null
  }

  try {
    return JSON.parse(rawCache) as HomicidesCachePayload
  } catch {
    window.localStorage.removeItem(HOMICIDES_CACHE_KEY)
    return null
  }
}

const writeHomicidesCache = (payload: HomicidesCachePayload) => {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(HOMICIDES_CACHE_KEY, JSON.stringify(payload))
}

export function useHomicides() {
  const data = ref<HomicidesResponse | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const cachedAt = ref<string | null>(null)
  const fromCache = ref(false)

  const hasData = computed(() => data.value !== null)

  const loadHomicides = async () => {
    loading.value = true
    error.value = null
    fromCache.value = false

    try {
      const response = await getHomicidesStats()
      const cacheTimestamp = new Date().toISOString()

      data.value = response
      cachedAt.value = cacheTimestamp
      writeHomicidesCache({
        data: response,
        cachedAt: cacheTimestamp,
      })
    } catch (requestError) {
      const cachedPayload = readHomicidesCache()

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
    void loadHomicides()
  })

  return {
    data,
    loading,
    error,
    cachedAt,
    fromCache,
    hasData,
    loadHomicides,
  }
}
