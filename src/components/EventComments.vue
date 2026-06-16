<template>
  <div class="comments">
    <div class="comments__header">
      <h3 class="comments__title">Opiniones del evento</h3>
      <span class="comments__count">{{ comments.length }} comentarios</span>
    </div>

    <form class="comments__form" @submit.prevent="handleSubmit">
      <div class="comments__fields">
        <input
          v-model="author"
          class="comments__input"
          type="text"
          placeholder="Tu nombre (opcional)"
          maxlength="40"
        />
        <textarea
          v-model="text"
          class="comments__textarea"
          placeholder="¿Qué te pareció este evento?"
          rows="3"
          maxlength="300"
        />
      </div>

      <div class="comments__form-footer">
        <span class="comments__chars">{{ text.length }}/300</span>
        <button
          class="btn--primary cursor-pointer"
          type="submit"
          :disabled="!text.trim()"
        >
          Publicar
        </button>
      </div>
    </form>

    <div v-if="comments.length" class="comments__list">
      <article
        v-for="comment in ordenedComments"
        :key="comment.id"
        class="comment-card"
      >
        <div class="comment-card__header">
          <strong class="comment-card__autor">
            {{ comment.author || 'Anónimo' }}
          </strong>
          <time class="comment-card__fecha">{{
            formatDate(comment.date)
          }}</time>
        </div>
        <p class="comment-card__texto">{{ comment.text }}</p>
      </article>
    </div>

    <p v-else class="comments__empty">
      Todavía no hay opiniones. ¡Sé el primero!
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, toRef } from 'vue';
import { useComments } from '@/composables/useComments';

const props = defineProps<{ eventId: string }>();

const { comments, addComment } = useComments(toRef(props, 'eventId'));

const author = ref('');
const text = ref('');

const ordenedComments = computed(() =>
  [...comments.value].sort((a, b) => b.id - a.id),
);

const handleSubmit = () => {
  if (!text.value.trim()) return;
  addComment(text.value.trim(), author.value.trim());
  text.value = '';
  author.value = '';
};

const formatDate = (iso: string) => {
  return new Date(iso).toLocaleDateString('es-UY', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};
</script>

<style scoped>
.comments {
  margin-top: 1.5rem;
}

.comments__header {
  display: flex;
  align-items: baseline;
  gap: 1rem;
  margin-bottom: 1.25rem;
}

.comments__title {
  margin: 0;
  font-size: 1.25rem;
  color: var(--color-foreground);
}

.comments__count {
  font-size: 0.88rem;
  color: var(--color-text-muted);
}

.comments__form {
  padding: 1.25rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-background);
  margin-bottom: 1.5rem;
}

.comments__fields {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.comments__input,
.comments__textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  color: var(--color-foreground);
  font-size: 0.95rem;
  font-family: inherit;
  resize: none;
  box-sizing: border-box;
}

.comments__input:focus,
.comments__textarea:focus {
  outline: none;
  border-color: var(--color-primary);
}

.comments__form-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.comments__chars {
  font-size: 0.82rem;
  color: var(--color-text-muted);
}

.comments__list {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
  max-height: 22rem;
  overflow-y: auto;
  scroll-behavior: smooth;
}

.comment-card {
  padding: 1rem 1.15rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-background);
}

.comment-card__header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.comment-card__autor {
  font-size: 0.95rem;
  color: var(--color-foreground);
}

.comment-card__fecha {
  font-size: 0.82rem;
  color: var(--color-text-muted);
}

.comment-card__texto {
  margin: 0;
  font-size: 0.93rem;
  line-height: 1.65;
  color: var(--color-text-secondary);
}

.comments__empty {
  padding: 1.5rem;
  text-align: center;
  color: var(--color-text-muted);
  font-size: 0.95rem;
  border: 1px dashed var(--color-border);
  border-radius: var(--radius-lg);
}
</style>
