export type Task = {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'done' | 'in progress';
  createdAt: string;
};

export interface TaskServiceInterface {
  findAll(data: { pageNumber: string; id: string }): Promise<Task[]>;
  create(data: {
    task: Omit<Task, 'id' | 'createdAt'>;
    id: string;
  }): Promise<Task>;
  update(data: { id: string; task: Task }): Promise<Task | null>;
  delete(data: { id: string; taskId: string }): Promise<void>;
}
