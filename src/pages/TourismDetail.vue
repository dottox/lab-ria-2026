<template>
  <div class="tourism-detail-page">
    <section v-if="isLoading" class="tourism-detail-skeleton" aria-busy="true" aria-label="Cargando turismo">
      <SkeletonHero large with-stats with-actions dark />
      <div class="detail-skeleton-shell">
        <SkeletonText :lines="3" line-height="1rem" />
        <div class="detail-skeleton-stats">
          <SkeletonStat v-for="item in 5" :key="`fact-${item}`" />
        </div>
        <SkeletonGrid :items="3" with-image :card-lines="3" />
        <div class="detail-skeleton-split">
          <SkeletonList :items="4" />
          <SkeletonList :items="4" />
        </div>
        <div class="detail-skeleton-gallery">
          <SkeletonBase
            v-for="item in 4"
            :key="`gallery-${item}`"
            class="detail-skeleton-gallery__item"
            height="100%"
            radius="0.5rem"
            variant="image"
          />
        </div>
      </div>
    </section>

    <section v-else-if="department" class="tourism-detail">
      <section class="detail-hero" :style="heroStyle" aria-labelledby="department-title">
        <div class="detail-hero__content">
          <RouterLink class="back-link" to="/tourism">&larr; Volver a Turismo</RouterLink>

          <div class="detail-hero__body">
            <div class="detail-hero__copy">
              <p class="detail-kicker">{{ department.region }}</p>
              <h1 id="department-title">{{ department.name }}</h1>
              <p class="detail-subtitle">{{ department.subtitle }}</p>

              <div class="tag-list" aria-label="Etiquetas">
                <span v-for="tag in department.tags" :key="tag" class="tag-chip">
                  {{ tag }}
                </span>
              </div>
            </div>

            <div class="hero-panel">
              <div class="hero-stat">
                <span>Region</span>
                <strong>{{ department.region }}</strong>
              </div>
              <div class="hero-stat">
                <span>Mejor epoca</span>
                <strong>{{ department.bestSeason }}</strong>
              </div>
              <div class="hero-stat">
                <span>Desde Montevideo</span>
                <strong>{{ distanceLabel(department.distanceFromMontevideoKm) }}</strong>
              </div>
              <button
                class="detail-fav-btn"
                :class="{ 'detail-fav-btn--active': isDepartmentFavorited }"
                type="button"
                :aria-label="favoriteAriaLabel"
                :aria-pressed="isDepartmentFavorited"
                @click="toggleDepartmentFavorite"
              >
                <span class="fav-icon" aria-hidden="true"></span>
                <span>{{ isDepartmentFavorited ? 'Guardado' : 'Guardar' }}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <main class="detail-content">
        <section class="summary-section reveal-on-scroll" aria-labelledby="summary-title">
          <div>
            <p class="section-kicker">Resumen</p>
            <h2 id="summary-title">Por que visitar {{ department.name }}</h2>
            <p>{{ department.longDescription }}</p>
          </div>

          <div class="quick-facts" aria-label="Datos rapidos">
            <article v-for="fact in quickFacts" :key="fact.label" class="info-card">
              <span>{{ fact.label }}</span>
              <strong>{{ fact.value }}</strong>
            </article>
          </div>
        </section>

        <section class="content-section" aria-labelledby="attractions-title">
          <div class="section-heading reveal-on-scroll">
            <p class="section-kicker">Imperdibles</p>
            <h2 id="attractions-title">Atractivos principales</h2>
          </div>

          <div class="attractions-grid">
            <article
              v-for="attraction in department.attractions"
              :key="attraction.id"
              class="attraction-card reveal-on-scroll"
            >
              <img
                :src="attraction.image"
                :alt="`${attraction.name} en ${department.name}`"
                loading="lazy"
              >
              <div class="attraction-card__body">
                <span>{{ attraction.category }}</span>
                <h3>{{ attraction.name }}</h3>
                <p>{{ attraction.description }}</p>
              </div>
            </article>
          </div>
        </section>

        <section class="content-section" aria-labelledby="experiences-title">
          <div class="section-heading reveal-on-scroll">
            <p class="section-kicker">Experiencias recomendadas</p>
            <h2 id="experiences-title">Planes con identidad local</h2>
          </div>

          <div class="experience-grid">
            <article
              v-for="experience in department.experiences"
              :key="experience.id"
              class="experience-card reveal-on-scroll"
            >
              <span class="experience-icon" aria-hidden="true">{{ experience.icon }}</span>
              <h3>{{ experience.title }}</h3>
              <p>{{ experience.description }}</p>
            </article>
          </div>
        </section>

        <section class="split-section">
          <div class="list-block reveal-on-scroll" aria-labelledby="gastronomy-title">
            <p class="section-kicker">Sabores y gastronomia</p>
            <h2 id="gastronomy-title">Para probar</h2>
            <ul class="stack-list">
              <li v-for="item in department.gastronomy" :key="item">{{ item }}</li>
            </ul>
          </div>

          <div class="list-block reveal-on-scroll" aria-labelledby="tips-title">
            <p class="section-kicker">Consejos para tu visita</p>
            <h2 id="tips-title">Antes de salir</h2>
            <ul class="stack-list">
              <li v-for="tip in department.tips" :key="tip">{{ tip }}</li>
            </ul>
          </div>
        </section>

        <section v-if="galleryImages.length > 0" class="content-section" aria-labelledby="gallery-title">
          <div class="section-heading reveal-on-scroll">
            <p class="section-kicker">Galeria</p>
            <h2 id="gallery-title">{{ department.name }} en imagenes</h2>
          </div>

          <div class="gallery-grid">
            <button
              v-for="(image, index) in galleryImages"
              :key="image"
              class="gallery-item reveal-on-scroll"
              type="button"
              :aria-label="`Abrir imagen ${index + 1} de ${department.name}`"
              @click="openLightbox(index)"
            >
              <img
                :src="image"
                :alt="`${department.name} - imagen ${index + 1}`"
                loading="lazy"
              >
            </button>
          </div>

          <VueEasyLightbox
            :visible="lightboxVisible"
            :imgs="galleryImages"
            :index="lightboxIndex"
            @hide="closeLightbox"
          />
        </section>
      </main>
    </section>

    <section v-else class="not-found">
      <p class="section-kicker">Turismo</p>
      <h1>Departamento no encontrado</h1>
      <p>El destino solicitado no existe o cambio de direccion.</p>
      <RouterLink class="back-link back-link--dark" to="/tourism">&larr; Volver a Turismo</RouterLink>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import VueEasyLightbox from 'vue-easy-lightbox'
