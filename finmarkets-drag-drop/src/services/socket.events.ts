export const CLIENT_EVENTS = {
  USER_JOIN: "user:join",
  BOARD_INIT: "board:init",
  NOTE_CREATE: "note:create",
  NOTE_UPDATE: "note:update",
  NOTE_DELETE: "note:delete",
  NOTE_COMMENT: "note:comment",
} as const;

export const SERVER_EVENTS = {
  PRESENCE_USERS: "presence:users",
  BOARD_DATA: "board:data",
  NOTE_CREATED: "note:created",
  NOTE_UPDATED: "note:updated",
  NOTE_DELETED: "note:deleted",
  NOTE_COMMENTED: "note:commented",
  SERVER_ERROR: "server:error",
} as const;
