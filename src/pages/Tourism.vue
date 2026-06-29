<template>
  <div class="tourism-page">
    <template v-if="isLoading">
      <SkeletonHero class="tourism-skeleton-hero" dark />
      <section
        class="destinations-bento-grid tourism-skeleton-grid"
        aria-busy="true"
        aria-label="Cargando destinos turisticos"
      >
        <div
          v-for="destination in destinations"
          :key="`skeleton-${destination.id}`"
          class="destination-card-wrapper"
          :style="getBentoStyles(destination.grid)"
        >
          <SkeletonBase class="tourism-card-skeleton" height="100%" radius="0" variant="image" />
        </div>
      </section>
    </template>

    <template v-else>
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
            backgroundImage: `linear-gradient(140deg, color-mix(in srgb, var(--color-image-overlay) 20%, transparent), color-mix(in srgb, var(--color-image-overlay) 72%, transparent)), url(${destination.image})`,
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
    </template>
  </div>
</template>

<script setup lang="ts">
import { SkeletonBase, SkeletonHero } from '@/components/skeleton'
import { tourismDepartments, type TourismDepartment, type TourismGridConfig } from '@/data/tourism'
import { useFavoriteToggle } from '@/composables/useFavoriteToggle'
import { useMinimumLoading } from '@/composables/useMinimumLoading'
import type { Favorite } from '@/stores/favorites'

const { toggleFavorite, isFavorited } = useFavoriteToggle()
const { isLoading } = useMinimumLoading(460)
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
}

.tourism-hero {
  width: min(1120px, 100%);
  margin: 0 auto clamp(1.25rem, 3vw, 2.25rem);
  padding: clamp(1rem, 3vw, 2rem) 0;
}

.tourism-skeleton-hero {
  width: min(1120px, 100%);
  margin: 0 auto clamp(1.25rem, 3vw, 2.25rem);
}

.tourism-skeleton-grid {
  box-shadow: 0 24px 70px color-mix(in srgb, var(--color-foreground) 12%, transparent);
}

.tourism-card-skeleton {
  display: block;
}

.tourism-kicker {
  margin: 0 0 0.5rem;
  color: var(--color-tertiary);
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
  color: var(--color-text-secondary);
  font-size: 1.15rem;
}

.destinations-bento-grid {
  display: grid;
  width: min(1360px, 100%);
  margin: 0 auto;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  grid-auto-rows: 250px;
  grid-auto-flow: dense;
  border: 1px solid var(--color-border);
  box-shadow: 0 24px 70px color-mix(in srgb, var(--color-foreground) 18%, transparent);
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
  border: 1px solid color-mix(in srgb, var(--color-on-image) 12%, transparent);
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
  background: linear-gradient(
    180deg,
    color-mix(in srgb, var(--color-on-image) 8%, transparent),
    color-mix(in srgb, var(--color-image-overlay) 50%, transparent)
  );
  content: '';
  opacity: 0.62;
  transition: opacity var(--transition-slow, 0.3s);
}

.interactive-card:hover,
.interactive-card:focus-within {
  z-index: 2;
  border-color: color-mix(in srgb, var(--color-primary) 82%, transparent);
  box-shadow:
    0 26px 55px color-mix(in srgb, var(--color-image-overlay) 42%, transparent),
    0 0 0 1px color-mix(in srgb, var(--color-on-image) 16%, transparent) inset,
    0 0 34px color-mix(in srgb, var(--color-tertiary) 18%, transparent);
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
  color: var(--color-on-image);
  letter-spacing: 0;
  text-shadow: 0 8px 26px color-mix(in srgb, var(--color-image-overlay) 72%, transparent);
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
  border-top: 1px solid color-mix(in srgb, var(--color-on-image) 24%, transparent);
  background: linear-gradient(
    180deg,
    color-mix(in srgb, var(--color-image-overlay) 42%, transparent),
    color-mix(in srgb, var(--color-image-overlay) 82%, transparent)
  );
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
  color: var(--color-on-image);
  font-family: Georgia, 'Times New Roman', Times, serif;
  font-size: 1.45rem;
  font-weight: 800;
}

.destination-region {
  margin: 0.25rem 0 0;
  color: color-mix(in srgb, var(--color-on-image) 78%, transparent);
  font-size: 0.85rem;
  font-weight: 700;
}

.destination-desc {
  display: -webkit-box;
  margin: 0;
  overflow: hidden;
  color: color-mix(in srgb, var(--color-on-image) 86%, transparent);
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
  border-top: 1px solid color-mix(in srgb, var(--color-on-image) 16%, transparent);
}

.highlights {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
}

.badge {
  padding: 0.25rem 0.6rem;
  border: 1px solid color-mix(in srgb, var(--color-on-image) 20%, transparent);
  border-radius: 999px;
  background: color-mix(in srgb, var(--color-on-image) 16%, transparent);
  color: var(--color-on-image);
  font-size: 0.74rem;
  font-weight: 800;
}

.meta-metrics {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  color: color-mix(in srgb, var(--color-on-image) 76%, transparent);
  font-size: 0.84rem;
}

.meta-metrics strong {
  color: var(--color-on-image);
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
  border: 1px solid color-mix(in srgb, var(--color-on-image) 34%, transparent);
  border-radius: 50%;
  background: color-mix(in srgb, var(--color-image-overlay) 32%, transparent);
  color: var(--color-on-image);
  cursor: pointer;
  backdrop-filter: blur(8px);
  transition:
    transform var(--transition-fast, 0.2s),
    background-color var(--transition-fast, 0.2s),
    border-color var(--transition-fast, 0.2s);
}

.fav-btn:hover,
.fav-btn:focus-visible {
  border-color: color-mix(in srgb, var(--color-on-image) 80%, transparent);
  background: color-mix(in srgb, var(--color-on-image) 22%, transparent);
  outline: none;
  transform: scale(1.08);
}

.fav-btn--active {
  border-color: color-mix(in srgb, var(--color-secondary) 90%, transparent);
  background: color-mix(in srgb, var(--color-secondary) 18%, transparent);
  color: var(--color-secondary);
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