import { useRoute } from 'vue-router'
import { getTourismDepartmentBySlug, type TourismDepartment } from '@/data/tourism'
import { useFavoriteToggle } from '@/composables/useFavoriteToggle'
import { useRevealOnScroll } from '@/composables/useRevealOnScroll'
import { SkeletonBase, SkeletonGrid, SkeletonHero, SkeletonList, SkeletonStat, SkeletonText } from '@/components/skeleton'
import type { Favorite } from '@/stores/favorites'

const route = useRoute()
const { toggleFavorite, isFavorited } = useFavoriteToggle()
const { refreshRevealElements } = useRevealOnScroll()

const isLoading = ref(true)
let loadingTimer: number | undefined

const slug = computed(() => {
  const param = route.params.slug
  return Array.isArray(param) ? param[0] ?? '' : param ?? ''
})

const department = computed(() => getTourismDepartmentBySlug(slug.value))
const galleryImages = computed(() => department.value?.gallery ?? [])
const lightboxVisible = ref(false)
const lightboxIndex = ref(0)

const heroStyle = computed(() => {
  if (!department.value) return {}

  return {
    backgroundImage: `linear-gradient(120deg, rgba(3, 7, 18, 0.92), rgba(3, 7, 18, 0.52) 42%, rgba(3, 7, 18, 0.74)), url(${department.value.heroImage})`,
  }
})

