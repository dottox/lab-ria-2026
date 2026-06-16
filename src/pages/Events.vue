<template>
  <div class="events-page">
    <div class="container--main">
      <section class="events-hero">
        <p class="events-hero__eyebrow">Agenda cultural de Montevideo</p>
        <h1 class="events-hero__title">
          Eventos multitudinales para renovar tu proxima salida
        </h1>
        <p class="events-hero__subtitle">
          Explora fiestas, ferias y festivales uruguayos con una experiencia
          visual, mapa interactivo y una recomendacion de bus directo desde tu
          ubicacion.
        </p>

        <div class="events-hero__chips">
          <span class="hero-chip">8 eventos actualmente</span>
          <span class="hero-chip">Todas las sedes en Montevideo</span>
          <span class="hero-chip">Mapa + transporte publico</span>
        </div>
      </section>

      <section v-if="selectedEvent" ref="spotlightSection" class="spotlight">
        <div class="spotlight__main">
          <div class="spotlight__media">
            <img
              :src="selectedEvent.imageUrl"
              :alt="selectedEvent.imageAlt"
              class="spotlight__image"
            />
            <button
              class="fav-btn spotlight__fav"
              :class="{ 'fav-btn--active': isFavorited(selectedEvent.id) }"
              :title="
                isFavorited(selectedEvent.id)
                  ? 'Quitar de favoritos'
                  : 'Guardar en favoritos'
              "
              @click="toggleEventFavorite(selectedEvent)"
            >
              {{ isFavorited(selectedEvent.id) ? '⭐' : '☆' }}
            </button>
          </div>

          <div class="spotlight__content">
            <div class="spotlight__badges">
              <span class="badge badge--primary">{{
                selectedEvent.category
              }}</span>
              <span class="badge badge--accent">{{
                selectedEvent.seasonLabel
              }}</span>
            </div>

            <h2 class="spotlight__title">{{ selectedEvent.name }}</h2>
            <p class="spotlight__lead">{{ selectedEvent.shortDescription }}</p>
            <p class="spotlight__description">
              {{ selectedEvent.longDescription }}
            </p>

            <div class="spotlight__facts">
              <article class="fact-card">
                <span class="fact-card__label">Lugar</span>
                <strong class="fact-card__value">{{
                  selectedEvent.venueName
                }}</strong>
                <p class="fact-card__text">{{ selectedEvent.address }}</p>
              </article>

              <article class="fact-card">
                <span class="fact-card__label">Barrio</span>
                <strong class="fact-card__value">{{
                  selectedEvent.neighborhood
                }}</strong>
                <p class="fact-card__text">Montevideo, Uruguay</p>
              </article>

              <article class="fact-card">
                <span class="fact-card__label">Temporada</span>
                <strong class="fact-card__value">{{
                  selectedEvent.seasonLabel
                }}</strong>
                <p class="fact-card__text">Ideal para planificar tu visita</p>
              </article>
            </div>

            <div class="spotlight__tags">
              <span
                v-for="tag in selectedEvent.tags"
                :key="tag"
                class="tag-pill"
              >
                {{ tag }}
              </span>
            </div>
          </div>
        </div>

        <div class="spotlight__sidebar">
          <article class="detail-panel detail-panel--transport">
            <div class="detail-panel__header">
              <div>
                <h3 class="detail-panel__title">Como llegar en bus</h3>
                <p class="detail-panel__subtitle">
                  Consulta la ubicacion del evento y busca la mejor opcion
                  directa cuando quieras comparar recorridos.
                </p>
              </div>
            </div>

            <EventMap
              :event-name="selectedEvent.name"
              :event-location="selectedEvent.coordinates"
              :user-location="userLocation"
              :origin-stop="activeRecommendation?.originStop ?? null"
              :destination-stop="activeRecommendation?.destinationStop ?? null"
            />

            <div class="transport-actions">
              <button class="btn--primary" @click="requestCurrentLocation">
                {{
                  locationState === 'requesting'
                    ? 'Ubicando...'
                    : 'Usar mi ubicacion'
                }}
              </button>
              <button
                class="btn--secondary"
                :disabled="!canLoadRoute || transportLoading"
                :title="userLocation ? '' : 'Primero usa tu ubicacion'"
                @click="loadRecommendations"
              >
                {{ transportLoading ? 'Buscando...' : 'Buscar mejor opcion' }}
              </button>
            </div>

            <div
              v-if="transportError"
              class="transport-feedback transport-feedback--error"
            >
              {{ transportError }}
            </div>
            <div v-else-if="transportLoading" class="transport-feedback">
              Analizando paradas, lineas y proximos buses para este evento...
            </div>
            <div
              v-else-if="!transportCredentialsReady"
              class="transport-feedback"
            >
              El buscador de transporte no esta disponible en este momento.
            </div>
            <div v-else-if="!userLocation" class="transport-feedback">
              Primero activa tu ubicacion y luego usa "Buscar mejor opcion".
            </div>
            <div v-else-if="activeRecommendation" class="transport-results">
              <article class="recommendation recommendation--featured">
                <div class="recommendation__eyebrow">Mejor opcion directa</div>
                <h4 class="recommendation__title">
                  Linea {{ activeRecommendation.line }}
                </h4>
                <p class="recommendation__summary">
                  Sube en
                  <strong>{{
                    formatStopName(activeRecommendation.originStop)
                  }}</strong>
                  y baja en
                  <strong>{{
                    formatStopName(activeRecommendation.destinationStop)
                  }}</strong
                  >.
                </p>

                <div class="recommendation__metrics">
                  <div class="metric-card">
                    <span class="metric-card__label">Viaje total</span>
                    <strong class="metric-card__value">
                      {{
                        formatDistance(getTotalTripMeters(activeRecommendation))
                      }}
                    </strong>
                  </div>
                  <div class="metric-card metric-card--narrow">
                    <span class="metric-card__label">Caminata total</span>
                    <strong class="metric-card__value">
                      {{ formatDistance(activeRecommendation.totalWalkMeters) }}
                    </strong>
                  </div>
                </div>
              </article>

              <div
                v-if="alternativeRecommendations.length"
                class="alternatives"
              >
                <h5 class="alternatives__title">Alternativas cercanas</h5>
                <div class="alternatives__list">
                  <article
                    v-for="option in alternativeRecommendations"
                    :key="`${option.line}-${option.originStop.busstopId}-${option.destinationStop.busstopId}`"
                    class="alternative-card"
                  >
                    <div class="alternative-card__header">
                      <strong>Linea {{ option.line }}</strong>
                    </div>
                    <p class="alternative-card__text">
                      {{ formatStopName(option.originStop) }} →
                      {{ formatStopName(option.destinationStop) }}
                    </p>
                    <div class="alternative-card__metrics">
                      <div class="metric-card">
                        <span class="metric-card__label">Viaje total</span>
                        <strong class="metric-card__value">
                          {{ formatDistance(getTotalTripMeters(option)) }}
                        </strong>
                      </div>
                      <div class="metric-card metric-card--narrow">
                        <span class="metric-card__label">Caminata total</span>
                        <strong class="metric-card__value">
                          {{ formatDistance(option.totalWalkMeters) }}
                        </strong>
                      </div>
                    </div>
                  </article>
                </div>
              </div>
            </div>
            <div v-else class="transport-feedback">
              Todavia no hay una recomendacion cargada para este evento.
            </div>
          </article>
        </div>
      </section>

      <section v-if="selectedEvent" class="events-comments">
        <EventComments :event-id="selectedEvent.id" />
      </section>

      <section class="events-section">
        <div class="events-section__header">
          <div>
            <h2 class="events-section__title">Todos los eventos</h2>
            <p class="events-section__subtitle">
              Selecciona una tarjeta para cambiar el evento destacado, su mapa y
              la recomendacion de viaje.
            </p>
          </div>
          <div class="events-section__counter">
            {{ events.length }} experiencias curadas
          </div>
        </div>

        <div class="events-grid">
          <article
            v-for="event in events"
            :key="event.id"
            class="event-card"
            :class="{ 'event-card--active': event.id === selectedEventId }"
            tabindex="0"
            role="button"
            :aria-pressed="event.id === selectedEventId"
            @click="selectEvent(event.id)"
            @keydown.enter.prevent="selectEvent(event.id)"
            @keydown.space.prevent="selectEvent(event.id)"
          >
            <button
              class="fav-btn event-card__fav"
              :class="{ 'fav-btn--active': isFavorited(event.id) }"
              :title="
                isFavorited(event.id)
                  ? 'Quitar de favoritos'
                  : 'Guardar en favoritos'
              "
              @click.stop="toggleEventFavorite(event)"
            >
              {{ isFavorited(event.id) ? '⭐' : '☆' }}
            </button>

            <div class="event-card__image-shell">
              <img
                :src="event.imageUrl"
                :alt="event.imageAlt"
                class="event-card__image"
              />
            </div>

            <div class="event-card__content">
              <div class="event-card__topline">
                <span class="badge badge--primary">{{ event.category }}</span>
                <span class="event-card__season">{{ event.seasonLabel }}</span>
              </div>

              <h3 class="event-card__title">{{ event.name }}</h3>
              <p class="event-card__description">
                {{ event.shortDescription }}
              </p>

              <div class="event-card__place">
                <strong>{{ event.venueName }}</strong>
                <span>{{ event.neighborhood }}</span>
              </div>
            </div>
          </article>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import EventMap from '@/components/EventMap.vue';
