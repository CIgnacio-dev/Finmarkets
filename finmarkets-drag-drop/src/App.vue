@ -0,0 +1,94 @@
<script setup lang="ts">
import { ref, computed } from "vue";
import { socketService } from "./services/socket.service";
7
import { useUsersStore } from "./stores/users.store";
import { useNotesStore } from "./stores/notes.store";
import { useUiStore } from "./stores/ui.store";

import Board from "./components/board/Board.vue";
import UserPresence from "./components/ui/UserPresence.vue";

const usersStore = useUsersStore();
const notesStore = useNotesStore();
const uiStore = useUiStore();

const nameInput = ref("");

const isJoined = computed(() => !!usersStore.me);

function joinBoard() {
  const name = nameInput.value.trim();
  if (!name) return;

  usersStore.setMe(name);

  // Bind socket listeners
  usersStore.bindSocketListeners();
  notesStore.bindSocketListeners();
  uiStore.bindSocketListeners();

  socketService.connect(name);
  socketService.requestPresence();
  socketService.requestBoard();
  notesStore.setLoading(true);
   
}
</script>

<template>
  <div class="min-h-screen bg-emerald-50">
    <!-- JOIN -->
    <div
      v-if="!isJoined"
      class="flex items-center justify-center h-screen"
    >
      <div class="bg-white p-6 rounded shadow w-80">
        <h1 class="text-xl font-semibold mb-4 text-center">
          Realtime Collaboration Board
        </h1>

        <input
          v-model="nameInput"
          placeholder="Ingresa tu nombre"
          class="w-full border rounded px-3 py-2 mb-4"
          @keyup.enter="joinBoard"
        />

        <button
          class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          @click="joinBoard"
        >
          Entrar
        </button>
      </div>
    </div>

    <!-- BOARD -->
    <div v-else class="flex h-screen">
      <aside class="w-64 bg-white border-r p-4">
        <UserPresence />
      </aside>

      <main class="flex-1 relative overflow-hidden bg-emerald-100/40">
        <div
          v-if="notesStore.loading"
          class="absolute inset-0 flex items-center justify-center text-gray-500"
        >
          Cargando tablero…
        </div>

        <Board v-else />
      </main>
    </div>

    <!-- ERROR GLOBAL -->
    <div
      v-if="uiStore.error"
      class="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded shadow"
    >
      {{ uiStore.error }}
      <button class="ml-2 underline" @click="uiStore.clearError">
        cerrar
      </button>
    </div>
  </div>
</template>