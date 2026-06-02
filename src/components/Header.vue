<template>
  <header class="header">
    <div class="container--main">
      <div class="header__content">
        <h1 class="header__title">
          <router-link to="/" class="header__logo">
            🇺🇾 Uruguay
          </router-link>
        </h1>
        <p class="header__subtitle">Discover information about Uruguay</p>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
</script>

<style scoped>
.header {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
  color: white;
  padding: 2rem 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.header__content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.header__title {
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
}

.header__logo {
  color: white;
  text-decoration: none;
  transition: opacity 0.3s ease;
}

.header__logo:hover {
  opacity: 0.9;
}

.header__subtitle {
  margin: 0;
  font-size: 0.95rem;
  opacity: 0.95;
}

@media (max-width: 640px) {
  .header {
    padding: 1.5rem 0;
  }

  .header__title {
    font-size: 1.5rem;
  }

  .header__subtitle {
    font-size: 0.85rem;
  }
}
</style>
