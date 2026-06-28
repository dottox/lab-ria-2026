<template>
  <div class="tourism-page">
    <section class="tourism-hero" aria-labelledby="tourism-title">
      <p class="tourism-kicker">Uruguay por departamento</p>
      <h1 id="tourism-title">Turismo</h1>
      <p>
        Costa, sierras, termas, patrimonio y frontera en una guia visual para elegir el proximo destino.
      </p>
    </section>

    <section class="destinations-bento-grid" aria-label="Destinos turisticos por departamento">
      <div
        v-for="destination in destinations"
        :key="destination.id"
        class="destination-card-wrapper"
        :style="getBentoStyles(destination.grid)"
      >
        <div
          class="interactive-card"
          :style="{
            backgroundImage: `linear-gradient(140deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.72)), url(${destination.image})`,
          }"
        >
          <RouterLink
            class="card-link"
            :to="{ name: 'tourism-detail', params: { slug: destination.slug } }"
            :aria-label="`Ver informacion turistica de ${destination.name}`"
          >
            <div class="card-abbreviation" aria-hidden="true">
              {{ destination.code }}
            </div>

            <div class="card-hover-content">
              <div class="hover-main-info">
                <div class="hover-left">
                  <h2 class="destination-name">{{ destination.name }}</h2>
                  <p class="destination-region">{{ destination.region }}</p>
                </div>
                <p class="destination-desc">{{ destination.description }}</p>
              </div>

              <div class="hover-footer-info">
                <div class="highlights" aria-label="Imperdibles">
                  <span v-for="highlight in destination.highlights" :key="highlight" class="badge">
                    {{ highlight }}
                  </span>
                </div>
                <div class="meta-metrics">
                  <span><strong>Mejor:</strong> {{ destination.bestSeason }}</span>
                  <span><strong>Distancia:</strong> {{ distanceLabel(destination.distanceFromMontevideoKm) }}</span>
                </div>
              </div>
            </div>
          </RouterLink>

          <button
            class="fav-btn"
            :class="{ 'fav-btn--active': isFavorited(destination.id) }"
            type="button"
            :aria-label="favoriteLabel(destination.name, destination.id)"
            :aria-pressed="isFavorited(destination.id)"
            @click.stop="toggleDestinationFavorite(destination)"
          >
            <span class="fav-icon" aria-hidden="true"></span>
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { tourismDepartments, type TourismDepartment, type TourismGridConfig } from '@/data/tourism'
import { useFavoriteToggle } from '@/composables/useFavoriteToggle'
import type { Favorite } from '@/stores/favorites'

const { toggleFavorite, isFavorited } = useFavoriteToggle()
const destinations = tourismDepartments

const getBentoStyles = (grid: TourismGridConfig): Record<string, string> => {
  const col = grid.colStart ? `${grid.colStart} / span ${grid.colSpan}` : `span ${grid.colSpan}`
  const row = grid.rowStart ? `${grid.rowStart} / span ${grid.rowSpan}` : `span ${grid.rowSpan}`

  return {
    '--tablet-col-span': String(Math.min(grid.colSpan, 2)),
    gridColumn: col,
    gridRow: row,
  }
}

const distanceLabel = (distanceFromMontevideoKm: number) => {
  return distanceFromMontevideoKm === 0 ? '0 km' : `${distanceFromMontevideoKm} km`
}

const favoriteLabel = (name: string, id: string) => {
  return isFavorited(id) ? `Quitar ${name} de favoritos` : `Guardar ${name} en favoritos`
}

const createFavorite = (destination: TourismDepartment): Favorite => ({
  id: destination.id,
  type: 'tourism',
  title: destination.name,
  description: destination.region,
  savedAt: Date.now(),
})

const toggleDestinationFavorite = (destination: TourismDepartment) => {
  toggleFavorite(createFavorite(destination))
}
</script>

<style scoped>
.tourism-page {
  min-height: 100%;
  padding: clamp(1rem, 3vw, 2rem);
  background: linear-gradient(135deg, #05070b 0%, #0d1117 48%, #10181f 100%);
  color: #ffffff;
}

.tourism-hero {
  width: min(1120px, 100%);
  margin: 0 auto clamp(1.25rem, 3vw, 2.25rem);
  padding: clamp(1rem, 3vw, 2rem) 0;
}

.tourism-kicker {
  margin: 0 0 0.5rem;
  color: #7dd3fc;
  font-size: 0.8rem;
  font-weight: 800;
  letter-spacing: 0;
  text-transform: uppercase;
}

.tourism-hero h1 {
  margin: 0;
  font-size: 5rem;
  line-height: 0.95;
  font-weight: 900;
}

.tourism-hero p:last-child {
  max-width: 680px;
  margin: 1rem 0 0;
  color: rgba(255, 255, 255, 0.76);
  font-size: 1.15rem;
}

.destinations-bento-grid {
  display: grid;
  width: min(1360px, 100%);
  margin: 0 auto;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  grid-auto-rows: 250px;
  grid-auto-flow: dense;
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 24px 70px rgba(0, 0, 0, 0.35);
}

.destination-card-wrapper {
  width: 100%;
  height: 100%;
  min-width: 0;
}

.interactive-card {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background-position: center;
  background-size: cover;
  color: inherit;
  isolation: isolate;
  cursor: pointer;
  transition:
    transform var(--transition-slow, 0.3s),
    border-color var(--transition-slow, 0.3s),
    box-shadow var(--transition-slow, 0.3s),
    filter var(--transition-slow, 0.3s);
}

.card-link {
  position: absolute;
  inset: 0;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: inherit;
  text-decoration: none;
}

.card-link:focus-visible {
  outline: none;
}

.interactive-card::before {
  position: absolute;
  inset: 0;
  z-index: -1;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.08), rgba(0, 0, 0, 0.5));
  content: '';
  opacity: 0.62;
  transition: opacity var(--transition-slow, 0.3s);
}