const quickFacts = computed(() => {
  if (!department.value) return []

  return [
    { label: 'Region', value: department.value.region },
    { label: 'Mejor epoca', value: department.value.bestSeason },
    { label: 'Distancia', value: distanceLabel(department.value.distanceFromMontevideoKm) },
    { label: 'Atractivos', value: `${department.value.attractions.length}` },
    { label: 'Experiencias', value: `${department.value.experiences.length}` },
  ]
})

const isDepartmentFavorited = computed(() => {
  return department.value ? isFavorited(department.value.id) : false
})

const favoriteAriaLabel = computed(() => {
  if (!department.value) return 'Guardar destino en favoritos'
  return isDepartmentFavorited.value
    ? `Quitar ${department.value.name} de favoritos`
    : `Guardar ${department.value.name} en favoritos`
})

const distanceLabel = (distanceFromMontevideoKm: number) => {
  return distanceFromMontevideoKm === 0 ? '0 km' : `${distanceFromMontevideoKm} km`
}

const createFavorite = (destination: TourismDepartment): Favorite => ({
  id: destination.id,
  type: 'tourism',
  title: destination.name,
  description: destination.region,
  savedAt: Date.now(),
})

const toggleDepartmentFavorite = () => {
  if (department.value) {
    toggleFavorite(createFavorite(department.value))
  }
}

const openLightbox = (index: number) => {
  if (index < 0 || index >= galleryImages.value.length) return

  lightboxIndex.value = index
  lightboxVisible.value = true
}

const closeLightbox = () => {
  lightboxVisible.value = false
}

const finishLoading = () => {
  isLoading.value = false
  void nextTick(() => refreshRevealElements())
}

const startLoading = () => {
  isLoading.value = true
  if (loadingTimer !== undefined) {
    window.clearTimeout(loadingTimer)
  }

  loadingTimer = window.setTimeout(finishLoading, 540)
}

onMounted(startLoading)

watch(slug, () => {
  closeLightbox()
  startLoading()
})

onBeforeUnmount(() => {
  if (loadingTimer !== undefined) {
    window.clearTimeout(loadingTimer)
  }
})
</script>

<style scoped>
.tourism-detail-page {
  min-height: 100%;
  background: linear-gradient(180deg, #05070b 0%, #0b1018 42%, #f8fafc 42%, #f8fafc 100%);
  color: #0f172a;
}

.tourism-detail {
  min-height: 100%;
}

.detail-hero {
  min-height: 640px;
  background-position: center;
  background-size: cover;
  color: #ffffff;
}

.detail-hero__content {
  display: flex;
  min-height: 640px;
  width: min(1180px, calc(100% - 2rem));
  margin: 0 auto;
  flex-direction: column;
  justify-content: space-between;
  padding: 2rem 0 3rem;
}

.back-link {
  display: inline-flex;
  width: fit-content;
  align-items: center;
  gap: 0.4rem;
  border: 1px solid rgba(255, 255, 255, 0.24);
  border-radius: 999px;
  padding: 0.7rem 1rem;
  background: rgba(15, 23, 42, 0.34);
  color: inherit;
  font-weight: 800;
  text-decoration: none;
  backdrop-filter: blur(10px);
  transition:
    border-color var(--transition-fast, 0.2s),
    background-color var(--transition-fast, 0.2s),
    transform var(--transition-fast, 0.2s);
}

.back-link:hover,
.back-link:focus-visible {
  border-color: rgba(255, 255, 255, 0.78);
  background: rgba(255, 255, 255, 0.16);
  outline: none;
  transform: translateY(-2px);
}

.back-link--dark {
  border-color: rgba(15, 23, 42, 0.16);
  background: #0f172a;
  color: #ffffff;
}

.detail-hero__body {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 360px;
  gap: 2rem;
  align-items: end;
}

.detail-kicker,
.section-kicker {
  margin: 0 0 0.65rem;
  color: #38bdf8;
  font-size: 0.82rem;
  font-weight: 900;
  letter-spacing: 0;
  text-transform: uppercase;
}

.detail-hero h1 {
  max-width: 820px;
  margin: 0;
  font-size: 5rem;
  line-height: 0.95;
  font-weight: 950;
}

.detail-subtitle {
  max-width: 760px;
  margin: 1rem 0 0;
  color: rgba(255, 255, 255, 0.84);
  font-size: 1.2rem;
  line-height: 1.6;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
  margin-top: 1.4rem;
}

.tag-chip {
  border: 1px solid rgba(255, 255, 255, 0.22);
  border-radius: 999px;
  padding: 0.42rem 0.75rem;
  background: rgba(255, 255, 255, 0.14);
  color: #ffffff;
  font-size: 0.85rem;
  font-weight: 800;
}

.hero-panel {
  display: grid;
  gap: 0.8rem;
  border: 1px solid rgba(255, 255, 255, 0.22);
  border-radius: 8px;
  padding: 1rem;
  background: rgba(4, 8, 14, 0.46);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.28);
  backdrop-filter: blur(16px);
}

