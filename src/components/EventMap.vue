<template>
  <div ref="mapContainer" class="event-map" aria-label="Mapa interactivo con marcadores del evento y transporte"></div>
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
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

const renderMarkers = async () => {
  if (!map.value || !markersLayer.value) {
    return
  }

  markersLayer.value.clearLayers()

  const eventLatLng = L.latLng(props.eventLocation.lat, props.eventLocation.lng)
  const bounds = L.latLngBounds([eventLatLng, eventLatLng])
  const eventMarker = L.marker(eventLatLng)
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
  }).setView([props.eventLocation.lat, props.eventLocation.lng], 14)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
  }).addTo(map.value)

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
  map.value?.remove()
  map.value = null
  markersLayer.value = null
})
</script>

<style scoped>
.event-map {
  width: 100%;
  min-height: 320px;
  border-radius: var(--radius-lg);
  overflow: hidden;
  border: 1px solid var(--color-border);
  background:
    linear-gradient(135deg, rgba(0, 80, 179, 0.08), rgba(0, 128, 128, 0.08)),
    var(--color-surface);
}
</style>