.interactive-card:hover,
.interactive-card:focus-within {
  z-index: 2;
  border-color: rgba(125, 211, 252, 0.82);
  box-shadow:
    0 26px 55px rgba(0, 0, 0, 0.42),
    0 0 0 1px rgba(255, 255, 255, 0.16) inset,
    0 0 34px rgba(45, 212, 191, 0.18);
  filter: saturate(1.08) brightness(1.05);
  transform: translateY(-4px) scale(1.012);
  outline: none;
}

.interactive-card:hover::before,
.interactive-card:focus-within::before {
  opacity: 0.9;
}

.card-abbreviation {
  font-size: 3.75rem;
  font-weight: 900;
  color: #ffffff;
  letter-spacing: 0;
  text-shadow: 0 8px 26px rgba(0, 0, 0, 0.72);
  transition:
    opacity var(--transition-slow, 0.3s),
    transform var(--transition-slow, 0.3s);
}

.interactive-card:hover .card-abbreviation,
.interactive-card:focus-within .card-abbreviation {
  opacity: 0;
  transform: translateY(-0.5rem) scale(0.92);
}

.card-hover-content {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  max-height: 100%;
  flex-direction: column;
  gap: 1rem;
  overflow-y: auto;
  padding: 1.2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.24);
  background: linear-gradient(180deg, rgba(4, 8, 14, 0.42), rgba(4, 8, 14, 0.82));
  backdrop-filter: blur(10px);
  transform: translateY(101%);
  transition: transform var(--transition-slow, 0.3s);
}

.interactive-card:hover .card-hover-content,
.interactive-card:focus-within .card-hover-content {
  transform: translateY(0);
}

.hover-main-info {
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.2fr);
  gap: 1rem;
  align-items: start;
}

.destination-name {
  margin: 0;
  color: white;
  font-family: Georgia, 'Times New Roman', Times, serif;
  font-size: 1.45rem;
  font-weight: 800;
}

.destination-region {
  margin: 0.25rem 0 0;
  color: rgba(255, 255, 255, 0.78);
  font-size: 0.85rem;
  font-weight: 700;
}

.destination-desc {
  display: -webkit-box;
  margin: 0;
  overflow: hidden;
  color: rgba(255, 255, 255, 0.86);
  font-size: 0.95rem;
  line-height: 1.5;
  text-align: right;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}

.hover-footer-info {
  display: flex;
  flex-wrap: wrap;
  gap: 0.85rem;
  align-items: center;
  justify-content: space-between;
  padding-top: 0.85rem;
  border-top: 1px solid rgba(255, 255, 255, 0.16);
}

.highlights {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
}

.badge {
  padding: 0.25rem 0.6rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.16);
  color: #ffffff;
  font-size: 0.74rem;
  font-weight: 800;
}

.meta-metrics {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  color: rgba(255, 255, 255, 0.76);
  font-size: 0.84rem;
}

.meta-metrics strong {
  color: #ffffff;
}

.fav-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 10;
  display: grid;
  width: 42px;
  height: 42px;
  place-items: center;
  border: 1px solid rgba(255, 255, 255, 0.34);
  border-radius: 50%;
  background: rgba(4, 8, 14, 0.32);
  color: #ffffff;
  cursor: pointer;
  backdrop-filter: blur(8px);
  transition:
    transform var(--transition-fast, 0.2s),
    background-color var(--transition-fast, 0.2s),
    border-color var(--transition-fast, 0.2s);
}

.fav-btn:hover,
.fav-btn:focus-visible {
  border-color: rgba(255, 255, 255, 0.8);
  background: rgba(255, 255, 255, 0.22);
  outline: none;
  transform: scale(1.08);
}

.fav-btn--active {
  border-color: rgba(251, 191, 36, 0.9);
  background: rgba(251, 191, 36, 0.18);
  color: #fbbf24;
}

.fav-icon::before {
  content: '\2606';
  font-size: 1.35rem;
  line-height: 1;
}

.fav-btn--active .fav-icon::before {
  content: '\2605';
}

@media (max-width: 1024px) {
  .destinations-bento-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .destination-card-wrapper {
    grid-column: span var(--tablet-col-span) !important;
  }
}

@media (max-width: 768px) {
  .tourism-page {
    padding: 1rem;
  }

  .tourism-hero {
    padding-top: 0.75rem;
  }

  .tourism-hero h1 {
    font-size: 3rem;
  }

  .tourism-hero p:last-child {
    font-size: 1rem;
  }

  .destinations-bento-grid {
    grid-template-columns: 1fr;
    grid-auto-rows: auto;
  }

  .destination-card-wrapper {
    grid-column: 1 / -1 !important;
    grid-row: span 1 !important;
  }

  .interactive-card {
    min-height: 360px;
  }

  .card-link {
    align-items: flex-start;
    padding-top: 4.25rem;
  }

  .card-hover-content {
    position: absolute;
    transform: translateY(0);
  }

  .card-abbreviation {
    font-size: 2.75rem;
    margin-top: 1rem;
  }

  .hover-main-info {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }

  .destination-desc {
    text-align: left;
  }

  .hover-footer-info {
    align-items: flex-start;
    flex-direction: column;
  }

  .meta-metrics {
    width: 100%;
    justify-content: space-between;
  }
}

@media (prefers-reduced-motion: reduce) {
  .interactive-card,
  .interactive-card::before,
  .card-abbreviation,
  .card-hover-content,
  .fav-btn {
    transition: none;
  }

  .interactive-card:hover,
  .interactive-card:focus-within {
    transform: none;
  }
}
</style>