import { useFavoriteToggle } from '@/composables/useFavoriteToggle';
import { defaultEventId, events } from '@/data/events';
import type { EventLocation, UruguayEvent } from '@/data/events';
import type { Favorite } from '@/stores/favorites';
import type { BusRecommendation } from '@/services/montevideoTransport';
import {
  calculateDistanceMeters,
  findBestDirectBusOptions,
  formatStopName,
  hasTransportCredentials,
} from '@/services/montevideoTransport';
import EventComments from '@/components/EventComments.vue';

const SESSION_SELECTED_EVENT_KEY = 'events:selected-event';

const { toggleFavorite, isFavorited } = useFavoriteToggle();

const selectedEventId = ref(defaultEventId);
const spotlightSection = ref<HTMLElement | null>(null);
const userLocation = ref<EventLocation | null>(null);
const locationState = ref<
  'idle' | 'requesting' | 'granted' | 'denied' | 'unsupported'
>('idle');
const transportLoading = ref(false);
const transportError = ref<string | null>(null);
const recommendations = ref<BusRecommendation[]>([]);
const latestRouteRequest = ref(0);
const transportCredentialsReady = hasTransportCredentials();

const selectedEvent = computed(() => {
  return (
    events.find((event) => event.id === selectedEventId.value) ?? events[0]
  );
});

