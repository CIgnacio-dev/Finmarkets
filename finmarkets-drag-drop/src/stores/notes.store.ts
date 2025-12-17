import { defineStore } from "pinia";
import type { Note, Comment } from "../types/note";
import { getSocket } from "../services/socket.client";
import { SERVER_EVENTS } from "../services/socket.events";

export const useNotesStore = defineStore("notes", {
  state: () => ({
    notes: [] as Note[],
    loading: false,
  }),

  getters: {
    byId: (s) => (id: string) => s.notes.find((n) => n.id === id),
  },

  actions: {
    setLoading(v: boolean) {
      this.loading = v;
    },

    bindSocketListeners() {
      const socket = getSocket();

      socket.off(SERVER_EVENTS.BOARD_DATA);
      socket.off(SERVER_EVENTS.NOTE_CREATED);
      socket.off(SERVER_EVENTS.NOTE_UPDATED);
      socket.off(SERVER_EVENTS.NOTE_DELETED);
      socket.off(SERVER_EVENTS.NOTE_COMMENTED);

      socket.on(SERVER_EVENTS.BOARD_DATA, ({ notes }: { notes: Note[] }) => {
        this.notes = notes ?? [];
        this.loading = false;
      });

      socket.on(SERVER_EVENTS.NOTE_CREATED, (note: Note) => {
        // evita duplicados si reconecta
        if (!this.notes.some((n) => n.id === note.id)) this.notes.push(note);
      });

      socket.on(SERVER_EVENTS.NOTE_UPDATED, (incoming: Note) => {
        const i = this.notes.findIndex((n) => n.id === incoming.id);
        if (i === -1) {
          this.notes.push(incoming);
          return;
        }

        // Concurrencia: last write wins por timestamp
        const current = this.notes[i];
if (!current) return;

const currentTs = current.timestamp ?? 0;

        const incomingTs = incoming.timestamp ?? 0;

        if (incomingTs >= currentTs) {
          this.notes[i] = { ...current, ...incoming };
        }
      });

      socket.on(SERVER_EVENTS.NOTE_DELETED, ({ id }: { id: string }) => {
        this.notes = this.notes.filter((n) => n.id !== id);
      });

      socket.on(
        SERVER_EVENTS.NOTE_COMMENTED,
        ({ noteId, comment }: { noteId: string; comment: Comment }) => {
          const note = this.notes.find((n) => n.id === noteId);
          if (!note) return;
          // evita duplicado por reconexión
          if (!note.comments.some((c) => c.id === comment.id)) {
            note.comments.push(comment);
          }
        }
      );
    },
  },
});
