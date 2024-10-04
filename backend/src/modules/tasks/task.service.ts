import { Injectable } from '@nestjs/common';
import { TaskServiceInterface, Task } from './task.service.interface';
import { DatabaseFirebase } from 'src/firebase/database.firebase';
import { ref, get, set } from 'firebase/database';
import { RedisCache } from 'src/cache/redis';
import * as crypto from 'node:crypto';

@Injectable()
export class TaskService implements TaskServiceInterface {
  private readonly DATABASE_PATH = `${process.env.NODE_ENV || 'dev'}/tasks`;
  constructor(
    private readonly databaseFirebase: DatabaseFirebase,
    private readonly redisCache: RedisCache,
  ) {}

  generateDbRef(id: string) {
    return ref(this.databaseFirebase.database, `${this.DATABASE_PATH}/${id}`);
  }

  parseTaskByPageNumber(tasks: Task[], pageNumber: number, status: string) {
    const filteredTasks = tasks.filter((t) => t.status === status);
    const tasksPerPage = 40;
    const start = (pageNumber - 1) * tasksPerPage;
    const end = start + tasksPerPage;
    return {
      tasks: filteredTasks.slice(start, end),
      hasMore: filteredTasks.length > end,
    };
  }

  async findAll({ pageNumber, id, status }) {
    const cachedTasks = await this.redisCache.get<Task[]>(id);

    if (cachedTasks) {
      return this.parseTaskByPageNumber(cachedTasks, pageNumber, status);
    }

    const snapshot = await get(this.generateDbRef(id));

    if (snapshot.exists()) {
      const tasks: Task[] = snapshot.val();
      this.redisCache.set(id, tasks);
      return this.parseTaskByPageNumber(tasks, pageNumber, status);
    }

    return { tasks: [], hasMore: false };
  }

  generateUuid() {
    return crypto.randomBytes(32).toString('hex');
  }

  async create({ id, task }) {
    let tasks = await this.redisCache.get<Task[]>(id);

    const newTask: Task = {
      ...task,
      id: this.generateUuid(),
      createdAt: new Date().toISOString(),
    };

    if (!tasks) {
      const snapshot = await get(this.generateDbRef(id));

      tasks = snapshot.exists() ? (snapshot.val() as unknown as Task[]) : [];
    }

    const newTasks = [...tasks, newTask];
    await set(this.generateDbRef(id), newTasks);
    this.redisCache.set(id, newTasks);

    return newTask;
  }

  async update({ id, task }) {
    let tasks = await this.redisCache.get<Task[]>(id);

    if (!tasks) {
      const snapshot = await get(this.generateDbRef(id));

      tasks = snapshot.exists() ? (snapshot.val() as unknown as Task[]) : [];
    }

    const taskIndex = tasks.findIndex((t) => t.id === task.id);

    if (taskIndex === -1) {
      return null;
    }

    tasks[taskIndex] = {
      ...tasks[taskIndex],
      ...task,
    };
    await set(this.generateDbRef(id), tasks);
    await this.redisCache.set(id, tasks);

    return task;
  }

  async delete({ id, taskId }) {
    let tasks = await this.redisCache.get<Task[]>(id);

    if (!tasks) {
      const snapshot = await get(this.generateDbRef(id));

      tasks = snapshot.exists() ? (snapshot.val() as unknown as Task[]) : [];
    }

    const newTasks = tasks.filter((t) => t.id !== taskId);
    await set(this.generateDbRef(id), newTasks);
    this.redisCache.set(id, newTasks);
  }
}