.hero-stat {
  display: grid;
  gap: 0.2rem;
  border-radius: 8px;
  padding: 0.85rem;
  background: rgba(255, 255, 255, 0.1);
}

.hero-stat span {
  color: rgba(255, 255, 255, 0.62);
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
}

.hero-stat strong {
  color: #ffffff;
  font-size: 1rem;
}

.detail-fav-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.55rem;
  border: 1px solid rgba(255, 255, 255, 0.28);
  border-radius: 999px;
  padding: 0.8rem 1rem;
  background: #ffffff;
  color: #0f172a;
  font-weight: 900;
  cursor: pointer;
  transition:
    transform var(--transition-fast, 0.2s),
    box-shadow var(--transition-fast, 0.2s),
    background-color var(--transition-fast, 0.2s);
}

.detail-fav-btn:hover,
.detail-fav-btn:focus-visible {
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.24);
  outline: none;
  transform: translateY(-2px);
}

.detail-fav-btn--active {
  background: #fbbf24;
  color: #111827;
}

.fav-icon::before {
  content: '\2606';
  font-size: 1.2rem;
  line-height: 1;
}

.detail-fav-btn--active .fav-icon::before {
  content: '\2605';
}

.detail-content {
  width: min(1180px, calc(100% - 2rem));
  margin: 0 auto;
  padding: 3rem 0 4rem;
}

.summary-section {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(280px, 0.8fr);
  gap: 2rem;
  align-items: start;
}

.summary-section h2,
.section-heading h2,
.list-block h2 {
  margin: 0;
  color: #0f172a;
  font-size: 2rem;
  line-height: 1.15;
}

.summary-section p:not(.section-kicker) {
  margin: 1rem 0 0;
  color: #475569;
  font-size: 1.05rem;
  line-height: 1.8;
}

.quick-facts {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.8rem;
}

.info-card,
.experience-card,
.list-block {
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.86);
  box-shadow: 0 12px 32px rgba(15, 23, 42, 0.08);
}

.info-card {
  display: grid;
  gap: 0.35rem;
  padding: 1rem;
}

.info-card span {
  color: #64748b;
  font-size: 0.8rem;
  font-weight: 900;
  text-transform: uppercase;
}

.info-card strong {
  color: #0f172a;
  font-size: 1.05rem;
}

.content-section {
  margin-top: 4rem;
}

.section-heading {
  margin-bottom: 1.2rem;
}

.attractions-grid,
.experience-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
}

.attraction-card {
  overflow: hidden;
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 16px 38px rgba(15, 23, 42, 0.09);
  transition:
    transform var(--transition-slow, 0.3s),
    box-shadow var(--transition-slow, 0.3s);
}

