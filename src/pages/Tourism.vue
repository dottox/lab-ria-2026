<template>
  <div class="tourism-page">

      <div class="destinations-bento-grid">
        <div 
          v-for="destination in destinations" 
          :key="destination.id" 
          class="destination-card-wrapper"
          :style="getBentoStyles(destination.grid)"
        >
          <div 
            class="interactive-card" 
            :style="{ backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.4)), url(${destination.image})` }"
          >
            <button
              class="fav-btn"
              :class="{ 'fav-btn--active': isFavorited(destination.id) }"
              @click.stop="toggleDestinationFavorite(destination)"
            >
              {{ isFavorited(destination.id) ? '⭐' : '☆' }}
            </button>

            <div class="card-abbreviation">
              {{ destination.code }}
            </div>

            <div class="card-hover-content">
              <div class="hover-main-info">
                <div class="hover-left">
                  <h3 class="destination-name">{{ destination.name }}</h3>
                  <p class="destination-region">{{ destination.region }}</p>
                </div>
                <div class="hover-right">
                  <p class="destination-desc">{{ destination.description }}</p>
                </div>
              </div>
              
              <div class="hover-footer-info">
                <div class="highlights">
                  <span v-for="highlight in destination.highlights" :key="highlight" class="badge">
                    {{ highlight }}
                  </span>
                </div>
                <div class="meta-metrics">
                  <span><strong>Mejor:</strong> {{ destination.bestTime }}</span>
                  <span><strong>Distancia:</strong> {{ destination.distance }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useFavoriteToggle } from '@/composables/useFavoriteToggle'
import type { Favorite } from '@/stores/favorites'

interface GridConfig {
  colSpan: number
  rowSpan: number
  colStart?: number // Optional: For absolute column placement
  rowStart?: number // Optional: For absolute row placement
}

const { toggleFavorite, isFavorited } = useFavoriteToggle()

// Dynamic style generator for Bento grid cells
const getBentoStyles = (grid: GridConfig) => {
  const col = grid.colStart ? `${grid.colStart} / span ${grid.colSpan}` : `span ${grid.colSpan}`
  const row = grid.rowStart ? `${grid.rowStart} / span ${grid.rowSpan}` : `span ${grid.rowSpan}`
  
  return {
    gridColumn: col,
    gridRow: row
  }
}


interface Destination {
  id: string
  name: string
  region: string
  code: string
  image: string
  description: string
  highlights: string[]
  bestTime: string
  distance: string
  grid: GridConfig
}

