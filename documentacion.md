# Documentacion del proyecto

## Objetivo de la aplicacion

La aplicacion es una SPA desarrollada con Vue.js sobre informacion publica de Uruguay. Su objetivo es centralizar en una interfaz navegable datos de turismo, eventos, clima, estadisticas y favoritos, aplicando arquitectura frontend moderna, componentes reutilizables, estado compartido, persistencia en navegador y consumo de APIs externas.

La tematica elegida corresponde a **Informacion publica**.

## Tecnologias utilizadas

- Vue 3 con Composition API.
- Vite como entorno de desarrollo y build.
- TypeScript para tipado del codigo.
- Vue Router para navegacion entre vistas.
- Pinia para estado compartido.
- CSS moderno con variables, flexbox, grid, media queries y clases con metodologia BEM.
- localStorage y sessionStorage para persistencia frontend.
- Leaflet para mapa interactivo en eventos.
- APIs externas: Open-Meteo para clima y Montevideo API para transporte publico cuando hay credenciales configuradas.
- Datos locales estructurados para turismo, eventos y estadisticas simuladas.

## Estructura general del proyecto

```text
src/
  App.vue
  main.ts
  router/
    index.ts
  pages/
    Home.vue
    Events.vue
    Tourism.vue
    TourismDetail.vue
    Climate.vue
    Statistics.vue
    Favorites.vue
  components/
    Header.vue
    Footer.vue
    Card.vue
    Button.vue
    EventMap.vue
    EventComments.vue
    CurrencyRates.vue
    HomicidesStats.vue
    skeleton/
  composables/
    useWeather.ts
    useCurrency.ts
    useHomicides.ts
    useComments.ts
    useFavoriteToggle.ts
    useMinimumLoading.ts
    useRevealOnScroll.ts
  stores/
    favorites.ts
    theme.ts
    transport.ts
  services/
    weatherService.ts
    montevideoTransport.ts
    currencyService.ts
    homicidesService.ts
    mockApi.ts
  data/
    events.ts
    tourism.ts
    api/
  styles/
    globals.css
  utils/
    seasons.ts
```

La organizacion separa vistas, componentes visuales, estado global, servicios de datos, composables reutilizables y datos locales.

## Decisiones arquitectonicas relevantes

- **SPA con rutas diferidas:** `src/router/index.ts` define las rutas principales y carga las paginas con imports dinamicos.
- **Estado compartido con Pinia:** favoritos, tema visual y filtros/datos de transporte viven en stores reutilizables.
- **Persistencia integrada a la experiencia:** favoritos, tema, cache de cotizaciones, cache de homicidios y comentarios se guardan en localStorage; filtros temporales de transporte y evento seleccionado se guardan en sessionStorage.
- **Servicios separados de la interfaz:** las llamadas a APIs se concentran en `src/services/`, evitando mezclar fetch y renderizado.
- **Composables para logica reutilizable:** carga de clima, cache de cotizaciones, comentarios, favoritos, loading minimo y animaciones se desacoplan de los componentes.
- **CSS mantenible con BEM:** bloques como `events-hero`, `spotlight`, `comment-card`, `currency-rates`, `skeleton-card` y `nav__link--favorites` organizan estilos por responsabilidad.
- **Datos locales estructurados:** eventos y turismo usan archivos en `src/data/`, lo que simplifica render dinamico sin depender de una API para todo.
- **Fallback controlado:** las cotizaciones y homicidios usan servicios simulados con cache para demostrar consumo asincronico y persistencia sin depender de disponibilidad externa.

## Organizacion de componentes

- `Header.vue` y `Footer.vue`: layout comun de la aplicacion.
- `Card.vue` y `Button.vue`: componentes visuales base reutilizados en varias vistas.
- `EventMap.vue`: mapa de evento, ubicacion del usuario y paradas recomendadas.
- `EventComments.vue`: formulario de comentarios por evento.
- `CurrencyRates.vue`: render de cotizaciones con loading, error, refresco y cache.
- `HomicidesStats.vue`: visualizacion dinamica de datos estadisticos.
- `components/skeleton/`: componentes de carga reutilizables para cards, grids, charts, listas y heroes.

Las vistas de `src/pages/` componen estos bloques segun cada seccion de la aplicacion.

## Organizacion de stores

- `favorites.ts`: guarda, normaliza, agrega, elimina y consulta favoritos. Persiste en `localStorage`.
- `theme.ts`: administra tema claro/oscuro, detecta preferencia del sistema y persiste en `localStorage`.
- `transport.ts`: administra horarios, loading, errores y filtros temporales de origen/destino. Persiste filtros en `sessionStorage`.

Esta separacion evita pasar estado global manualmente entre componentes.

## Organizacion de composables

- `useWeather.ts`: carga clima de varias regiones y expone estado de loading/error por region.
- `useCurrency.ts`: carga cotizaciones simuladas, guarda cache y usa fallback desde `localStorage`.
- `useHomicides.ts`: carga estadisticas simuladas y cachea la ultima respuesta valida.
- `useComments.ts`: administra comentarios por evento y los persiste en `localStorage`.
- `useFavoriteToggle.ts`: encapsula la logica de agregar/quitar favoritos usando el store.
- `useMinimumLoading.ts`: evita parpadeos visuales en pantallas con skeleton.
- `useRevealOnScroll.ts`: encapsula animaciones de entrada al hacer scroll.

## Funcionalidades principales

- Navegacion por multiples vistas: inicio, eventos, turismo, detalle turistico, clima, estadisticas y favoritos.
- Render dinamico con `v-for`, `v-if`, propiedades computadas y datos reactivos.
- Busqueda y filtrado de eventos y favoritos.
- Formulario interactivo de comentarios en eventos.
- Favoritos persistentes para eventos y destinos turisticos.
- Tema claro/oscuro persistente.
- Clima actual por regiones mediante Open-Meteo.
- Mapa y recomendacion de transporte para eventos.
- Layout responsive en desktop, tablet y mobile.

## Instrucciones de ejecucion

Requisitos:

- Node.js 22 o compatible.
- npm.

Instalacion:

```bash
npm install
```

Ejecucion en desarrollo:

```bash
npm run dev
```

La aplicacion queda disponible en:

```text
http://localhost:3000
```

Build de produccion:

```bash
npm run build
```

Previsualizacion del build:

```bash
npm run preview
```

Variables opcionales para transporte publico:

```bash
MONTEVIDEO_TRANSPORT_CLIENT_ID=your-client-id-here
MONTEVIDEO_TRANSPORT_CLIENT_SECRET=your-client-secret-here
```

Si estas credenciales no estan configuradas, el resto de la aplicacion funciona y la seccion de recomendacion de transporte informa que el buscador no esta disponible.