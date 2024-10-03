import { Task } from '../task.service.interface';

export const EMAIL_MOCK = process.env.TEST_EMAIL_MOCK || 'test@operand.com';
export const PASSWORD_MOCK = '123456';

export const TASK_MOCK: Task = {
  id: '1',
  title: 'title',
  description: 'description',
  createdAt: new Date().toISOString(),
  status: 'pending',
};
