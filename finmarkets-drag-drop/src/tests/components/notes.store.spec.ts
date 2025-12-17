import { describe, it, expect, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useNotesStore } from "../../stores/notes.store";
import type { Note } from "../../types/note";

describe("notes.store", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("aplica estrategia last-write-wins", () => {
    const store = useNotesStore();

    const base: Note = {
      id: "1",
      title: "Viejo",
      content: "",
      x: 0,
      y: 0,
      comments: [],
      timestamp: 100,
    };

    store.notes.push(base);

    store.$patch({
      notes: [
        {
          ...base,
          title: "Update viejo",
          timestamp: 200,
        },
      ],
    });

    store.$patch({
      notes: [
        {
          ...base,
          title: "Update nuevo",
          timestamp: 300,
        },
      ],
    });

    expect(store.notes.length).toBe(1);

    const note = store.notes[0];
    expect(note).toBeDefined();

    if (!note) return;

    expect(note.title).toBe("Update nuevo");
  });
});