.attraction-card:hover {
  box-shadow: 0 22px 48px rgba(15, 23, 42, 0.16);
  transform: translateY(-6px);
}

.attraction-card img {
  width: 100%;
  height: 220px;
  object-fit: cover;
  transition: transform var(--transition-slow, 0.3s);
}

.attraction-card:hover img {
  transform: scale(1.045);
}

.attraction-card__body {
  padding: 1rem;
}

.attraction-card__body span {
  display: inline-flex;
  margin-bottom: 0.7rem;
  border-radius: 999px;
  padding: 0.28rem 0.62rem;
  background: #e0f2fe;
  color: #0369a1;
  font-size: 0.78rem;
  font-weight: 900;
}

.attraction-card h3,
.experience-card h3 {
  margin: 0;
  color: #0f172a;
  font-size: 1.2rem;
}

.attraction-card p,
.experience-card p {
  margin: 0.65rem 0 0;
  color: #475569;
  line-height: 1.65;
}

.experience-card {
  padding: 1.2rem;
  transition:
    transform var(--transition-slow, 0.3s),
    border-color var(--transition-slow, 0.3s);
}

.experience-card:hover {
  border-color: rgba(14, 165, 233, 0.4);
  transform: translateY(-4px);
}

.experience-icon {
  display: inline-grid;
  min-width: 3.2rem;
  height: 3.2rem;
  margin-bottom: 1rem;
  place-items: center;
  border-radius: 8px;
  background: #0f172a;
  color: #ffffff;
  font-size: 0.78rem;
  font-weight: 900;
}

.split-section {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
  margin-top: 4rem;
}

.list-block {
  padding: 1.4rem;
}

.stack-list {
  display: grid;
  gap: 0.75rem;
  margin: 1.2rem 0 0;
  padding: 0;
  list-style: none;
}

.stack-list li {
  position: relative;
  border-radius: 8px;
  padding: 0.85rem 0.85rem 0.85rem 2.25rem;
  background: #f1f5f9;
  color: #334155;
  line-height: 1.55;
}

.stack-list li::before {
  position: absolute;
  top: 1rem;
  left: 0.9rem;
  width: 0.55rem;
  height: 0.55rem;
  border-radius: 50%;
  background: #0ea5e9;
  content: '';
}

.gallery-grid {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr 0.8fr;
  grid-auto-rows: 220px;
  gap: 1rem;
}

.gallery-item {
  position: relative;
  display: block;
  width: 100%;
  height: 100%;
  overflow: hidden;
  margin: 0;
  padding: 0;
  border: 0;
  border-radius: 8px;
  background: #e2e8f0;
  cursor: pointer;
}

.gallery-item:first-child {
  grid-row: span 2;
}

.gallery-item::after {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  background: rgba(2, 6, 23, 0.42);
  color: #ffffff;
  font-size: 0.9rem;
  font-weight: 900;
  content: 'Ver imagen';
  opacity: 0;
  transition: opacity var(--transition-slow, 0.3s);
}

.gallery-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition:
    filter var(--transition-slow, 0.3s),
    transform var(--transition-slow, 0.3s);
}

.gallery-item:hover img {
  filter: saturate(1.1) contrast(1.04);
  transform: scale(1.04);
}

.gallery-item:hover::after,
.gallery-item:focus-visible::after {
  opacity: 1;
}

.gallery-item:focus-visible {
  outline: 3px solid #38bdf8;
  outline-offset: 4px;
}

.gallery-item:focus-visible img {
  filter: saturate(1.1) contrast(1.04);
  transform: scale(1.04);
}

.reveal-on-scroll {
  opacity: 0;
  transform: translateY(32px);
  transition:
    opacity 0.7s ease,
    transform 0.7s ease;
}