const destinations = ref<Destination[]>([
  {
    id: 'dest-mvd',
    name: 'Montevideo',
    region: 'Capital',
    code: 'MVD',
    image: 'https://media.traveler.es/photos/613773e3d7c7024f9175f0b7/master/pass/119766.jpg',
    description: 'La vibrante capital que fusiona historia colonial con modernidad a lo largo de su famosa Rambla costanera.',
    highlights: ['La Rambla', 'Ciudad Vieja', 'Mercado del Puerto'],
    bestTime: 'Todo el año',
    distance: '0 km',
    grid: { colSpan: 3, rowSpan: 2 } // Bloque Horizontal Ancho
  },
  {
    id: 'dest-mald',
    name: 'Maldonado',
    region: 'Costa Sureste',
    code: 'MALD',
    image: 'https://preview.redd.it/punta-del-este-sobrevalorada-v0-sx26ioitjl7g1.jpeg?width=640&crop=smart&auto=webp&s=321bffcb946940c76f94bf56be6812d3a84f6f06',
    description: 'Hogar de Punta del Este y Piriápolis. Ofrece playas de nivel internacional, vida nocturna de lujo y paisajes serranos.',
    highlights: ['Casapueblo', 'Playa Mansa', 'Puerto de Yates'],
    bestTime: 'Dic - Feb',
    distance: '134 km',
    grid: { colSpan: 2, rowSpan: 3 } // Bloque Héroe (Grande)
  },
  {
    id: 'dest-col',
    name: 'Colonia',
    region: 'Litoral Oeste',
    code: 'COL',
    image: 'https://www.guruguay.com/wp-content/uploads/2021/05/colonia_del_sacramento_de_los_suspiros_street_night.png',
    description: 'Famoso por su casco histórico en Colonia del Sacramento, declarado Patrimonio de la Humanidad por la UNESCO.',
    highlights: ['Calle de los Suspiros', 'Faro', 'Bodegas'],
    bestTime: 'Mar - May',
    distance: '177 km',
    grid: { colSpan: 2, rowSpan: 3 } // Bloque Vertical Alto
  },
  {
    id: 'dest-rch',
    name: 'Rocha',
    region: 'Costa Este',
    code: 'RCH',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop',
    description: 'Playas oceánicas agrestes, dunas gigantes, lagunas protegidas y pueblos mágicos como Cabo Polonio y Punta del Diablo.',
    highlights: ['Cabo Polonio', 'Palmares', 'Valizas'],
    bestTime: 'Dic - Mar',
    distance: '210 km',
    grid: { colSpan: 1, rowSpan: 4 } // Bloque Estándar
  },
  {
    id: 'dest-can',
    name: 'Canelones',
    region: 'Sur / Metropolitana',
    code: 'CAN',
    image: 'https://images.unsplash.com/photo-1516594798947-e65505dbb29d?q=80&w=800&auto=format&fit=crop',
    description: 'Epicentro del enoturismo y del vino Tannat en Uruguay, rodeado de playas familiares en la Costa de Oro.',
    highlights: ['Ruta del Vino', 'Atlantis', 'Costa de Oro'],
    bestTime: 'Dic - Mar',
    distance: '45 km',
    grid: { colSpan: 2, rowSpan: 2 }
  },
  {
    id: 'dest-slt',
    name: 'Salto',
    region: 'Litoral Norte',
    code: 'SLT',
    image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?q=80&w=800&auto=format&fit=crop',
    description: 'Tierra de aguas termales curativas. Ideal para el relax familiar y actividades de bienestar junto al Río Uruguay.',
    highlights: ['Termas del Daymán', 'Arapey', 'Represa Salto Grande'],
    bestTime: 'Jun - Ago',
    distance: '496 km',
    grid: { colSpan: 2, rowSpan: 2 } // Bloque Vertical Alto
  },
  {
    id: 'dest-pay',
    name: 'Paysandú',
    region: 'Litoral Norte',
    code: 'PAY',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=800&auto=format&fit=crop',
    description: 'Destacado por sus centros termales, su rica historia industrial y la icónica Meseta de Artigas frente al río.',
    highlights: ['Termas de Guaviyú', 'Meseta de Artigas', 'Chajá'],
    bestTime: 'May - Sep',
    distance: '378 km',
    grid: { colSpan: 1, rowSpan: 2 } // Bloque Horizontal Ancho
  },
  {
    id: 'dest-lav',
    name: 'Lavalleja',
    region: 'Sierras del Sureste',
    code: 'LAV',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop',
    description: 'Paisajes de sierras, valles misteriosos y cerros ideales para el ecoturismo y el descanso en la naturaleza.',
    highlights: ['Villa Serrana', 'Cerro del Verdún', 'Minas'],
    bestTime: 'Sep - Nov',
    distance: '120 km',
    grid: { colSpan: 2, rowSpan: 1 }
  },
  {
    id: 'dest-tac',
    name: 'Tacuarembó',
    region: 'Centro Norte',
    code: 'TAC',
    image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=800&auto=format&fit=crop',
    description: 'Cuna de la cultura gaucha y de Carlos Gardel. Paisajes de quebradas, cerros chatos y folklore uruguayo.',
    highlights: ['Valle Edén', 'Fiesta de la Patria Gaucha', 'San Gregorio'],
    bestTime: 'Mar - Nov',
    distance: '390 km',
    grid: { colSpan: 1, rowSpan: 2 }
  },
  {
    id: 'dest-riv',
    name: 'Rivera',
    region: 'Norte / Frontera',
    code: 'RIV',
    image: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?q=80&w=800&auto=format&fit=crop',
    description: 'Frontera de paz con Brasil. Combina turismo de compras en Free Shops con la naturaleza del Valle del Lunarejo.',
    highlights: ['Valle del Lunarejo', 'Turismo de Compras', 'Plaza Internacional'],
    bestTime: 'Sep - Nov',
    distance: '500 km',
    grid: { colSpan: 2, rowSpan: 2 }
  },
  {
    id: 'dest-art',
    name: 'Artigas',
    region: 'Extremo Norte',
    code: 'ART',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=800&auto=format&fit=crop',
    description: 'Famoso mundialmente por sus minas de ágatas y amatistas, además de su vibrante carnaval al estilo brasileño.',
    highlights: ['Minas de Amatistas', 'Carnaval de Artigas', 'Piedra Pintada'],
    bestTime: 'Feb - May',
    distance: '600 km',
    grid: { colSpan: 1, rowSpan: 2 }
  },
  {
    id: 'dest-rn',
    name: 'Río Negro',
    region: 'Litoral Oeste',
    code: 'RN',
    image: 'https://www.rionegro.gub.uy/wp-content/uploads/2022/10/Anglo-Fotros-Aereas-9-scaled.jpg',
    description: 'Hogar del Paisaje Industrial Fray Bentos (ex Anglo), patrimonio UNESCO, y el balneario de río Las Cañas.',
    highlights: ['Anglo UNESCO', 'Balneario Las Cañas', 'San Javier'],
    bestTime: 'Nov - Mar',
    distance: '309 km',
    grid: { colSpan: 3, rowSpan: 1 } // Bloque Horizontal Ancho
  },
  {
    id: 'dest-sor',
    name: 'Soriano',
    region: 'Litoral Oeste',
    code: 'SOR',
    image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=800&auto=format&fit=crop',
    description: 'Conocido como la "Coqueta del Hum" por el Río Negro. Ideal para el turismo náutico, pesca e historia colonial.',
    highlights: ['Rambla de Mercedes', 'Villa Soriano', 'Castillo Mauá'],
    bestTime: 'Sep - Nov',
    distance: '278 km',
    grid: { colSpan: 2, rowSpan: 1 }
  },
  {
    id: 'dest-sj',
    name: 'San José',
    region: 'Sur',
    code: 'SJ',
    image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=800&auto=format&fit=crop',
    description: 'Ofrece turismo rural e histórico en su capital, junto a las playas fluviales con barrancos naturales sobre el Río de la Plata.',
    highlights: ['Balneario Kiyú', 'Boca del Cufré', 'Sierra de Mahoma'],
    bestTime: 'Nov - Mar',
    distance: '90 km',
    grid: { colSpan: 2, rowSpan: 2 }
  },
  {
    id: 'dest-dur',
    name: 'Durazno',
    region: 'Centro',
    code: 'DUR',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=800&auto=format&fit=crop',
    description: 'El corazón geográfico del país. Famoso por sus playas de río, sus extensos bosques y festivales masivos de música folk.',
    highlights: ['Playa El Elías', 'Parque de la Hispanidad', 'Río Yi'],
    bestTime: 'Dic - Feb',
    distance: '183 km',
    grid: { colSpan: 1, rowSpan: 2 }
  },
  {
    id: 'dest-frs',
    name: 'Flores',
    region: 'Centro Oeste',
    code: 'FRS',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800&auto=format&fit=crop',
    description: 'Destaca por el Geoparque Grutas del Palacio, un área protegida por la UNESCO con formaciones rocosas únicas.',
    highlights: ['Grutas del Palacio', 'Lagos del Andrésito', 'Chamangá'],
    bestTime: 'Sep - Nov',
    distance: '189 km',
    grid: { colSpan: 1, rowSpan: 3 }
  },
  {
    id: 'dest-fld',
    name: 'Florida',
    region: 'Sur Centro',
    code: 'FLD',
    image: 'https://images.unsplash.com/photo-1546482481-92cd53da2966?q=80&w=800&auto=format&fit=crop',
    description: 'Tierra histórica donde se declaró la independencia nacional. Combina estancias turísticas de la cuenca lechera con fe religiosa.',
    highlights: ['Piedra Alta', 'San Cono', 'Ruta de la Leche'],
    bestTime: 'Todo el año',
    distance: '98 km',
    grid: { colSpan: 1, rowSpan: 3 }
  },
  {
    id: 'dest-tyt',
    name: 'Treinta y Tres',
    region: 'Este',
    code: 'TYT',
    image: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?q=80&w=800&auto=format&fit=crop',
    description: 'Famoso por albergar la Quebrada de los Cuervos, un impactante accidente geográfico ideal para senderismo de aventura.',
    highlights: ['Quebrada de los Cuervos', 'Río Olimar', 'Arrozales'],
    bestTime: 'Sep - Nov',
    distance: '286 km',
    grid: { colSpan: 2, rowSpan: 1 } // Bloque Horizontal Ancho
  },
  {
    id: 'dest-cl',
    name: 'Cerro Largo',
    region: 'Noreste',
    code: 'CL',
    image: 'https://images.unsplash.com/photo-1472214222541-d510753a8707?q=80&w=800&auto=format&fit=crop',
    description: 'Un rincón con fuerte herencia criolla y fronteriza, célebre por sus carnavales y la histórica Posta del Chuy.',
    highlights: ['Posta del Chuy', 'Melo', 'Balneario Lago Merín'],
    bestTime: 'Oct - Mar',
    distance: '387 km',
    grid: { colSpan: 3, rowSpan: 1 }
  }
])

