# Documentación de requisitos del proyecto

Este documento resume el estado de cumplimiento de los requisitos solicitados para la aplicación Vue/Vite sobre Uruguay. La evidencia se indica con archivos y líneas aproximadas del código fuente.

## Resumen general

| Requisito                              | Estado  |
| -------------------------------------- | ------- |
| Múltiples vistas utilizando Vue Router | Cumple  |
| Componentes reutilizables              | Cumple  |
| Layout responsive                      | Cumple  |
| Consumo de al menos una API externa    | Cumple  |
| Render dinámico de información         | Cumple  |
| Formularios interactivos               | Cumple  |
| Búsqueda o filtrado dinámico           | Parcial |
| Manejo de estados compartidos          | Cumple  |
| Persistencia frontend                  | Cumple  |
| Arquitectura organizada del proyecto   | Cumple  |

## 1. Múltiples vistas utilizando Vue Router

**Estado:** Cumple.

La aplicación utiliza Vue Router con varias rutas principales y carga diferida de páginas:

- `src/router/index.ts:3-37`: define las rutas `/`, `/tourism`, `/climate`, `/events`, `/statistics`, `/favorites` y una redirección fallback.
- `src/router/index.ts:40-43`: crea el router con `createWebHistory()`.
- `src/main.ts:10-11`: registra Pinia y Vue Router en la aplicación.
- `src/App.vue`: renderiza la vista activa mediante `<router-view>`.

**Vistas detectadas:**

- `src/pages/Home.vue`
- `src/pages/Tourism.vue`
- `src/pages/Climate.vue`
- `src/pages/Events.vue`
- `src/pages/Statistics.vue`
- `src/pages/Favorites.vue`

## 2. Componentes reutilizables

**Estado:** Cumple.

El proyecto separa piezas de interfaz reutilizables dentro de `src/components`.

**Evidencia:**

- `src/components/Card.vue:1-21`: componente genérico de tarjeta con props `title` y `description`, más slots para header, body y footer.
- `src/components/Header.vue:1-41`: cabecera reutilizable con navegación, menú responsive, favoritos y cambio de tema.
- `src/components/EventMap.vue`: componente de mapa reutilizable para eventos y paradas.
- `src/components/Footer.vue`, `Button.vue`, `LoadingSpinner.vue`, `ErrorAlert.vue`: componentes auxiliares.

**Uso de componentes:**

- `src/pages/Climate.vue:42-61`: usa `Card` para mostrar el clima por región.
- `src/pages/Climate.vue:72-94`: usa `Card` para estaciones.
- `src/pages/Favorites.vue:37-65`: usa `Card` para cada favorito.
- `src/pages/Events.vue:85-91`: usa `EventMap`.

## 3. Layout responsive

**Estado:** Cumple.

La aplicación incluye reglas responsive mediante grids fluidos, flexbox y media queries.

**Evidencia:**

- `src/components/Header.vue:223-304`: el menú cambia a navegación desplegable en pantallas chicas.
- `src/pages/Tourism.vue:362-367`: grilla bento de 4 columnas para escritorio.
- `src/pages/Tourism.vue:539-548`: adapta la grilla a tablet.
- `src/pages/Tourism.vue:551-601`: adapta la grilla a una columna en mobile.
- `src/pages/Climate.vue:233-236`: facts en grid con `auto-fit`.
- `src/pages/Climate.vue:273-277`: estaciones en grid responsive.
- `src/pages/Climate.vue:314-317`: tarjetas de clima en grid responsive.
- `src/pages/Climate.vue:337-368`: layout mobile para clima.
- `src/pages/Favorites.vue`: grilla de favoritos y filtros adaptables.

## 4. Consumo de al menos una API externa

**Estado:** Cumple.

La aplicación consume Open-Meteo para mostrar clima en tiempo real.

**Evidencia principal:**

- `src/services/weatherService.ts:32-71`: función `getWeather()` construye parámetros y hace `fetch` a `https://api.open-meteo.com/v1/forecast`.
- `src/composables/useWeather.ts:49-63`: llama a `getWeather()` para varias regiones.
- `src/composables/useWeather.ts:84`: dispara la carga al montar el componente.
- `src/pages/Climate.vue:42-61`: renderiza loading, error y datos recibidos de la API.

**API adicional:**

- `vite.config.ts:5-7`: configuración de URLs para API de transporte de Montevideo.
- `src/services/montevideoTransport.ts`: servicio para transporte público, paradas y próximos buses.
- `src/pages/Events.vue:337-369`: busca recomendaciones de transporte cuando hay ubicación del usuario y credenciales configuradas.

## 5. Render dinámico de información

**Estado:** Cumple.

La información se renderiza de forma dinámica con `v-for`, `v-if`, `computed`, estados reactivos y datos cargados desde servicios o estructuras locales.

**Evidencia:**

- `src/pages/Climate.vue:31-35`: render dinámico de facts con `v-for`.
- `src/pages/Climate.vue:42-61`: render condicional de carga, error y clima por región.
- `src/pages/Climate.vue:67-95`: render dinámico de estaciones.
- `src/pages/Tourism.vue:5-52`: render de destinos turísticos con `v-for`.
- `src/pages/Tourism.vue:11-13`: imagen de fondo dinámica por destino.
- `src/pages/Tourism.vue:40-42`: render de destacados por destino.
- `src/pages/Events.vue:18-70`: evento destacado depende de `selectedEvent`.
- `src/pages/Events.vue:194-235`: grilla dinámica de eventos.
- `src/pages/Favorites.vue:7-68`: estado vacío o lista de favoritos según datos guardados.