const activeRecommendation = computed(() => recommendations.value[0] ?? null);
const alternativeRecommendations = computed(() =>
  recommendations.value.slice(1),
);
const canLoadRoute = computed(() => {
  return Boolean(
    transportCredentialsReady && userLocation.value && selectedEvent.value,
  );
});

const createFavorite = (event: UruguayEvent): Favorite => ({
  id: event.id,
  type: 'event',
  title: event.name,
  description: `${event.venueName} • ${event.neighborhood}`,
  savedAt: Date.now(),
});

const toggleEventFavorite = (event: UruguayEvent) => {
  toggleFavorite(createFavorite(event));
};

const selectEvent = (eventId: string) => {
  selectedEventId.value = eventId;
};

const resetTransportResults = () => {
  recommendations.value = [];
};

const persistSessionValue = (key: string, value: string) => {
  if (typeof window === 'undefined') {
    return;
  }

  sessionStorage.setItem(key, value);
};

const formatDistance = (meters: number) => {
  if (meters >= 1000) {
    return `${(meters / 1000).toFixed(1).replace('.', ',')} km`;
  }

  return `${Math.round(meters)} m`;
};

const getBusRideMeters = (recommendation: BusRecommendation) => {
  return Math.round(
    calculateDistanceMeters(
      recommendation.originStop.location,
      recommendation.destinationStop.location,
    ),
  );
};