const createFavorite = (destination: Destination): Favorite => ({
  id: destination.id,
  type: 'tourism',
  title: destination.name,
  description: destination.region,
  savedAt: Date.now(),
})

const toggleDestinationFavorite = (destination: Destination) => {
  toggleFavorite(createFavorite(destination))
}
</script>

<style scoped>

.tourism-page {
  padding: 0 0;
  background-color: black !important;
}

.page-title {
  margin: 0 0 0.5rem 0;
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-primary);
}

.page-subtitle {
  margin: 0 0 2rem 0;
  font-size: 1rem;
  color: var(--color-text-muted);
}

/* BENTO GRID SETUP
  Auto-flow: dense makes sure smaller blocks fill in gaps left by larger blocks. 
*/
.destinations-bento-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr); /* Desktop: 4 columns */
  grid-auto-rows: 250px; /* Base unit height for rows */
  grid-auto-flow: dense;
}

.destination-card-wrapper {
  width: 100%;
  height: 100%;
}

.interactive-card {
  position: relative;
  width: 100%;
  height: 100%; /* Now stretches to fit its Bento cell */
  background-size: cover;
  background-position: center;
  border: 1px solid var(--color-border);
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform var(--transition-base, 0.3s), box-shadow var(--transition-base, 0.3s);
}