## 6. Formularios interactivos

**Estado:** Cumple.

Existe un formulario para agregar comentarios sobre un evento en específico.

- `src/components/EventComments` : formulario con input de autor (opcional) y textarea de texto.
- `src/components/EventComments` : botón de envío deshabilitado si el campo de texto está vacío.
- `src/composables/useComments.ts` : lógica de alta y persistencia de comentarios en localStorage por evento, con clave comments-{eventId}.
- `src/pages/Events.vue` : renderiza EventComments pasando el eventId del evento seleccionado, por lo que los comentarios cambian al seleccionar otro evento.

## 7. Búsqueda o filtrado dinámico

**Estado:** Cumple.

La aplicación implementa búsqueda y filtrado dinámico en múltiples páginas.

**Evidencia:**

- `src/pages/Events.vue`: input de búsqueda que filtra los eventos en tiempo real por nombre, descripción, venue, barrio, categoría y tags.
- `src/pages/Favorites.vue:15-25`: botones de filtro por tipo generados con `v-for`.
- `src/pages/Favorites.vue:82-85`: estado reactivo del filtro activo y lista de tipos.
- `src/pages/Favorites.vue:87-92`: `filteredFavorites` filtra según el tipo seleccionado.
- `src/pages/Favorites.vue:94-99`: cálculo dinámico de cantidades por tipo.
- `src/stores/transport.ts`: filtros de origen y destino con persistencia en `sessionStorage`.

## 8. Manejo de estados compartidos

**Estado:** Cumple.

La aplicación usa Pinia para compartir estado entre componentes y páginas.

**Evidencia:**

- `src/main.ts:1-11`: importa `createPinia()` y lo registra con `app.use(createPinia())`.
- `src/stores/favorites.ts:75-131`: store global de favoritos.
- `src/stores/theme.ts`: store global de tema claro/oscuro.
- `src/stores/transport.ts`: store global de horarios/filtros de transporte.
- `src/components/Header.vue:45-53`: lee favoritos desde el store para mostrar el contador en navegación.
- `src/pages/Favorites.vue:79-84`: consume el store de favoritos.
- `src/composables/useFavoriteToggle.ts`: encapsula la lógica de agregar/quitar favoritos usando el store.

## 9. Persistencia frontend

**Estado:** Cumple.

El proyecto persiste datos en `localStorage` y `sessionStorage`.

**Evidencia:**

- `src/stores/favorites.ts:78-93`: carga favoritos desde `localStorage`.
- `src/stores/favorites.ts:96-98`: guarda favoritos en `localStorage`.
- `src/stores/favorites.ts:117-120`: limpia favoritos de `localStorage`.
- `src/stores/theme.ts`: guarda y recupera el tema desde `localStorage`.
- `src/pages/Events.vue:300-306`: guarda el evento seleccionado en `sessionStorage`.
- `src/pages/Events.vue:421-425`: recupera el evento seleccionado desde `sessionStorage`.
- `src/stores/transport.ts`: guarda filtros de origen y destino en `sessionStorage`.

Además, `src/stores/favorites.ts:47-73` normaliza favoritos para que datos antiguos o incompletos no rompan la página.

## 10. Arquitectura organizada del proyecto

**Estado:** Cumple.

El proyecto está organizado por responsabilidades y separa páginas, componentes, stores, servicios, composables, datos y utilidades.

**Estructura relevante:**

```text
src/
  App.vue
  main.ts
  router/
    index.ts
  pages/
    Home.vue
    Tourism.vue
    Climate.vue
    Events.vue
    Statistics.vue
    Favorites.vue
  components/
    Header.vue
    Footer.vue
    Card.vue
    Button.vue
    EventMap.vue
    LoadingSpinner.vue
    ErrorAlert.vue
  stores/
    favorites.ts
    theme.ts
    transport.ts
  services/
    weatherService.ts
    montevideoTransport.ts
  composables/
    useWeather.ts
    useFavoriteToggle.ts
  data/
    events.ts
  utils/
    seasons.ts
  styles/
    globals.css
```

**Evidencia:**

- `src/router/index.ts`: configuración de rutas.
- `src/pages/`: vistas principales.
- `src/components/`: componentes reutilizables.
- `src/stores/`: estado compartido.
- `src/services/`: consumo y normalización de APIs.
- `src/composables/`: lógica reutilizable de composición.
- `src/data/`: datos locales estructurados.
- `src/utils/`: utilidades.

## Verificación técnica

Se ejecutó:

```bash
npm run build
```

**Resultado:** build completada correctamente. Solo aparece una advertencia de Node relacionada con `postcss.config.js` y el campo `"type": "module"` en `package.json`; no bloquea la compilación ni está relacionada con los requisitos funcionales.

## Conclusión

El proyecto cumple la mayoría de los requisitos solicitados. El único punto marcado como parcial es **Formularios interactivos**, porque existen interacciones y controles, pero no un formulario HTML completo con inputs y submit. Para dejar ese requisito completamente cubierto, se recomienda agregar un formulario simple, por ejemplo:

- búsqueda textual de eventos o destinos,
- formulario de contacto,
- formulario para planificar una visita,
- formulario de preferencias turísticas.
