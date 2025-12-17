import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const socketService = {
  connect(username: string) {
    if (socket) return;

    const url = import.meta.env.VITE_SOCKET_URL;

    if (!url) {
      console.error("❌ VITE_SOCKET_URL no está definida");
      return;
    }

    console.log("🔌 Conectando socket a:", url);

    socket = io(url, {
      transports: ["websocket"],
      withCredentials: true,
    });

    socket.on("connect", () => {
      console.log("✅ Socket conectado:", socket?.id);
      socket?.emit("user:join", { name: username });
    });

    socket.on("disconnect", () => {
      console.log("🔴 Socket desconectado");
    });
  },

  disconnect() {
    if (!socket) return;

    socket.disconnect();
    socket = null;
  },

  getSocket(): Socket {
    if (!socket) {
      throw new Error("Socket no inicializado. Llama a connect() primero.");
    }
    return socket;
  },

  /* ======================
     NOTES
     ====================== */

  createNote() {
    this.getSocket().emit("note:create");
  },

  updateNote(note: {
    id: string;
    title: string;
    content: string;
    x: number;
    y: number;
    timestamp: number;
  }) {
    this.getSocket().emit("note:update", note);
  },

  deleteNote(noteId: string) {
    this.getSocket().emit("note:delete", { noteId });
  },

  addComment(noteId: string, text: string) {
    this.getSocket().emit("note:comment", {
      noteId,
      text,
    });
  },

  /* ======================
     EDITING PRESENCE
     ====================== */

  startEditing(noteId: string) {
    this.getSocket().emit("note:editing:start", { noteId });
  },

  stopEditing(noteId: string) {
    this.getSocket().emit("note:editing:stop", { noteId });
  },
};
