import { defineStore } from "pinia";
import type { OnlineUser } from "../types/user";
import { getSocket } from "../services/socket.client";
import { SERVER_EVENTS } from "../services/socket.events";

export const useUsersStore = defineStore("users", {
  state: () => ({
    me: "" as string,
    online: [] as OnlineUser[],
  }),

  actions: {
    setMe(name: string) {
      this.me = name.trim();
    },

    bindSocketListeners() {
      const socket = getSocket();

      socket.off(SERVER_EVENTS.PRESENCE_USERS);
      socket.on(SERVER_EVENTS.PRESENCE_USERS, ({ users }: { users: OnlineUser[] }) => {
        this.online = users ?? [];
      });
    },
  },
});
