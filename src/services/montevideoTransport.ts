import type { EventLocation } from '@/data/events'

const TRANSPORT_API_BASE = '/api/montevideo-transport'
const BUS_STOP_SEARCH_LIMIT = 4
const BUS_STOP_SEARCH_RADIUS_METERS = 2200
const DIRECT_BUS_CACHE_TTL_MS = 10 * 60 * 1000

export interface BusStop {
  busstopId: number
  street1: string
  street2: string
  street1Id?: number
  street2Id?: number
  location: EventLocation
}

export interface BusLine {
  line: string
  lineId: string
}

export interface UpcomingBus {
  line: string
  lineId: string
  origin?: string
  destination?: string
  subline?: string
  lineVariantId?: number | string
  nextArrivalMinutes: number | null
  nextArrivalLabel: string
}

export interface BusRecommendation {
  line: string
  lineId: string
  originStop: BusStop
  destinationStop: BusStop
  originWalkMeters: number
  destinationWalkMeters: number
  totalWalkMeters: number
  nextArrivalMinutes: number | null
  nextArrivalLabel: string
  score: number
}

class TransportApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'TransportApiError'
    this.status = status
  }
}

interface RawBusStop {
  busstopId?: number
  street1?: string
  street2?: string
  street1Id?: number
  street2Id?: number
  location?: {
    coordinates?: [number, number]
  }
}

interface RawBus {
  line?: string
  lineVariantId?: string | number
}

interface RouteCandidate {
  line: BusLine
  originStop: BusStop
  destinationStop: BusStop
  originWalkMeters: number
  destinationWalkMeters: number
}

interface NearbyStopCandidate {
  stop: BusStop
  distanceMeters: number
}

let busStopsCache: BusStop[] | null = null
const stopLinesCache = new Map<number, BusLine[]>()
const nearestOriginStopsCache = new Map<string, NearbyStopCandidate[]>()
const bestDirectBusCache = new Map<
  string,
  {
    expiresAt: number
    recommendations: BusRecommendation[]
  }
>()

const toLineKey = (line: Pick<BusLine, 'line' | 'lineId'>) => {
  return `${line.lineId || line.line}::${line.line}`
}

const toLocationCacheKey = (location: EventLocation) => {
  return `${location.lat.toFixed(4)},${location.lng.toFixed(4)}`
}

const toDirectBusCacheKey = (userLocation: EventLocation, destinationLocation: EventLocation) => {
  return `${toLocationCacheKey(userLocation)}->${toLocationCacheKey(destinationLocation)}`
}

const dedupeByKey = <T>(items: T[], getKey: (item: T) => string) => {
  const seen = new Set<string>()

  return items.filter((item) => {
    const key = getKey(item)
    if (seen.has(key)) {
      return false
    }

    seen.add(key)
    return true
  })
}

const mapSequential = async <T, R>(items: T[], mapper: (item: T) => Promise<R>) => {
  const results: R[] = []

  for (const item of items) {
    results.push(await mapper(item))
  }

  return results
}

const parseMeters = (value: number) => {
  return Number.isFinite(value) ? Math.round(value) : 0
}

const toRadians = (value: number) => (value * Math.PI) / 180

export const formatStopName = (stop: BusStop) => {
  return `${stop.street1} & ${stop.street2}`
}

export const hasTransportCredentials = () => {
  return Boolean(
    window.__RIA_CONFIG__?.montevideoTransportConfigured ??
      import.meta.env.VITE_MONTEVIDEO_TRANSPORT_CONFIGURED,
  )
}

