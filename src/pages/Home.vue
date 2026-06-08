<template>
  <div class="home-page">
    <div class="container--main">
      <section class="hero">
        <h2 class="hero__title">Welcome to Uruguay</h2>
        <p class="hero__subtitle">Discover climate, tourism, transport, events, and statistics about South America's most developed nation</p>
        <div class="hero__cta">
          <router-link to="/events" class="btn--primary">Explore Events</router-link>
          <router-link to="/tourism" class="btn--secondary">Discover Tourism</router-link>
        </div>
      </section>

      <section class="features">
        <h2 class="features__title">Explore Uruguay</h2>
        <div class="features__grid">
          <router-link to="/tourism" class="feature-card">
            <div class="feature-card__icon">🏖️</div>
            <h3 class="feature-card__title">Tourism</h3>
            <p class="feature-card__text">Discover popular destinations and attractions</p>
          </router-link>

          <router-link to="/climate" class="feature-card">
            <div class="feature-card__icon">🌤️</div>
            <h3 class="feature-card__title">Climate</h3>
            <p class="feature-card__text">Learn about Uruguay's temperate climate</p>
          </router-link>

          <router-link to="/events" class="feature-card">
            <div class="feature-card__icon">🎉</div>
            <h3 class="feature-card__title">Events</h3>
            <p class="feature-card__text">Stay updated with cultural and seasonal events</p>
          </router-link>

          <router-link to="/statistics" class="feature-card">
            <div class="feature-card__icon">📊</div>
            <h3 class="feature-card__title">Statistics</h3>
            <p class="feature-card__text">Explore population, economy, and key data</p>
          </router-link>

          <router-link to="/favorites" class="feature-card">
            <div class="feature-card__icon">⭐</div>
            <h3 class="feature-card__title">Favorites</h3>
            <p class="feature-card__text">View your saved items and preferences</p>
          </router-link>
        </div>
      </section>

      <section class="info-section">
        <h2 class="info-section__title">About Uruguay</h2>
        <div class="info-section__content">
          <div class="info-block">
            <h3 class="info-block__title">Capital</h3>
            <p class="info-block__text">Montevideo</p>
          </div>
          <div class="info-block">
            <h3 class="info-block__title">Population</h3>
            <p class="info-block__text">~3.5 million</p>
          </div>
          <div class="info-block">
            <h3 class="info-block__title">Currency</h3>
            <p class="info-block__text">Uruguayan Peso (UYU)</p>
          </div>
          <div class="info-block">
            <h3 class="info-block__title">Official Language</h3>
            <p class="info-block__text">Spanish</p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.home-page {
  padding: 2rem 0;
}

.hero {
  text-align: center;
  margin-bottom: 4rem;
  padding: 3rem 0;
}

.hero__title {
  margin: 0 0 1rem 0;
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--color-primary);
}

.hero__subtitle {
  margin: 0 0 2rem 0;
  font-size: 1.125rem;
  color: var(--color-text-muted);
  line-height: 1.6;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.hero__cta {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.hero__cta a {
  text-decoration: none;
}

.features {
  margin-bottom: 4rem;
}

.features__title {
  margin: 0 0 2rem 0;
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
}

.features__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.feature-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 2rem;
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  text-decoration: none;
  color: var(--color-foreground);
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  border-color: var(--color-primary);
}

.feature-card__icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.feature-card__title {
  margin: 0 0 0.5rem 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.feature-card__text {
  margin: 0;
  font-size: 0.95rem;
  color: var(--color-text-muted);
  line-height: 1.5;
}

.info-section {
  background-color: var(--color-secondary-light);
  padding: 3rem 2rem;
  border-radius: var(--radius-lg);
}

.info-section__title {
  margin: 0 0 2rem 0;
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
}

.info-section__content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
}

.info-block {
  text-align: center;
}

.info-block__title {
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-secondary);
}

.info-block__text {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-foreground);
}

@media (max-width: 768px) {
  .hero__title {
    font-size: 2rem;
  }

  .hero__subtitle {
    font-size: 1rem;
  }

  .features__title {
    font-size: 1.5rem;
  }

  .info-section__title {
    font-size: 1.5rem;
  }
}
</style>
