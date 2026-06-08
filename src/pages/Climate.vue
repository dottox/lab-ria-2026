<template>
  <div class="climate-page">
    <div class="container--main">
      <section class="climate-hero">
        <p class="climate-hero__eyebrow">Clima del Uruguay</p>
        <h1 class="climate-hero__title">Información en tiempo real y de cada temporada</h1>
        <p class="climate-hero__subtitle">
          Descubre toda la información sobre el clima del Uruguay, detallando cada temporada, para que puedas prepararte para venir en tu mejor temporada.
        </p>


      </section>

      <div class="climate-overview">
        <div class="season-banner">
          <img :src="currentSeason.image" :alt="currentSeason.name" />
          <div class="season-badge">
            <span>{{ currentSeason.emoji }}</span>
            <strong>{{ currentSeason.name }}</strong>
          </div>
        </div>

        <div class="overview-content">
          <p class="overview-text">
            Uruguay tiene un clima templado y húmedo, influenciado por su
            proximidad al Océano Atlántico. Las temperaturas son moderadas
            durante todo el año, con veranos cálidos e inviernos suaves. La
            lluvia es bastante regular, lo que contribuye a la vegetación verde
            y a la agricultura del país.
          </p>
          <div class="key-facts">
            <div v-for="fact in facts" :key="fact.title" class="fact-box">
              <h4>{{ fact.title }}</h4>
              <p>{{ fact.value }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="weather-factors">
        <h2 class="section-title">Ahora en Uruguay</h2>
        <div class="factors-grid">
          <Card
            v-for="region in regions"
            :key="region.name"
            :title="region.name"
            style="text-align: center"
          >
            <div v-if="region.loading" class="region-loading">Cargando...</div>
            <div v-else-if="region.error" class="region-error">
              ⚠️ Error al cargar
            </div>
            <template v-else-if="region.weather">
              <h3>
                {{ region.emoji }} {{ region.weather.current.temperature_2m }}°C
              </h3>
              <p>
                {{ getWeatherInfo(region.weather.current.weather_code).emoji }}
                {{ getWeatherInfo(region.weather.current.weather_code).label }}
              </p>
            </template>
          </Card>
        </div>

        <div class="seasons-section" style="margin-top: 3rem">
          <h2 class="section-title">Estaciones en Uruguay</h2>
          <div class="seasons-grid">
            <div
              v-for="season in seasons"
              :key="season.name"
              class="season-card"
            >
              <Card :title="season.name">
                <template #header>
                  <div class="season-header">
                    <span class="season-icon">{{ season.icon }}</span>
                  </div>
                </template>

                <div class="season-content">
                  <div class="season-detail">
                    <strong>Meses:</strong> {{ season.months }}
                  </div>
                  <div class="season-detail">
                    <strong>Temperatura:</strong> {{ season.temperature }}
                  </div>
                  <div class="season-detail">
                    <strong>Características:</strong>
                    {{ season.characteristics }}
                  </div>
                  <div class="season-detail">
                    <strong>Actividades:</strong> {{ season.activities }}
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Card from '@/components/Card.vue';
import { getCurrentSeason, getSeasonsInfo } from '../utils/seasons';
import { useWeather } from '@/composables/useWeather';

interface Fact {
  title: string;
  value: string;
}

const currentSeason = getCurrentSeason();

const facts = ref<Fact[]>([
  { title: 'Temperatura Anual (promedio)', value: '17.5°C' },
  { title: 'Verano (Dic-Feb)', value: '20-25°C' },
  { title: 'Invierno (Jun-Ago)', value: '8-12°C' },
  { title: 'Lluvia Anual', value: '1,200-1,400 mm' },
]);

const seasons = ref(getSeasonsInfo());
const { regions, getWeatherInfo } = useWeather();
</script>

<style scoped>

.climate-page {
  padding: 6.5rem 0 4rem;
}

.climate-hero {
  margin-bottom: 2rem;
  padding: 0.5rem 0 1rem;
}

.climate-hero__eyebrow {
  margin: 0 0 0.75rem;
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--color-text-muted);
}

.climate-hero__title {
  margin: 0 0 1rem;
  max-width: 12ch;
  font-size: clamp(2.3rem, 4vw, 4rem);
  line-height: 0.96;
}

.climate-hero__subtitle {
  margin: 0;
  max-width: 52rem;
  font-size: 1.05rem;
  line-height: 1.75;
  color: var(--color-text-secondary);
}

.climate-hero__chips {
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

.climate-overview {
  display: flex;
  gap: 2rem;
  align-items: flex-start;
  margin-bottom: 3rem;
}

.season-banner {
  position: relative;
  flex: 0 0 30%;
  height: 260px;
  border-radius: var(--radius-md);
  overflow: hidden;
}

.season-banner img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.season-badge {
  position: absolute;
  bottom: 12px;
  left: 12px;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  border-radius: 20px;
  padding: 6px 14px;
  display: flex;
  align-items: center;
  gap: 6px;
  color: white;
  font-size: 0.95rem;
}

.overview-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.overview-text {
  margin: 0;
  font-size: 1rem;
  line-height: 1.7;
  color: var(--color-foreground);
}

.key-facts {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 1rem;
}

.fact-box {
  background-color: var(--color-primary-light);
  padding: 1.25rem;
  border-radius: var(--radius-md);
  text-align: center;
}

.fact-box h4 {
  margin: 0 0 0.5rem 0;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-primary);
}

.fact-box p {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-foreground);
}

/* ── Seasons ── */
.section-title {
  margin: 0 0 1.5rem 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-primary);
}

.seasons-section {
  margin-bottom: 3rem;
  margin-top: 3rem;
}

.seasons-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.season-card {
  display: contents;
}

.season-header {
  display: flex;
  justify-content: center;
  align-items: center;
}

.season-icon {
  font-size: 2.5rem;
}

.season-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.season-detail {
  font-size: 0.95rem;
  line-height: 1.5;
  color: var(--color-foreground);
}

.season-detail strong {
  color: var(--color-primary);
}

/* ── Weather factors ── */
.weather-factors {
  margin-bottom: 2rem;
}

.factors-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.factors-grid :deep(.card) {
  display: flex;
  flex-direction: column;
}

.factors-grid :deep(.card__body) {
  flex: 1;
}

.factors-grid p {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.6;
  color: var(--color-foreground);
}

/* ── Responsive ── */
@media (max-width: 768px) {
  .climate-page {
    padding-top: 5.5rem;
  }

  .climate-hero {
    padding: 0.25rem 0 1rem;
  }

  .climate-hero__title {
    max-width: none;
  }

  .section-title {
    font-size: 1.25rem;
  }

  .climate-overview {
    flex-direction: column;
  }

  .season-banner {
    flex: none;
    width: 100%;
    height: 200px;
  }

  .seasons-grid,
  .factors-grid {
    grid-template-columns: 1fr;
  }
}
</style>