export const calculateDistanceMeters = (from: EventLocation, to: EventLocation) => {
  const earthRadiusMeters = 6371000
  const latDelta = toRadians(to.lat - from.lat)
  const lngDelta = toRadians(to.lng - from.lng)
  const a =
    Math.sin(latDelta / 2) ** 2 +
    Math.cos(toRadians(from.lat)) *
      Math.cos(toRadians(to.lat)) *
      Math.sin(lngDelta / 2) ** 2

  return earthRadiusMeters * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

const parseArrivalMinutes = (record: Record<string, unknown>) => {
  const fields = [
    { key: 'minutesToArrival', seconds: false },
    { key: 'etaMinutes', seconds: false },
    { key: 'minutes', seconds: false },
    { key: 'remainingMinutes', seconds: false },
    { key: 'timeLeft', seconds: false },
    { key: 'eta', seconds: false },
    { key: 'secondsToArrival', seconds: true },
    { key: 'remainingSeconds', seconds: true },
  ] as const

  for (const field of fields) {
    const rawValue = record[field.key]

    if (typeof rawValue === 'number' && Number.isFinite(rawValue)) {
      return field.seconds ? Math.max(0, Math.round(rawValue / 60)) : Math.max(0, Math.round(rawValue))
    }

    if (typeof rawValue === 'string') {
      const numericValue = Number.parseFloat(rawValue)

      if (!Number.isNaN(numericValue)) {
        return field.seconds ? Math.max(0, Math.round(numericValue / 60)) : Math.max(0, Math.round(numericValue))
      }

      const digitMatch = rawValue.match(/(\d+)/)
      if (digitMatch) {
        return Math.max(0, Number.parseInt(digitMatch[1], 10))
      }
    }
  }

  return null
}

const formatArrivalLabel = (record: Record<string, unknown>, arrivalMinutes: number | null) => {
  if (arrivalMinutes !== null) {
    return arrivalMinutes === 0 ? 'Llega ahora' : `${arrivalMinutes} min`
  }

  const textFallbacks = [
    record.nextArrivalLabel,
    record.estimatedArrival,
    record.arrivalEstimate,
    record.arrivalTime,
    record.etaText,
  ]

  const firstText = textFallbacks.find((value) => typeof value === 'string' && value.trim().length > 0)

  return typeof firstText === 'string' ? firstText : 'Arribo en tiempo real no disponible'
}

const normalizeBusStop = (item: RawBusStop): BusStop | null => {
  if (
    typeof item.busstopId !== 'number' ||
    !item.location?.coordinates ||
    item.location.coordinates.length < 2
  ) {
    return null
  }

  const [lng, lat] = item.location.coordinates

  return {
    busstopId: item.busstopId,
    street1: item.street1 ?? 'Calle desconocida',
    street2: item.street2 ?? 'Esquina desconocida',
    street1Id: item.street1Id,
    street2Id: item.street2Id,
    location: {
      lat,
      lng,
    },
  }
}

const normalizeBusLineFromBus = (item: RawBus): BusLine | null => {
  if (!item.line) {
    return null
  }

  return {
    line: item.line,
    lineId:
      typeof item.lineVariantId === 'string' || typeof item.lineVariantId === 'number'
        ? String(item.lineVariantId)
        : item.line,
  }
}

const normalizeUpcomingBus = (item: unknown): UpcomingBus | null => {
  if (!item || typeof item !== 'object') {
    return null
  }

  const record = item as Record<string, unknown>
  const line = typeof record.line === 'string' ? record.line : null
  const lineId =
    typeof record.lineId === 'string'
      ? record.lineId
      : typeof record.line === 'string'
        ? record.line
        : null

  if (!line || !lineId) {
    return null
  }

  const nextArrivalMinutes = parseArrivalMinutes(record)

  return {
    line,
    lineId,
    origin: typeof record.origin === 'string' ? record.origin : undefined,
    destination: typeof record.destination === 'string' ? record.destination : undefined,
    subline: typeof record.subline === 'string' ? record.subline : undefined,
    lineVariantId:
      typeof record.lineVariantId === 'number' || typeof record.lineVariantId === 'string'
        ? record.lineVariantId
        : undefined,
    nextArrivalMinutes,
    nextArrivalLabel: formatArrivalLabel(record, nextArrivalMinutes),
  }
}

const requestTransport = async <T>(endpoint: string, searchParams?: URLSearchParams) => {
  const url = new URL(`${TRANSPORT_API_BASE}${endpoint}`, window.location.origin)
  if (searchParams) {
    url.search = searchParams.toString()
  }

  const response = await fetch(url.toString(), {
    headers: {
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    let errorMessage = `La solicitud a Montevideo API fallo con estado ${response.status}.`
    const responseBody = await response.text()

    if (responseBody) {
      try {
        const errorData = JSON.parse(responseBody) as { message?: string }
        if (errorData.message) {
          errorMessage = errorData.message
        } else {
          errorMessage = responseBody
        }
      } catch {
        errorMessage = responseBody
      }
    }

    if (response.status === 429) {
      errorMessage =
        'Montevideo API esta recibiendo demasiadas consultas en este momento. Espera unos segundos e intenta de nuevo.'
    }

    throw new TransportApiError(response.status, errorMessage)
  }

  return response.json() as Promise<T>
}

export const fetchBusStops = async () => {
  if (busStopsCache) {
    return busStopsCache
  }

  const data = await requestTransport<RawBusStop[]>('/buses/busstops')
  const normalized = data
    .map((item) => normalizeBusStop(item))
    .filter((item): item is BusStop => item !== null)

  busStopsCache = normalized
  return normalized
}

export const fetchStopLines = async (busstopId: number) => {
  const cached = stopLinesCache.get(busstopId)
  if (cached) {
    return cached
  }

  const searchParams = new URLSearchParams({
    busstopId: String(busstopId),
  })

  let data: RawBus[]

  try {
    data = await requestTransport<RawBus[]>('/buses', searchParams)
  } catch (error) {
    if (error instanceof TransportApiError && error.status === 400) {
      stopLinesCache.set(busstopId, [])
      return []
    }

    throw error
  }

  const normalized = dedupeByKey(
    data
      .map((item) => normalizeBusLineFromBus(item))
      .filter((item): item is BusLine => item !== null),
    (line) => toLineKey(line),
  )

  stopLinesCache.set(busstopId, normalized)
  return normalized
}

export const fetchUpcomingBuses = async (busstopId: number, lines: string[]) => {
  if (lines.length === 0) {
    return []
  }

  const searchParams = new URLSearchParams({
    lines: lines.join(','),
    amountperline: '2',
  })

  const data = await requestTransport<unknown[]>(`/buses/busstops/${busstopId}/upcomingbuses`, searchParams)

  return data
    .map((item) => normalizeUpcomingBus(item))
    .filter((item): item is UpcomingBus => item !== null)
}

export const getNearestStops = (
  stops: BusStop[],
  target: EventLocation,
  limit = BUS_STOP_SEARCH_LIMIT,
  maxDistanceMeters = BUS_STOP_SEARCH_RADIUS_METERS,
) => {
  return stops
    .map((stop) => ({
      stop,
      distanceMeters: calculateDistanceMeters(target, stop.location),
    }))
    .filter((candidate) => candidate.distanceMeters <= maxDistanceMeters)
    .sort((a, b) => a.distanceMeters - b.distanceMeters)
    .slice(0, limit)
}

const getCachedNearestOriginStops = (stops: BusStop[], userLocation: EventLocation) => {
  const cacheKey = toLocationCacheKey(userLocation)
  const cached = nearestOriginStopsCache.get(cacheKey)

  if (cached) {
    return cached
  }

  const nearestStops = getNearestStops(stops, userLocation)
  nearestOriginStopsCache.set(cacheKey, nearestStops)
  return nearestStops
}

const rankRouteCandidates = async (candidates: RouteCandidate[]) => {
  const linesByStop = new Map<number, string[]>()

  for (const candidate of candidates) {
    const existing = linesByStop.get(candidate.originStop.busstopId) ?? []
    if (!existing.includes(candidate.line.line)) {
      existing.push(candidate.line.line)
    }
    linesByStop.set(candidate.originStop.busstopId, existing)
  }

  const arrivalsByStop = new Map<number, UpcomingBus[]>()

  await Promise.all(
    Array.from(linesByStop.entries()).map(async ([busstopId, lines]) => {
      const arrivals = await fetchUpcomingBuses(busstopId, lines)
      arrivalsByStop.set(busstopId, arrivals)
    }),
  )

  const enriched = candidates.map<BusRecommendation>((candidate) => {
    const arrivals = arrivalsByStop.get(candidate.originStop.busstopId) ?? []
    const bestArrival =
      arrivals
        .filter((arrival) => toLineKey(arrival) === toLineKey(candidate.line))
        .sort((a, b) => {
          const left = a.nextArrivalMinutes ?? Number.POSITIVE_INFINITY
          const right = b.nextArrivalMinutes ?? Number.POSITIVE_INFINITY
          return left - right
        })[0] ?? null

    const nextArrivalMinutes = bestArrival?.nextArrivalMinutes ?? null
    const totalWalkMeters = parseMeters(candidate.originWalkMeters + candidate.destinationWalkMeters)
    const waitPenalty = nextArrivalMinutes ?? 999

    return {
      line: candidate.line.line,
      lineId: candidate.line.lineId,
      originStop: candidate.originStop,
      destinationStop: candidate.destinationStop,
      originWalkMeters: parseMeters(candidate.originWalkMeters),
      destinationWalkMeters: parseMeters(candidate.destinationWalkMeters),
      totalWalkMeters,
      nextArrivalMinutes,
      nextArrivalLabel: bestArrival?.nextArrivalLabel ?? 'Arribo en tiempo real no disponible',
      score: totalWalkMeters * 1000 + waitPenalty,
    }
  })

  return enriched.sort((a, b) => {
    if (a.totalWalkMeters !== b.totalWalkMeters) {
      return a.totalWalkMeters - b.totalWalkMeters
    }

    const leftWait = a.nextArrivalMinutes ?? Number.POSITIVE_INFINITY
    const rightWait = b.nextArrivalMinutes ?? Number.POSITIVE_INFINITY
    if (leftWait !== rightWait) {
      return leftWait - rightWait
    }

    return a.line.localeCompare(b.line)
  })
}

export const findBestDirectBusOptions = async (
  userLocation: EventLocation,
  destinationLocation: EventLocation,
) => {
  const directBusCacheKey = toDirectBusCacheKey(userLocation, destinationLocation)
  const cachedRecommendations = bestDirectBusCache.get(directBusCacheKey)

  if (cachedRecommendations && cachedRecommendations.expiresAt > Date.now()) {
    return cachedRecommendations.recommendations
  }

  const stops = await fetchBusStops()
  const nearestOriginStops = getCachedNearestOriginStops(stops, userLocation)
  const nearestDestinationStops = getNearestStops(stops, destinationLocation)

  if (nearestOriginStops.length === 0) {
    throw new Error('No se encontraron paradas cercanas a tu ubicacion actual.')
  }

  if (nearestDestinationStops.length === 0) {
    throw new Error('No se encontraron paradas cercanas a este evento.')
  }

  let originStopLines: {
    stop: BusStop
    distanceMeters: number
    lines: BusLine[]
  }[]
  let destinationStopLines: {
    stop: BusStop
    distanceMeters: number
    lines: BusLine[]
  }[]

  try {
    ;[originStopLines, destinationStopLines] = await Promise.all([
      mapSequential(nearestOriginStops, async ({ stop, distanceMeters }) => ({
        stop,
        distanceMeters,
        lines: await fetchStopLines(stop.busstopId),
      })),
      mapSequential(nearestDestinationStops, async ({ stop, distanceMeters }) => ({
        stop,
        distanceMeters,
        lines: await fetchStopLines(stop.busstopId),
      })),
    ])
  } catch (error) {
    if (error instanceof TransportApiError && error.status === 429) {
      throw new Error('Montevideo API esta limitando temporalmente las consultas. Espera unos segundos e intenta de nuevo.')
    }

    throw error
  }

  originStopLines = originStopLines.filter((candidate) => candidate.lines.length > 0)
  destinationStopLines = destinationStopLines.filter((candidate) => candidate.lines.length > 0)

  if (originStopLines.length === 0 || destinationStopLines.length === 0) {
    throw new Error('No pudimos obtener lineas validas para las paradas cercanas. Intenta de nuevo en unos segundos.')
  }

  const destinationLinesByKey = new Map<string, { stop: BusStop; distanceMeters: number; line: BusLine }[]>()

  for (const destination of destinationStopLines) {
    for (const line of destination.lines) {
      const key = toLineKey(line)
      const existing = destinationLinesByKey.get(key) ?? []
      existing.push({
        stop: destination.stop,
        distanceMeters: destination.distanceMeters,
        line,
      })
      destinationLinesByKey.set(key, existing)
    }
  }

  const routeCandidates: RouteCandidate[] = []

  for (const origin of originStopLines) {
    for (const line of origin.lines) {
      const destinationsForLine = destinationLinesByKey.get(toLineKey(line))
      if (!destinationsForLine) {
        continue
      }

      for (const destination of destinationsForLine) {
        routeCandidates.push({
          line,
          originStop: origin.stop,
          destinationStop: destination.stop,
          originWalkMeters: origin.distanceMeters,
          destinationWalkMeters: destination.distanceMeters,
        })
      }
    }
  }

  if (routeCandidates.length === 0) {
    throw new Error('No se encontro una linea directa entre tu zona y este evento.')
  }

  const uniqueCandidates = dedupeByKey(
    routeCandidates.sort((a, b) => {
      const totalA = a.originWalkMeters + a.destinationWalkMeters
      const totalB = b.originWalkMeters + b.destinationWalkMeters
      return totalA - totalB
    }),
    (candidate) =>
      `${candidate.originStop.busstopId}:${candidate.destinationStop.busstopId}:${toLineKey(candidate.line)}`,
  )

  let rankedCandidates: BusRecommendation[]

  try {
    rankedCandidates = await rankRouteCandidates(uniqueCandidates.slice(0, 8))
  } catch (error) {
    if (error instanceof TransportApiError && error.status === 429) {
      throw new Error('Montevideo API esta limitando temporalmente las consultas de arribo. Espera unos segundos e intenta de nuevo.')
    }

    throw error
  }

  const recommendations = rankedCandidates.slice(0, 3)
  bestDirectBusCache.set(directBusCacheKey, {
    expiresAt: Date.now() + DIRECT_BUS_CACHE_TTL_MS,
    recommendations,
  })

  return recommendations
}
