<template>
  <div class="error-alert" role="alert">
    <div class="error-alert__icon">⚠️</div>
    <div class="error-alert__content">
      <h4 class="error-alert__title">{{ title }}</h4>
      <p class="error-alert__message">{{ message }}</p>
    </div>
    <button v-if="dismissible" class="error-alert__close" @click="dismiss" aria-label="Close alert">
      ✕
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  title: string
  message: string
  dismissible?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  dismissible: true,
})

const emit = defineEmits<{
  dismiss: []
}>()

const isVisible = ref(true)

const dismiss = () => {
  isVisible.value = false
  emit('dismiss')
}
</script>

<style scoped>
.error-alert {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  background-color: #fee;
  border: 1px solid #fcc;
  border-radius: var(--radius-md);
  color: var(--color-error);
}

.error-alert__icon {
  flex-shrink: 0;
  font-size: 1.5rem;
  line-height: 1.5;
}

.error-alert__content {
  flex: 1;
  min-width: 0;
}

.error-alert__title {
  margin: 0 0 0.25rem 0;
  font-size: 1rem;
  font-weight: 600;
}

.error-alert__message {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.5;
}

.error-alert__close {
  flex-shrink: 0;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.25rem;
  line-height: 1;
  padding: 0;
  color: var(--color-error);
  opacity: 0.7;
  transition: opacity 0.3s ease;
}

.error-alert__close:hover {
  opacity: 1;
}
</style>