const getTotalTripMeters = (recommendation: BusRecommendation) => {
  return recommendation.totalWalkMeters + getBusRideMeters(recommendation);
};

const scrollToSpotlight = async () => {
  await nextTick();
  spotlightSection.value?.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  });
};

const loadRecommendations = async () => {
  if (
    !selectedEvent.value ||
    !userLocation.value ||
    !transportCredentialsReady
  ) {
    return;
  }

  const requestId = latestRouteRequest.value + 1;
  latestRouteRequest.value = requestId;
  transportLoading.value = true;
  transportError.value = null;

  try {
    const result = await findBestDirectBusOptions(
      userLocation.value,
      selectedEvent.value.coordinates,
    );

    if (requestId !== latestRouteRequest.value) {
      return;
    }

    recommendations.value = result;
  } catch (error) {
    if (requestId !== latestRouteRequest.value) {
      return;
    }

    resetTransportResults();
    transportError.value =
      error instanceof Error
        ? error.message
        : 'No pudimos calcular un recorrido en este momento.';
  } finally {
    if (requestId === latestRouteRequest.value) {
      transportLoading.value = false;
    }
  }
};

const requestCurrentLocation = () => {
  if (!navigator.geolocation) {
    locationState.value = 'unsupported';
    transportError.value =
      'Tu navegador no ofrece geolocalizacion para calcular el trayecto.';
    resetTransportResults();
    return;
  }

  locationState.value = 'requesting';
  transportError.value = null;

  navigator.geolocation.getCurrentPosition(
    (position) => {
      userLocation.value = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      locationState.value = 'granted';
      transportError.value = null;
      resetTransportResults();
    },
    (error) => {
      resetTransportResults();
      transportLoading.value = false;

      if (error.code === error.PERMISSION_DENIED) {
        locationState.value = 'denied';
        transportError.value =
          'Necesitamos permiso de ubicacion para sugerir la mejor ruta.';
        return;
      }

      locationState.value = 'idle';
      transportError.value =
        'No pudimos obtener tu ubicacion. Intenta de nuevo en unos segundos.';
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000,
    },
  );
};

watch(selectedEventId, (eventId) => {
  persistSessionValue(SESSION_SELECTED_EVENT_KEY, eventId);
  void scrollToSpotlight();

  resetTransportResults();
});

onMounted(() => {
  const storedEventId = sessionStorage.getItem(SESSION_SELECTED_EVENT_KEY);
  if (storedEventId && events.some((event) => event.id === storedEventId)) {
    selectedEventId.value = storedEventId;
  }
});
</script>

<style scoped>
.events-page {
  padding: 6.5rem 0 4rem;
}

.events-hero {
  margin-bottom: 2rem;
  padding: 0.5rem 0 1rem;
}

.events-hero__eyebrow {
  margin: 0 0 0.75rem;
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--color-text-muted);
}

.events-hero__title {
  margin: 0 0 1rem;
  max-width: 12ch;
  font-size: clamp(2.3rem, 4vw, 4rem);
  line-height: 0.96;
}

.events-hero__subtitle {
  margin: 0;
  max-width: 52rem;
  font-size: 1.05rem;
  line-height: 1.75;
  color: var(--color-text-secondary);
}

.events-hero__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

.hero-chip {
  display: inline-flex;
  align-items: center;
  padding: 0.65rem 1rem;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  background: var(--color-surface);
  color: var(--color-text-secondary);
  font-size: 0.9rem;
  font-weight: 600;
}

.spotlight {
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) minmax(340px, 0.95fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.spotlight__main,
.detail-panel,
.event-card {
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: calc(var(--radius-lg) * 1.15);
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.08);
  border: 5px solid var(--color-border);
}

.spotlight__main {
  overflow: hidden;
}

