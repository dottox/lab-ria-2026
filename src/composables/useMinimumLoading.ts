import { onBeforeUnmount, onMounted, ref } from 'vue'

export function useMinimumLoading(duration = 500) {
  const isLoading = ref(true)
  let timer: number | undefined

  onMounted(() => {
    timer = window.setTimeout(() => {
      isLoading.value = false
    }, duration)
  })

  onBeforeUnmount(() => {
    if (timer !== undefined) {
      window.clearTimeout(timer)
    }
  })

  return {
    isLoading,
  }
}
