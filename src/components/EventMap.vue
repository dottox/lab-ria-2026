<template>
  <div class="event-map-shell">
    <div
      ref="mapContainer"
      class="event-map"
      :class="{ 'event-map--loading': !isReady }"
      aria-label="Mapa interactivo con marcadores del evento y transporte"
    ></div>
    <div v-if="!isReady" class="event-map-skeleton" aria-hidden="true">
      <SkeletonBase height="100%" radius="0.75rem" variant="image" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { SkeletonBase } from '@/components/skeleton'
import L from 'leaflet'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import type { EventLocation } from '@/data/events'
import type { BusStop } from '@/services/montevideoTransport'
import { formatStopName } from '@/services/montevideoTransport'

const defaultIconPrototype = L.Icon.Default.prototype as typeof L.Icon.Default.prototype & {
  _getIconUrl?: unknown
}

delete defaultIconPrototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

const props = defineProps<{
  eventName: string
  eventLocation: EventLocation
  userLocation?: EventLocation | null
  originStop?: BusStop | null
  destinationStop?: BusStop | null
}>()

const mapContainer = ref<HTMLElement | null>(null)
const map = ref<L.Map | null>(null)
const markersLayer = ref<L.LayerGroup | null>(null)
const isReady = ref(false)
let tileLayer: L.GridLayer | null = null

const eventTargetIcon = L.divIcon({
  className: 'event-map__target-icon',
  html: '<span class="event-map__target-dot"></span>',
  iconSize: [30, 30],
  iconAnchor: [15, 15],
  popupAnchor: [0, -16],
})

const createTileUrl = (coords: L.Coords) => {
  const subdomains = ['a', 'b', 'c']
  const subdomain = subdomains[Math.abs(coords.x + coords.y) % subdomains.length]
  return `https://${subdomain}.tile.openstreetmap.org/${coords.z}/${coords.x}/${coords.y}.png`
}

const createBackgroundTileLayer = () => {
  const BackgroundTileLayer = L.GridLayer.extend({
    createTile(coords: L.Coords, done: L.DoneCallback) {
      const tile = document.createElement('div')
      const image = new Image()

      tile.className = 'event-map__tile'
      tile.style.backgroundPosition = 'center'
      tile.style.backgroundRepeat = 'no-repeat'
      tile.style.backgroundSize = '256px 256px'

      image.onload = () => {
        tile.style.backgroundImage = `url("${image.src}")`
        done(null, tile)
      }
      image.onerror = () => {
        done(new Error(`No se pudo cargar el tile ${image.src}`), tile)
      }
      image.src = createTileUrl(coords)

      return tile
    },
  })

  return new BackgroundTileLayer({
    attribution: '&copy; OpenStreetMap contributors',
    tileSize: 256,
  })
}

const renderMarkers = async () => {
  if (!map.value || !markersLayer.value) {
    return
  }

  markersLayer.value.clearLayers()

  const eventLatLng = L.latLng(props.eventLocation.lat, props.eventLocation.lng)
  const bounds = L.latLngBounds([eventLatLng, eventLatLng])
  const eventMarker = L.marker(eventLatLng, {
    icon: eventTargetIcon,
    zIndexOffset: 1000,
  })
    .bindPopup(`<strong>${props.eventName}</strong><br />Ubicacion del evento`)
    .addTo(markersLayer.value)
  bounds.extend(eventMarker.getLatLng())

  if (props.userLocation) {
    const userMarker = L.circleMarker([props.userLocation.lat, props.userLocation.lng], {
      radius: 9,
      color: '#0F172A',
      fillColor: '#10B981',
      fillOpacity: 0.95,
      weight: 2,
    })
      .bindPopup('Tu ubicacion')
      .addTo(markersLayer.value)
    bounds.extend(userMarker.getLatLng())
  }

  if (props.originStop) {
    const originMarker = L.circleMarker(
      [props.originStop.location.lat, props.originStop.location.lng],
      {
        radius: 8,
        color: '#92400E',
        fillColor: '#F59E0B',
        fillOpacity: 0.95,
        weight: 2,
      },
    )
      .bindPopup(`<strong>Subi aqui</strong><br />${formatStopName(props.originStop)}`)
      .addTo(markersLayer.value)
    bounds.extend(originMarker.getLatLng())
  }

  if (props.destinationStop) {
    const destinationMarker = L.circleMarker(
      [props.destinationStop.location.lat, props.destinationStop.location.lng],
      {
        radius: 8,
        color: '#7F1D1D',
        fillColor: '#EF4444',
        fillOpacity: 0.95,
        weight: 2,
      },
    )
      .bindPopup(`<strong>Bajate aqui</strong><br />${formatStopName(props.destinationStop)}`)
      .addTo(markersLayer.value)
    bounds.extend(destinationMarker.getLatLng())
  }

  if (bounds.isValid()) {
    map.value.fitBounds(bounds.pad(0.25), {
      maxZoom: 15,
    })
  } else {
    map.value.setView(eventLatLng, 14)
  }

  await nextTick()
  map.value.invalidateSize()
}

onMounted(() => {
  if (!mapContainer.value || map.value) {
    return
  }

  map.value = L.map(mapContainer.value, {
    zoomControl: true,
    scrollWheelZoom: false,
  })

  tileLayer = createBackgroundTileLayer()

  tileLayer.once('load tileerror', () => {
    isReady.value = true
  })

  tileLayer.addTo(map.value)

  markersLayer.value = L.layerGroup().addTo(map.value)
  void renderMarkers()
})

watch(
  () => [
    props.eventLocation.lat,
    props.eventLocation.lng,
    props.userLocation?.lat ?? null,
    props.userLocation?.lng ?? null,
    props.originStop?.busstopId ?? null,
    props.destinationStop?.busstopId ?? null,
    props.eventName,
  ],
  () => {
    void renderMarkers()
  },
)

onBeforeUnmount(() => {
  tileLayer = null
  map.value?.remove()
  map.value = null
  markersLayer.value = null
})
</script>

<style scoped>
.event-map {
  position: relative;
  width: 100%;
  min-height: 320px;
  border-radius: var(--radius-lg);
  overflow: hidden;
  border: 1px solid var(--color-border);
  background:
    linear-gradient(135deg, rgba(0, 80, 179, 0.08), rgba(0, 128, 128, 0.08)),
    var(--color-surface);
}

.event-map-shell {
  position: relative;
}

.event-map--loading {
  opacity: 0;
}

.event-map-skeleton {
  position: absolute;
  inset: 0;
  min-height: 320px;
}

.event-map :deep(.leaflet-tile),
.event-map :deep(.event-map__tile) {
  mix-blend-mode: normal !important;
  opacity: 1 !important;
  visibility: visible !important;
  filter: none !important;
}

.event-map :deep(.leaflet-tile-pane) {
  opacity: 1 !important;
  z-index: 200;
}

.event-map :deep(.leaflet-tile-pane),
.event-map :deep(.leaflet-layer),
.event-map :deep(.event-map__tile) {
  display: block !important;
}

.event-map :deep(.leaflet-container) {
  background: transparent !important;
}

.event-map :deep(.event-map__target-icon) {
  display: grid !important;
  width: 30px !important;
  height: 30px !important;
  margin: 0 !important;
  place-items: center;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.82);
  border: 2px solid #ffffff;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.42);
}

.event-map :deep(.event-map__target-dot) {
  display: block;
  width: 14px;
  height: 14px;
  border-radius: 999px;
  background: #ef4444;
  box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.26);
}
</style>
