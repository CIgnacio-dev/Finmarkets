<script setup lang="ts">
import { ref, watch, computed, onBeforeUnmount } from "vue";
import type { Note } from "../../types/note";

import { socketService } from "../../services/socket.service";
import { useUsersStore } from "../../stores/users.store";
import { useUiStore } from "../../stores/ui.store";

const props = defineProps<{ note: Note }>();

const usersStore = useUsersStore();
const uiStore = useUiStore();

/* ======================
   Editable local state
====================== */
const title = ref(props.note.title);
const content = ref(props.note.content);

watch(
  () => props.note,
  (n) => {
    title.value = n.title;
    content.value = n.content;
  }
);

/* ======================
   Identity & editing
====================== */
const me = computed(() => usersStore.me);

const isEditedByOther = computed(() => {
  const editor = uiStore.editingBy[props.note.id];
  return !!editor && editor !== me.value;
});

function startEditing() {
  uiStore.setEditing(props.note.id, me.value);
  socketService.startEditing(props.note.id);
}

function stopEditing() {
  uiStore.clearEditing(props.note.id);
  socketService.stopEditing(props.note.id);
  persist();
}


/* ======================
   Drag & drop
====================== */
const isDragging = ref(false);
const offsetX = ref(0);
const offsetY = ref(0);

const posX = ref<number>(props.note.x ?? 0);
const posY = ref<number>(props.note.y ?? 0);

watch(
  () => [props.note.x, props.note.y],
  ([x, y]) => {
    if (!isDragging.value) {
      if (typeof x === "number") posX.value = x;
      if (typeof y === "number") posY.value = y;
    }
  }
);

function onMouseDown(e: MouseEvent) {
  isDragging.value = true;
  offsetX.value = e.clientX - posX.value;
  offsetY.value = e.clientY - posY.value;

  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("mouseup", onMouseUp);
}

function onMouseMove(e: MouseEvent) {
  if (!isDragging.value) return;
  posX.value = e.clientX - offsetX.value;
  posY.value = e.clientY - offsetY.value;
}

function onMouseUp() {
  if (!isDragging.value) return;
  isDragging.value = false;

  document.removeEventListener("mousemove", onMouseMove);
  document.removeEventListener("mouseup", onMouseUp);

  persist();
}

/* ======================
   Persist note changes
====================== */
function persist() {
  socketService.updateNote({
    id: props.note.id,
    title: title.value,
    content: content.value,
    x: Math.round(posX.value),
    y: Math.round(posY.value),
    timestamp: Date.now(),
  });
}

/* ======================
   Delete note
====================== */
function deleteNote() {
  socketService.deleteNote(props.note.id);
}

/* ======================
   COMMENTS
====================== */
const newComment = ref("");

function addComment() {
  const text = newComment.value.trim();
  if (!text) return;

  socketService.addComment(props.note.id, text);
  newComment.value = "";
}

onBeforeUnmount(() => {
  document.removeEventListener("mousemove", onMouseMove);
  document.removeEventListener("mouseup", onMouseUp);
});
</script>

<template>
  <div
    class="absolute bg-yellow-100 rounded shadow p-3 w-64 cursor-move select-none"
    :style="{ left: posX + 'px', top: posY + 'px' }"
    @mousedown.self="onMouseDown"
  >
    <!-- HEADER -->
    <div class="flex justify-between items-center mb-2">
      <input
        v-model="title"
        class="font-semibold bg-transparent outline-none w-full"
        @focus="startEditing"
        @blur="stopEditing"
      />
      <button class="text-red-500 text-sm ml-2" @click="deleteNote">
        ✕
      </button>
    </div>

    <!-- CONTENT -->
    <textarea
      v-model="content"
      rows="3"
      class="w-full bg-transparent resize-none outline-none text-sm"
      @focus="startEditing"
      @blur="stopEditing"
    />

    <!-- EDITING INDICATOR -->
    <div
      v-if="isEditedByOther"
      class="mt-2 text-xs text-red-600 italic"
    >
      {{ uiStore.editingBy[note.id] }} está editando…
    </div>

    <!-- COMMENTS SECTION -->
    <div class="mt-3 pt-2 border-t border-yellow-300">
      <div class="text-xs font-semibold text-gray-600 mb-1">
        Comentarios
      </div>

      <div
        v-if="note.comments.length === 0"
        class="text-xs text-gray-400 italic mb-2"
      >
        No hay comentarios aún
      </div>

      <div
        v-for="comment in note.comments"
        :key="comment.id"
        class="text-xs text-gray-700 mb-1 bg-yellow-50 rounded px-2 py-1"
      >
        <span class="font-semibold">{{ comment.user }}:</span>
        {{ comment.text }}
      </div>

      <div class="flex gap-1 mt-2">
        <input
          v-model="newComment"
          placeholder="Agregar comentario…"
          class="flex-1 text-xs border rounded px-2 py-1"
          @keyup.enter="addComment"
        />
        <button
          class="text-xs bg-blue-600 text-white px-2 rounded"
          @click="addComment"
        >
          Enviar
        </button>
      </div>
    </div>
  </div>
</template>
