<script setup lang="ts">
import { computed } from "vue";
import { socketService } from "../../services/socket.service";
import { useNotesStore } from "../../stores/notes.store";

import NoteCard from "./NoteCard.vue";

const notesStore = useNotesStore();

const notes = computed(() => notesStore.notes);

function createNote() {
  socketService.createNote();
}

</script>

<template>
  <div class="relative w-full h-full bg-gray-50 overflow-hidden">
    <!-- Toolbar -->
    <div class="absolute top-4 left-4 z-10">
      <button
        @click="createNote"
        class="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
      >
        + Nueva nota
      </button>
    </div>

    <!-- Board -->
    <div class="relative w-full h-full bg-cyan-200">
      <NoteCard
        v-for="note in notes"
        :key="note.id"
        :note="note"
      />
    </div>
  </div>
</template>
