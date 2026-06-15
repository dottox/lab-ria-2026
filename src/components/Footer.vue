<template>
  <footer class="footer">
    <div class="container--main">
      <div class="footer__content">
        <div class="footer__section">
          <h3 class="footer__heading">Sobre</h3>
          <p class="footer__text">Aprende sobre los eventos, transporte, clima y estadísticas de Uruguay a través de este portal informativo.</p>
        </div>
        <div class="footer__section">
          <h3 class="footer__heading">Fuentes de datos</h3>
          <p class="footer__text">Información del transporte aportada por IMM MontevideoAPI.</p>
        </div>
        <div class="footer__section">
          <h3 class="footer__heading">Links</h3>
          <ul class="footer__links">
            <li><router-link to="/events">Eventos</router-link></li>
            <li><router-link to="/tourism">Turismo</router-link></li>
            <li><router-link to="/climate">Clima</router-link></li>
            <li><router-link to="/statistics">Estadisticas</router-link></li>
          </ul>
        </div>
      </div>
      <div class="footer__bottom">
        <p>&copy; 2026 Portal de Información Uruguaya. Todos los derechos reservados.</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
</script>

<style scoped>
.footer {
  background-color: var(--color-surface);
  color: var(--color-foreground);
  padding: 3rem 0 1rem;
  margin-top: auto;
  border-top: 1px solid var(--color-border);
  transition: background-color var(--transition-slow), border-color var(--transition-slow);
}

.footer__content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.footer__section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.footer__heading {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-foreground);
}

.footer__text {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.5;
  color: var(--color-text-muted);
}

.footer__links {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.footer__links a {
  color: var(--color-text-secondary);
  text-decoration: none;
  font-size: 0.95rem;
  transition: all var(--transition-base);
}

.footer__links a:hover {
  color: var(--color-primary);
  text-decoration: underline;
}

.footer__bottom {
  text-align: center;
  padding-top: 1.5rem;
  border-top: 1px solid var(--color-border);
  font-size: 0.9rem;
  color: var(--color-text-muted);
}

.footer__bottom p {
  margin: 0;
}

@media (max-width: 640px) {
  .footer {
    padding: 2rem 0 1rem;
  }

  .footer__content {
    gap: 1.5rem;
  }
}
</style>
