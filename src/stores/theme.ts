import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export type Theme = 'light' | 'dark'

export const useThemeStore = defineStore('theme', () => {
  const theme = ref<Theme>('light')
  const isInitialized = ref(false)

  // Initialize theme from localStorage
  const initTheme = () => {
    if (isInitialized.value) return

    const savedTheme = localStorage.getItem('theme') as Theme | null
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

    if (savedTheme) {
      theme.value = savedTheme
    } else if (prefersDark) {
      theme.value = 'dark'
    } else {
      theme.value = 'light'
    }

    applyTheme()
    isInitialized.value = true
  }

  // Apply theme to document
  const applyTheme = () => {
    const html = document.documentElement
    html.classList.remove('light', 'dark')
    html.classList.add(theme.value)
    localStorage.setItem('theme', theme.value)
  }

  // Toggle theme with animation
  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
  }

  // Set specific theme
  const setTheme = (newTheme: Theme) => {
    theme.value = newTheme
  }

  // Watch theme changes and apply them
  watch(theme, () => {
    applyTheme()
  })

  return {
    theme,
    isInitialized,
    initTheme,
    toggleTheme,
    setTheme,
  }
})