.spotlight__media {
  position: relative;
}

.spotlight__image {
  width: 100%;
  height: 25rem;
  display: block;
  object-fit: cover;
}

.spotlight__fav {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 3rem;
  height: 3rem;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.65);
  color: #fff;
  backdrop-filter: blur(10px);
}

.spotlight__content {
  padding: 1.75rem;
}

.spotlight__badges {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.spotlight__title {
  margin: 0 0 0.75rem;
  font-size: clamp(1.8rem, 3vw, 2.6rem);
  line-height: 1.05;
  color: var(--color-foreground);
}

.spotlight__lead {
  margin: 0 0 0.9rem;
  font-size: 1.05rem;
  line-height: 1.7;
  color: var(--color-text-secondary);
}

.spotlight__description {
  margin: 0;
  font-size: 0.98rem;
  line-height: 1.75;
  color: var(--color-text-muted);
}

.spotlight__facts {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.9rem;
  margin-top: 1.5rem;
}

.fact-card {
  padding: 1rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-background);
}

.fact-card__label {
  display: block;
  margin-bottom: 0.35rem;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-primary);
}

.fact-card__value {
  display: block;
  margin-bottom: 0.35rem;
  font-size: 1rem;
  line-height: 1.35;
  color: var(--color-foreground);
}

.fact-card__text {
  margin: 0;
  font-size: 0.9rem;
  color: var(--color-text-secondary);
}

.spotlight__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.7rem;
  margin-top: 1.5rem;
}

.tag-pill {
  display: inline-flex;
  align-items: center;
  padding: 0.55rem 0.9rem;
  border-radius: 999px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  color: var(--color-text-secondary);
  font-size: 0.9rem;
  font-weight: 600;
}

.spotlight__sidebar {
  display: grid;
  gap: 1.5rem;
}

.detail-panel {
  padding: 1.25rem;
}

.detail-panel__header {
  margin-bottom: 1rem;
}

.detail-panel__title {
  margin: 0;
  font-size: 1.15rem;
  color: var(--color-foreground);
}

.detail-panel__subtitle {
  margin: 0.35rem 0 0;
  font-size: 0.92rem;
  line-height: 1.6;
  color: var(--color-text-muted);
}

.detail-panel--transport {
  background: var(--color-background);
}

.transport-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 1rem;
}

.transport-actions .btn--secondary:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.transport-feedback {
  margin-top: 1rem;
  padding: 1rem;
  border-radius: var(--radius-md);
  background: var(--color-secondary-light);
  border: 1px solid var(--color-border);
  color: var(--color-text-secondary);
  font-size: 0.92rem;
  line-height: 1.6;
}

.transport-feedback--error {
  border-color: rgba(239, 68, 68, 0.28);
  background: rgba(254, 242, 242, 0.95);
  color: #991b1b;
}

.transport-results {
  margin-top: 1rem;
}

.recommendation {
  padding: 1rem;
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  background: var(--color-background);
}

.recommendation__eyebrow {
  margin-bottom: 0.45rem;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-primary);
}

.recommendation__title {
  margin: 0;
  font-size: 1.2rem;
}

.recommendation__summary {
  margin: 0.7rem 0 0;
  font-size: 0.95rem;
  line-height: 1.65;
  color: var(--color-text-secondary);
}

.recommendation__metrics {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
  gap: 0.75rem;
  margin-top: 1rem;
}

.metric-card {
  padding: 0.85rem;
  border-radius: var(--radius-md);
  background: var(--color-surface);
}

.metric-card--narrow {
  min-width: 0;
}

.metric-card__label {
  display: block;
  margin-bottom: 0.35rem;
  font-size: 0.82rem;
  color: var(--color-text-muted);
}

.metric-card__value {
  font-size: 0.98rem;
  color: var(--color-foreground);
}

.alternatives {
  margin-top: 1rem;
}

.alternatives__title {
  margin: 0 0 0.75rem;
  font-size: 0.95rem;
  color: var(--color-foreground);
}

.alternatives__list {
  display: grid;
  gap: 0.75rem;
}

