export type Comment = {
  id: string;
  user: string;
  text: string;
  timestamp: number;
};

export type Note = {
  id: string;
  title: string;
  content: string;
  x: number;
  y: number;
  updatedBy?: string;
  comments: Comment[];
  timestamp: number; // para concurrencia (last-write-wins)
};
