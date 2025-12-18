import { describe, it, expect, beforeEach } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { useUiStore } from "../../stores/ui.store";

describe("Socket error handling", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("muestra error cuando el socket falla", () => {
    const uiStore = useUiStore();

    uiStore.setError("Conexión perdida");

    expect(uiStore.error).toBe("Conexión perdida");
  });

  it("limpia error después de cerrarlo", () => {
    const uiStore = useUiStore();

    uiStore.setError("Error");
    uiStore.clearError();

    expect(uiStore.error).toBe("");
  });
});
