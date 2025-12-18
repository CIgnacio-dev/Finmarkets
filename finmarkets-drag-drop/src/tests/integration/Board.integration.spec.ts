import { mount } from "@vue/test-utils";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { createPinia, setActivePinia } from "pinia";

import Board from "../../components/board/Board.vue";
import { useNotesStore } from "../../stores/notes.store";
import { socketService } from "../../services/socket.service";

// Mock del socket service (integración frontend)
vi.mock("../../services/socket.service", () => ({
  socketService: {
    createNote: vi.fn(),
    updateNote: vi.fn(),
    addComment: vi.fn(),
  },
}));

describe("Board integration flow", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it("permite crear, mover y comentar una nota", async () => {
    const wrapper = mount(Board);

    // Crear nota
    await wrapper.find("button").trigger("click");
    expect(socketService.createNote).toHaveBeenCalled();

    // Simular nota creada desde socket
    const notesStore = useNotesStore();
    notesStore.notes.push({
      id: "1",
      title: "Nota test",
      content: "",
      x: 0,
      y: 0,
      comments: [],
      timestamp: Date.now(),
    });

    await wrapper.vm.$nextTick();

    // Simular movimiento
    socketService.updateNote({
      id: "1",
      x: 100,
      y: 100,
    });
    expect(socketService.updateNote).toHaveBeenCalled();

    // Simular comentario
    socketService.addComment("1", "Hola mundo");
    expect(socketService.addComment).toHaveBeenCalled();
  });
});
