import type { Note } from "../types/note";
import { CLIENT_EVENTS } from "./socket.events";
import { getSocket } from "./socket.client";

export const socketService = {
  join(name: string) {
    getSocket().emit(CLIENT_EVENTS.USER_JOIN, { name });
  },

  initBoard() {
    getSocket().emit(CLIENT_EVENTS.BOARD_INIT);
  },

  createNote(payload: { title?: string; content?: string; x?: number; y?: number }) {
    getSocket().emit(CLIENT_EVENTS.NOTE_CREATE, payload);
  },

  updateNote(note: Partial<Note> & { id: string }) {
    getSocket().emit(CLIENT_EVENTS.NOTE_UPDATE, note);
  },

  deleteNote(id: string) {
    getSocket().emit(CLIENT_EVENTS.NOTE_DELETE, { id });
  },

  addComment(noteId: string, text: string) {
    getSocket().emit(CLIENT_EVENTS.NOTE_COMMENT, { noteId, text });
  },
  startEditing(noteId: string) {
  getSocket().emit("note:editing:start", { noteId });
},

stopEditing(noteId: string) {
  getSocket().emit("note:editing:stop", { noteId });
},

};
