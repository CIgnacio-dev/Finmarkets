import { mount } from "@vue/test-utils";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { createPinia, setActivePinia } from "pinia";

import NoteCard from "../../components/board/NoteCard.vue";
import type { Note } from "../../types/note";
import { socketService } from "../../services/socket.service";

vi.mock("../../services/socket.service", () => ({
  socketService: {
    updateNote: vi.fn(),
    deleteNote: vi.fn(),
    addComment: vi.fn(),
    startEditing: vi.fn(),
    stopEditing: vi.fn(),
  },
}));

describe("NoteCard.vue", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  const note: Note = {
    id: "1",
    title: "Test note",
    content: "Contenido",
    x: 10,
    y: 20,
    comments: [],
    timestamp: Date.now(),
  };

  it("renderiza el título de la nota", () => {
    const wrapper = mount(NoteCard, {
      props: { note },
    });

    const input = wrapper.find("input");
    expect((input.element as HTMLInputElement).value).toBe("Test note");
  });

  it("emite comentario al presionar Enter", async () => {
    const wrapper = mount(NoteCard, {
      props: { note },
    });

    const input = wrapper.find("input[placeholder='Agregar comentario…']");
    await input.setValue("Hola");
    await input.trigger("keyup.enter");

    expect(socketService.addComment).toHaveBeenCalledWith("1", "Hola");
  });
});
