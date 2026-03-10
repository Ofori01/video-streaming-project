export interface IComment {
  id: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: {
    id: number;
    username: string;
  };
  video?: { id: number };
  parent?: { id: number } | null;
}
