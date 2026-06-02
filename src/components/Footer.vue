<template>
  <footer class="footer">
    <div class="container--main">
      <div class="footer__content">
        <div class="footer__section">
          <h3 class="footer__heading">About</h3>
          <p class="footer__text">Learn about Uruguay's climate, tourism, transport, and events through this comprehensive information portal.</p>
        </div>
        <div class="footer__section">
          <h3 class="footer__heading">Data Source</h3>
          <p class="footer__text">Transport information powered by UruguayAPI. Other data provided for educational purposes.</p>
        </div>
        <div class="footer__section">
          <h3 class="footer__heading">Quick Links</h3>
          <ul class="footer__links">
            <li><router-link to="/transport">Transport</router-link></li>
            <li><router-link to="/tourism">Tourism</router-link></li>
            <li><router-link to="/climate">Climate</router-link></li>
            <li><router-link to="/events">Events</router-link></li>
          </ul>
        </div>
      </div>
      <div class="footer__bottom">
        <p>&copy; 2026 Uruguay Information Portal. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
</script>

<style scoped>
.footer {
  background-color: var(--color-foreground);
  color: white;
  padding: 3rem 0 1rem;
  margin-top: auto;
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
}

.footer__text {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.5;
  opacity: 0.85;
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
  color: white;
  text-decoration: none;
  font-size: 0.95rem;
  opacity: 0.85;
  transition: opacity 0.3s ease;
}

.footer__links a:hover {
  opacity: 1;
  text-decoration: underline;
}

.footer__bottom {
  text-align: center;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 0.9rem;
  opacity: 0.7;
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
