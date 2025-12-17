
import { io, Socket } from "socket.io-client";

const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL || "http://localhost:3001";

let socket: Socket;

export function getSocket(): Socket {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ["websocket"],
    });
  }
  return socket;
}

export const socketService = {
  connect(username: string) {
    const socket = getSocket();
    socket.emit("user:join", { name: username });
  },

  createNote() {
    getSocket().emit("note:create");
  },

  updateNote(note: any) {
    getSocket().emit("note:update", note);
  },

  deleteNote(noteId: string) {
    getSocket().emit("note:delete", noteId);
  },

  addComment(noteId: string, text: string) {
    getSocket().emit("note:comment", { noteId, text });
  },

  startEditing(noteId: string) {
    getSocket().emit("note:editing:start", { noteId });
  },

  stopEditing(noteId: string) {
    getSocket().emit("note:editing:stop", { noteId });
  },
};