.interactive-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 20px -3px rgba(0, 0, 0, 0.15);
}

.card-abbreviation {
  font-size: 3.5rem;
  font-weight: 800;
  color: #ffffff;
  letter-spacing: 4px;
  text-shadow: 0 4px 12px rgba(0, 0, 0, 0.6);
  opacity: 1;
  transform: scale(1);
  transition: opacity var(--transition-base, 0.3s), transform var(--transition-base, 0.3s);
}

.interactive-card:hover .card-abbreviation {
  opacity: 0;
  transform: scale(0.9);
}
.card-hover-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  

  backdrop-filter: blur(3px);
  -webkit-backdrop-filter: blur(3px);

  border-top: 1px solid rgba(255, 255, 255, 0.3); /* Borde sutil más integrado */
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  transform: translateY(101%);
  transition: transform var(--transition-slow, 0.4s);
  max-height: 100%;
  overflow-y: auto; 
}

.interactive-card:hover .card-hover-content {
  transform: translateY(0);
}

.hover-main-info {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}

.hover-left {
  flex: 1;
  min-width: 0;
}

.destination-name {
  margin: 0;
  font-size: 1.4rem;
  font-weight: 700;
  font-family: Georgia, 'Times New Roman', Times, serif;
  color: white;
}

.destination-region {
  margin: 0.25rem 0 0 0;
  font-size: 0.85rem;
  color: white;
  font-weight: 500;
}

.hover-right {
  flex: 1.5;
  text-align: right;
}

.destination-desc {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.5;
  color: white;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.hover-footer-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 0.75rem;
  border-top: 1px solid var(--color-border-light, #eee);
  flex-wrap: wrap;
  gap: 0.5rem;
}

.highlights {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.badge {
  padding: 0.25rem 0.6rem;
  background-color: color-mix(in srgb, var(--color-primary-light) 80%, transparent);
  color: var(--color-primary, #0284c7);
  border-radius: var(--radius-sm, 4px);
  font-size: 0.75rem;
  font-weight: 600;
}

.meta-metrics {
  display: flex;
  gap: 1rem;
  font-size: 0.85rem;
  color: #BBB;
}

.fav-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 10;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  cursor: pointer;
  transition: transform var(--transition-fast, 0.2s), background-color var(--transition-fast, 0.2s);
}

.fav-btn:hover {
  transform: scale(1.1);
  background: rgba(255, 255, 255, 0.4);
}

.fav-btn--active {
  background: white !important;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
}

/* RESPONSIVE DESIGN - BREAKDOWN TO TABLET */
@media (max-width: 1024px) {
  .destinations-bento-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  /* Force items that took up > 2 columns to fit the new 2 column max */
  .destination-card-wrapper {
    grid-column: span min(var(--col-span, 2), 2) !important;
  }
}

/* RESPONSIVE DESIGN - BREAKDOWN TO MOBILE */
@media (max-width: 768px) {
  .destinations-bento-grid {
    grid-template-columns: 1fr;
    grid-auto-rows: auto; /* Let content dictate height on mobile */
  }

  /* Flatten the Bento to a single column on small screens */
  .destination-card-wrapper {
    grid-column: 1 / -1 !important;
    grid-row: span 1 !important;
  }

  .interactive-card {
    height: auto;
    min-height: 360px;
    flex-direction: column;
    justify-content: flex-start;
    padding-top: 3.5rem;
  }

  .card-abbreviation {
    font-size: 2.5rem;
    margin-bottom: auto;
  }

  .card-hover-content {
    position: relative;
    transform: translateY(0);
    width: 100%;
    padding: 1rem;
  }

  .hover-main-info {
    flex-direction: column;
    gap: 0.75rem;
  }

  .hover-right {
    text-align: left;
  }

  .hover-footer-info {
    flex-direction: column;
    align-items: flex-start;
  }

  .meta-metrics {
    width: 100%;
    justify-content: space-between;
  }
}
</style>
