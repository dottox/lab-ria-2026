<template>
  <nav class="navigation">
    <div class="container--main">
      <div class="nav__wrapper">
        <button class="nav__toggle" @click="toggleMenu" :aria-label="isOpen ? 'Close menu' : 'Open menu'">
          <span></span>
          <span></span>
          <span></span>
        </button>
        <ul class="nav__menu" :class="{ 'nav__menu--open': isOpen }">
          <li><router-link to="/" class="nav__link" @click="isOpen = false">Home</router-link></li>
          <li><router-link to="/transport" class="nav__link" @click="isOpen = false">Transport</router-link></li>
          <li><router-link to="/tourism" class="nav__link" @click="isOpen = false">Tourism</router-link></li>
          <li><router-link to="/climate" class="nav__link" @click="isOpen = false">Climate</router-link></li>
          <li><router-link to="/events" class="nav__link" @click="isOpen = false">Events</router-link></li>
          <li><router-link to="/statistics" class="nav__link" @click="isOpen = false">Statistics</router-link></li>
          <li><router-link to="/favorites" class="nav__link nav__link--favorites" @click="isOpen = false">
            ⭐ Favorites<span class="nav__badge">{{ favoritesCount }}</span>
          </router-link></li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useFavoritesStore } from '@/stores/favorites'

const isOpen = ref(false)
const favoritesStore = useFavoritesStore()

const favoritesCount = computed(() => favoritesStore.favorites.length)

const toggleMenu = () => {
  isOpen.value = !isOpen.value
}
</script>

<style scoped>
.navigation {
  background-color: white;
  border-bottom: 1px solid var(--color-border);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav__wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
}

.nav__toggle {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
}

.nav__toggle span {
  width: 24px;
  height: 3px;
  background-color: var(--color-foreground);
  transition: all 0.3s ease;
  border-radius: 2px;
}

.nav__menu {
  display: flex;
  list-style: none;
  gap: 0;
  margin: 0;
  padding: 0;
}

.nav__link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-foreground);
  text-decoration: none;
  padding: 1rem 1.5rem;
  font-weight: 500;
  transition: background-color 0.3s ease, color 0.3s ease;
  white-space: nowrap;
}

.nav__link:hover {
  background-color: var(--color-primary-light);
  color: var(--color-primary);
}

.nav__link--favorites {
  background-color: var(--color-accent-light);
  color: var(--color-accent);
}

.nav__link--favorites:hover {
  background-color: var(--color-accent);
  color: white;
}

.nav__badge {
  display: inline-block;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  background-color: var(--color-primary);
  color: white;
  border-radius: 10px;
  font-size: 0.75rem;
  font-weight: 700;
  line-height: 20px;
  text-align: center;
}

.nav__link--favorites .nav__badge {
  background-color: var(--color-accent);
}

@media (max-width: 768px) {
  .nav__toggle {
    display: flex;
  }

  .nav__menu {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    flex-direction: column;
    background-color: white;
    border-bottom: 1px solid var(--color-border);
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease;
  }

  .nav__menu--open {
    max-height: 500px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .nav__link {
    padding: 0.75rem 1.5rem;
    border-bottom: 1px solid var(--color-border);
  }

  .nav__link:last-child {
    border-bottom: none;
  }
}
</style>
