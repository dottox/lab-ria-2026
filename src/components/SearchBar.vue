<template>
  <div class="search-bar">
    <input
      type="text"
      class="search-bar__input"
      :placeholder="placeholder"
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      @keyup.enter="$emit('search')"
    />
    <button class="search-bar__button" @click="$emit('search')" aria-label="Search">
      🔍
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  placeholder?: string
  modelValue: string
}>()

defineEmits<{
  'update:modelValue': [value: string]
  search: []
}>()
</script>

<style scoped>
.search-bar {
  display: flex;
  gap: 0.5rem;
  width: 100%;
}

.search-bar__input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: 1rem;
  font-family: inherit;
  transition: border-color 0.3s ease;
}

.search-bar__input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);
}

.search-bar__button {
  padding: 0.75rem 1.5rem;
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.search-bar__button:hover {
  background-color: var(--color-primary-dark);
}

@media (max-width: 640px) {
  .search-bar {
    gap: 0.25rem;
  }

  .search-bar__button {
    padding: 0.75rem 1rem;
  }
}
</style>
