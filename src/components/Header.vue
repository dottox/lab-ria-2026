<template>
  <header class="header">
    <nav class="header__nav">
      <div class="container--main">
        <div class="nav__wrapper">
          <router-link to="/" class="nav__logo">
            <span class="nav__flag">🇺🇾</span>
            <span class="nav__title">Uruguay</span>
          </router-link>
          <button 
            class="nav__toggle" 
            @click="toggleMenu" 
            :aria-label="isOpen ? 'Close menu' : 'Open menu'"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
          <ul class="nav__menu" :class="{ 'nav__menu--open': isOpen }">
            <li><router-link to="/" class="nav__link" @click="isOpen = false">Home</router-link></li>
            <li><router-link to="/events" class="nav__link" @click="isOpen = false">Events</router-link></li>
            <li><router-link to="/tourism" class="nav__link" @click="isOpen = false">Tourism</router-link></li>
            <li><router-link to="/climate" class="nav__link" @click="isOpen = false">Climate</router-link></li>
            <li><router-link to="/statistics" class="nav__link" @click="isOpen = false">Statistics</router-link></li>
            <li><router-link to="/favorites" class="nav__link nav__link--favorites" @click="isOpen = false">
              ⭐ Favorites<span class="nav__badge">{{ favoritesCount }}</span>
            </router-link></li>
          </ul>
          <button 
            class="btn--theme" 
            @click="themeStore.toggleTheme"
            :aria-label="`Switch to ${themeStore.theme === 'light' ? 'dark' : 'light'} mode`"
            title="Toggle theme"
          >
            <span v-if="themeStore.theme === 'light'" class="text-lg">🌙</span>
            <span v-else class="text-lg">☀️</span>
          </button>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useThemeStore } from '@/stores/theme'
import { useFavoritesStore } from '@/stores/favorites'

const isOpen = ref(false)
const themeStore = useThemeStore()
const favoritesStore = useFavoritesStore()

const favoritesCount = computed(() => favoritesStore.favorites.length)

const toggleMenu = () => {
  isOpen.value = !isOpen.value
}
</script>

<style scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 100;
  border: 1rem 0;
}

.header__nav {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100px; /* Adjust as needed */
  padding: 0.5rem 0;

  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);

  background: linear-gradient(
    to bottom,
    var(--color-background) 0%,
    color-mix(in srgb, var(--color-background) 40%, transparent) 70%,
    transparent 100%
  );

  -webkit-mask-image: linear-gradient(to bottom, black 0%, rgba(0, 0, 0, 0.8) 50%, transparent 100%);
  mask-image: linear-gradient(to bottom, black 0%, rgba(0, 0, 0, 0.8) 50%, transparent 100%);
}
.nav__wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  padding: 0;
  gap: 1rem;
}

.nav__logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  color: var(--color-foreground);
  font-weight: 700;
  font-size: 1.25rem;
  transition: opacity var(--transition-base);
  white-space: nowrap;
}

.nav__logo:hover {
  opacity: 0.8;
}

.nav__flag {
  font-size: 1.5rem;
  display: flex;
  align-items: center;
}

.nav__title {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-tertiary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.nav__toggle {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  transition: opacity var(--transition-base);
}

.nav__toggle:hover {
  opacity: 0.7;
}

.nav__toggle span {
  width: 20px;
  height: 2.5px;
  background-color: var(--color-foreground);
  transition: all var(--transition-base);
  border-radius: 2px;
}

.nav__menu {
  display: flex;
  list-style: none;
  gap: 0;
  margin: 0;
  padding: 0;
  flex: 1;
  justify-content: center;
}


.nav__link {
  border-radius: 10px;
  background-color: color-mix(in srgb, var(--color-primary-light) 20%, transparent);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: var(--color-text-secondary);
  text-decoration: none;
  margin: 0 0.2rem;
  padding: 0.75rem 0.875rem;
  font-weight: 500;
  font-size: 0.9rem;
  transition: all var(--transition-base);
  white-space: nowrap;
  border-bottom: 2px solid transparent;
}

.nav__link:hover {
  color: var(--color-primary);
  border-bottom-color: var(--color-primary);
}

.router-link-active {
  color: var(--color-primary);
  border-bottom-color: var(--color-primary);
}

.nav__link--favorites {
  background-color: var(--color-tertiary-light);
  color: var(--color-tertiary);
  margin-left: auto;
  margin-right: 0;
  border-radius: var(--radius-md);
  border: none;
  padding: 0.5rem 0.875rem;
}

.nav__link--favorites:hover {
  background-color: var(--color-tertiary);
  color: white;
  border-bottom-color: transparent;
}

.nav__badge {
  display: inline-block;
  min-width: 18px;
  height: 18px;
  padding: 0 4px;
  background-color: var(--color-primary);
  color: white;
  border-radius: 9px;
  font-size: 0.7rem;
  font-weight: 700;
  line-height: 18px;
  text-align: center;
}

.nav__link--favorites .nav__badge {
  background-color: var(--color-primary);
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
    background: linear-gradient(180deg, var(--color-background) 0%, rgba(var(--color-background), 0.98) 100%);
    border-bottom: 1px solid var(--color-border);
    max-height: 0;
    overflow: hidden;
    transition: max-height var(--transition-slow), opacity var(--transition-slow);
    opacity: 0;
    justify-content: flex-start;
    gap: 0;
  }

  .nav__menu--open {
    max-height: 500px;
    opacity: 1;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .nav__link {
    padding: 0.75rem 1.5rem;
    border: none;
    border-bottom: 1px solid var(--color-border);
    width: 100%;
    justify-content: flex-start;
    transition: background-color var(--transition-base), color var(--transition-base);
  }

  .nav__link:last-child {
    border-bottom: none;
  }

  .router-link-active {
    background-color: var(--color-primary-light);
  }

  .nav__link--favorites {
    margin-left: 1.5rem;
    margin-right: 1.5rem;
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
  }

  .btn--theme {
    margin-left: 0.5rem;
  }
}

@media (max-width: 640px) {
  .nav__title {
    display: none;
  }

  .nav__logo {
    flex: 1;
    justify-content: center;
  }

  .nav__link {
    padding: 0.75rem 1rem;
    font-size: 0.85rem;
  }
}

@media (max-width: 480px) {
  .nav__flag {
    font-size: 1.25rem;
  }

  .nav__link {
    padding: 0.65rem 0.75rem;
    font-size: 0.8rem;
  }
}
</style>

