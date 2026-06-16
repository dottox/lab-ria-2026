import { ref, watch } from 'vue';
import type { Ref } from 'vue';

interface Comment {
  id: number;
  text: string;
  author: string;
  date: string;
}

export function useComments(eventId: Ref<string>) {
  const comments = ref<Comment[]>(
    JSON.parse(localStorage.getItem(`comments-${eventId.value}`) ?? '[]'),
  );

  watch(eventId, (newId) => {
    comments.value = JSON.parse(
      localStorage.getItem(`comments-${newId}`) ?? '[]',
    );
  });

  const addComment = (text: string, author: string) => {
    const newComment: Comment = {
      id: Date.now(),
      text,
      author,
      date: new Date().toISOString(),
    };
    comments.value.push(newComment);
    localStorage.setItem(
      `comments-${eventId.value}`,
      JSON.stringify(comments.value),
    );
  };

  return { comments, addComment };
}