.reveal-on-scroll.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.attractions-grid .reveal-on-scroll:nth-child(2),
.experience-grid .reveal-on-scroll:nth-child(2),
.gallery-grid .reveal-on-scroll:nth-child(2) {
  transition-delay: 0.08s;
}

.attractions-grid .reveal-on-scroll:nth-child(3),
.experience-grid .reveal-on-scroll:nth-child(3),
.gallery-grid .reveal-on-scroll:nth-child(3) {
  transition-delay: 0.16s;
}

.gallery-grid .reveal-on-scroll:nth-child(4) {
  transition-delay: 0.24s;
}

.not-found {
  display: grid;
  min-height: 72vh;
  width: min(720px, calc(100% - 2rem));
  margin: 0 auto;
  place-content: center;
  gap: 1rem;
  color: #0f172a;
}

.not-found h1 {
  margin: 0;
  font-size: 3rem;
  line-height: 1;
}

.not-found p:not(.section-kicker) {
  margin: 0;
  color: #475569;
  font-size: 1.05rem;
}

.tourism-detail-skeleton {
  display: grid;
  gap: 2rem;
  min-height: 100%;
  padding-bottom: 4rem;
  background: linear-gradient(180deg, #05070b 0%, #0b1018 42%, #f8fafc 42%, #f8fafc 100%);
}

.detail-skeleton-shell {
  display: grid;
  gap: 2rem;
  width: min(1180px, calc(100% - 2rem));
  margin: 0 auto;
}

.detail-skeleton-stats {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 1rem;
}

.detail-skeleton-split {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.detail-skeleton-gallery {
  grid-template-columns: 1.2fr 0.8fr 0.8fr;
  display: grid;
  grid-auto-rows: 180px;
  gap: 1rem;
}

.detail-skeleton-gallery__item:first-child {
  grid-row: span 2;
}

@media (max-width: 980px) {
  .detail-hero,
  .detail-hero__content {
    min-height: 560px;
  }

  .detail-hero__body,
  .summary-section,
  .split-section {
    grid-template-columns: 1fr;
  }

  .detail-hero h1 {
    font-size: 3.6rem;
  }

  .hero-panel {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .detail-fav-btn {
    grid-column: 1 / -1;
  }

  .attractions-grid,
  .experience-grid,
  .detail-skeleton-stats,
  .detail-skeleton-split {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .gallery-grid,
  .detail-skeleton-gallery {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .detail-hero,
  .detail-hero__content {
    min-height: 520px;
  }

  .detail-hero__content {
    width: min(100% - 1rem, 1180px);
    padding: 1rem 0 1.5rem;
  }

  .detail-hero h1 {
    font-size: 2.7rem;
  }

  .detail-subtitle {
    font-size: 1rem;
  }

  .hero-panel,
  .quick-facts,
  .attractions-grid,
  .experience-grid,
  .gallery-grid,
  .detail-skeleton-stats,
  .detail-skeleton-split,
  .detail-skeleton-gallery {
    grid-template-columns: 1fr;
  }

  .detail-content {
    width: min(100% - 1rem, 1180px);
    padding-top: 2rem;
  }

  .summary-section h2,
  .section-heading h2,
  .list-block h2 {
    font-size: 1.55rem;
  }

  .gallery-grid,
  .detail-skeleton-gallery {
    grid-auto-rows: 210px;
  }

  .gallery-item:first-child,
  .detail-skeleton-gallery__item:first-child {
    grid-row: span 1;
  }

  .detail-skeleton-shell {
    width: min(100% - 1rem, 1180px);
  }

  .not-found h1 {
    font-size: 2.35rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .back-link,
  .detail-fav-btn,
  .attraction-card,
  .attraction-card img,
  .experience-card,
  .gallery-item::after,
  .gallery-item img,
  .reveal-on-scroll {
    transition: none;
  }

  .reveal-on-scroll,
  .reveal-on-scroll.is-visible {
    opacity: 1;
    transform: none;
  }

}
</style>
