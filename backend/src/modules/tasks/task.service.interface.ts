export type Task = {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'done' | 'in progress';
  createdAt: string;
};

export interface TaskServiceInterface {
  findAll(data: {
    pageNumber: string;
    id: string;
    status: 'pending' | 'done' | 'in progress';
  }): Promise<{ tasks: Task[]; hasMore: boolean }>;
  create(data: {
    task: Omit<Task, 'id' | 'createdAt'>;
    id: string;
  }): Promise<Task>;
  update(data: {
    id: string;
    task: Omit<Task, 'createdAt'>;
  }): Promise<Task | null>;
  delete(data: { id: string; taskId: string }): Promise<void>;
}
