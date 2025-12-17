<script setup lang="ts">
import { computed } from "vue";
import { useUsersStore } from "../../stores/users.store";

const usersStore = useUsersStore();

const users = computed(() => usersStore.online);
</script>

<template>
  <div class="bg-cyan-50 border border-emerald-200 rounded p-3">
    <h2 class="font-semibold mb-2 text-emerald-800 text-sm">
      Usuarios conectados
    </h2>

    <ul class="space-y-1">
      <li
        v-for="user in users"
        :key="user.name"
        class="flex items-center gap-2 text-sm text-emerald-700"
      >
        <span class="w-2 h-2 bg-emerald-500 rounded-full"></span>
        {{ user.name }}
      </li>

      <li
        v-if="users.length === 0"
        class="text-sm text-emerald-400 italic"
      >
        Nadie conectado
      </li>
    </ul>
  </div>
</template>