.alternative-card {
  padding: 0.9rem 1rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-background);
}

.alternative-card__header {
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 0.35rem;
  font-size: 0.92rem;
  color: var(--color-foreground);
}

.alternative-card__text {
  margin: 0.2rem 0 0;
  font-size: 0.88rem;
  line-height: 1.55;
  color: var(--color-text-muted);
}

.alternative-card__metrics {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
  gap: 0.75rem;
  margin-top: 0.85rem;
}

.events-section__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 1rem;
  margin-bottom: 1.25rem;
}

.events-section__title {
  margin: 0;
  font-size: 1.75rem;
  color: var(--color-foreground);
}

.events-section__subtitle {
  margin: 0.35rem 0 0;
  max-width: 42rem;
  color: var(--color-text-muted);
}

.events-section__counter {
  padding: 0.7rem 1rem;
  border-radius: 999px;
  background: var(--color-secondary-light);
  color: var(--color-secondary-dark);
  font-weight: 700;
  white-space: nowrap;
}

.events-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.25rem;
}

.event-card {
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition:
    transform var(--transition-base),
    border-color var(--transition-base),
    box-shadow var(--transition-base);
}

.event-card:hover,
.event-card:focus-visible {
  transform: translateY(-4px);
  border-color: rgba(0, 80, 179, 0.45);
  box-shadow: 0 24px 42px rgba(15, 23, 42, 0.14);
  outline: none;
}

.event-card--active {
  border-color: rgba(0, 80, 179, 0.55);
  box-shadow: 0 26px 50px rgba(0, 80, 179, 0.18);
}

.event-card__fav {
  position: absolute;
  top: 0.9rem;
  right: 0.9rem;
  z-index: 2;
  width: 2.6rem;
  height: 2.6rem;
  border-radius: 999px;
  background: var(--color-background);
}

.event-card__image-shell {
  position: relative;
  overflow: hidden;
}

.event-card__image-shell::after {
  content: '';
  position: absolute;
  inset: auto 0 0;
  height: 4.5rem;
  background: linear-gradient(180deg, transparent, rgba(15, 23, 42, 0.6));
}

.event-card__image {
  width: 100%;
  height: 12rem;
  display: block;
  object-fit: cover;
}

.event-card__content {
  padding: 1rem 1.05rem 1.15rem;
}

.event-card__topline {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.8rem;
}

.event-card__season {
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--color-text-muted);
}

.event-card__title {
  margin: 0;
  font-size: 1.15rem;
  line-height: 1.25;
  color: var(--color-foreground);
}

.event-card__description {
  margin: 0.7rem 0 1rem;
  color: var(--color-text-secondary);
  font-size: 0.93rem;
  line-height: 1.65;
}

.event-card__place {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  color: var(--color-text-muted);
  font-size: 0.9rem;
}

.event-card__place strong {
  color: var(--color-foreground);
}

.fav-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 0;
  cursor: pointer;
  font-size: 1.3rem;
  transition:
    transform var(--transition-base),
    background var(--transition-base);
}

.fav-btn:hover {
  transform: scale(1.06);
}

.fav-btn--active {
  background: rgba(212, 163, 0, 0.9);
  color: #0f172a;
}

@media (max-width: 1120px) {
  .spotlight {
    grid-template-columns: 1fr;
  }

  .spotlight__image {
    height: 22rem;
  }
}

@media (max-width: 768px) {
  .events-page {
    padding-top: 5.5rem;
  }

  .events-hero {
    padding: 0.25rem 0 1rem;
  }

  .events-hero__title {
    max-width: none;
  }

  .spotlight__content {
    padding: 1.25rem;
  }

  .spotlight__facts,
  .recommendation__metrics,
  .alternative-card__metrics {
    grid-template-columns: 1fr;
  }

  .events-section__header,
  .transport-actions,
  .alternative-card__header {
    flex-direction: column;
    align-items: flex-start;
  }

  .events-section__counter {
    white-space: normal;
  }
}
</style>
