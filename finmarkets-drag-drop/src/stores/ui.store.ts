import { defineStore } from "pinia";
import { getSocket } from "../services/socket.client";
import { SERVER_EVENTS } from "../services/socket.events";

export const useUiStore = defineStore("ui", {
  state: () => ({
  error: "" as string,
  editingBy: {} as Record<string, string>,
  editingTimeouts: {} as Record<string, number>,
}),


  actions: {
    setError(msg: string) {
      this.error = msg;
    },
    clearError() {
      this.error = "";
    },

    setEditing(noteId: string, username: string) {
      this.editingBy[noteId] = username;
    },
    clearEditing(noteId: string) {
      delete this.editingBy[noteId];
    },

    bindSocketListeners() {
      const socket = getSocket();

      socket.on("note:editing", ({ noteId, user }) => {

  if (this.editingTimeouts[noteId]) {
    clearTimeout(this.editingTimeouts[noteId]);
    delete this.editingTimeouts[noteId];
  }

  this.editingBy[noteId] = user;
});

socket.on("note:editing:stop", ({ noteId }) => {

  const timeoutId = window.setTimeout(() => {
    delete this.editingBy[noteId];
    delete this.editingTimeouts[noteId];
  }, 2000);

  this.editingTimeouts[noteId] = timeoutId;
});



      socket.off(SERVER_EVENTS.SERVER_ERROR);
      socket.on(SERVER_EVENTS.SERVER_ERROR, ({ message }: { message: string }) => {
        this.setError(message || "Error desconocido del servidor");
      });
    },
  },
});
