import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const socketService = {
  connect(username: string) {
    if (socket) return;

    const url = import.meta.env.VITE_SOCKET_URL;

    if (!url) {
      console.error("❌ VITE_SOCKET_URL no definida");
      return;
    }

    //  Crear conexión
    socket = io(url, {
      transports: ["websocket"],
    });

    // -------------------------
    //  LISTENERS DE CONEXIÓN
    // -------------------------
    socket.on("connect", () => {
      console.log("✅ Socket conectado:", socket?.id);
    });

    socket.on("disconnect", () => {
      console.warn("⚠️ Socket desconectado");
    });

    socket.on("reconnect", () => {
      console.info("🔄 Socket reconectado");
    });

    // -------------------------
    // JOIN USUARIO
    // -------------------------
    socket.emit("user:join", { name: username });
  },

  getSocket(): Socket {
    if (!socket) {
      throw new Error("Socket no conectado");
    }
    return socket;
  },

  disconnect() {
    socket?.disconnect();
    socket = null;
  },

  // -------- Presencia --------
  requestPresence() {
    this.getSocket().emit("presence:request");
  },

  // -------- Board --------
  requestBoard() {
    this.getSocket().emit("board:init");
  },

  createNote() {
    this.getSocket().emit("note:create");
  },

  updateNote(note: any) {
    this.getSocket().emit("note:update", note);
  },

  deleteNote(noteId: string) {
    this.getSocket().emit("note:delete", { noteId });
  },

  // -------- Comentarios --------
  addComment(noteId: string, text: string) {
    this.getSocket().emit("note:comment", { noteId, text });
  },

  // -------- Edición --------
  startEditing(noteId: string) {
    this.getSocket().emit("note:editing:start", { noteId });
  },

  stopEditing(noteId: string) {
    this.getSocket().emit("note:editing:stop", { noteId });
  },
};
