import { mount } from "@vue/test-utils";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { createPinia, setActivePinia } from "pinia";

import Board from "../../components/board/Board.vue";
import { socketService } from "../../services/socket.service";

vi.mock("../../services/socket.service", () => ({
  socketService: {
    createNote: vi.fn(),
  },
}));

describe("Board.vue", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.restoreAllMocks();
  });

  it("muestra el botón de crear nota", () => {
    const wrapper = mount(Board);
    expect(wrapper.text()).toContain("Nueva nota");
  });

  it("crea una nota al hacer click", async () => {
    const spy = vi.spyOn(socketService, "createNote").mockImplementation(() => {});

    const wrapper = mount(Board);
    await wrapper.find("button").trigger("click");

    expect(spy).toHaveBeenCalled();
  });
});
