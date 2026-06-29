# Portal de Informacion de Uruguay

SPA desarrollada con Vue 3, Vite, TypeScript, Vue Router y Pinia para explorar informacion publica de Uruguay: eventos, turismo, clima, estadisticas y favoritos.

## Requisitos

- Node.js 22 o compatible
- npm

## Instalacion

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

Abrir:

```text
http://localhost:3000
```

## Produccion

```bash
npm run build
npm run preview
```

## Variables opcionales

Para habilitar recomendaciones reales de transporte de Montevideo, crear `.env.local` con:

```bash
MONTEVIDEO_TRANSPORT_CLIENT_ID=your-client-id-here
MONTEVIDEO_TRANSPORT_CLIENT_SECRET=your-client-secret-here
```

Sin esas variables, la app sigue funcionando y solo se deshabilita el buscador de transporte.

## Documentacion

- Fuente editable: `documentacion.md`
- Version PDF: `documentacion.pdf`
- Capturas: `docs/screenshots/`

## Scripts

```bash
npm run dev      # servidor Vite
npm run build    # build de produccion
npm run preview  # preview del build
npm run lint     # lint del proyecto
```
