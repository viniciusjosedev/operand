import 'dotenv/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { JwtService } from '@nestjs/jwt';
import { DatabaseFirebase } from 'src/firebase/database.firebase';
import { RedisCache } from 'src/cache/redis';
import { TASK_MOCK } from './mocks';
import { Request } from 'express';

describe('TaskController', () => {
  let controller: TaskController;
  let taskService: TaskService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [TaskService, JwtService, DatabaseFirebase, RedisCache],
    }).compile();

    controller = module.get<TaskController>(TaskController);
    taskService = module.get<TaskService>(TaskService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should have a method index', () => {
    expect(controller.index).toBeDefined();
  });

  it('should have a method create', () => {
    expect(controller.create).toBeDefined();
  });

  it('should have a method update', () => {
    expect(controller.update).toBeDefined();
  });

  it('should have a method delete', () => {
    expect(controller.delete).toBeDefined();
  });

  it('should return a value from index', async () => {
    const taskServiceSpy = jest
      .spyOn(taskService, 'findAll')
      .mockImplementation(() =>
        Promise.resolve({
          tasks: [TASK_MOCK],
          hasMore: false,
        }),
      );

    expect(
      await controller.index(
        {
          user: { id: '1' },
        } as unknown as Request,
        {
          pageNumber: '1',
          status: 'pending',
        },
      ),
    ).toEqual({
      tasks: [TASK_MOCK],
      hasMore: false,
    });

    expect(taskServiceSpy).toHaveBeenCalled();
    expect(taskServiceSpy).toHaveBeenCalledTimes(1);
  });

  it('should return a undefined from create', async () => {
    const taskServiceSpy = jest
      .spyOn(taskService, 'create')
      .mockImplementation(() => Promise.resolve(TASK_MOCK));

    expect(
      await controller.create(
        {
          user: { id: '1' },
        } as unknown as Request,
        {
          title: 'title',
          description: 'description',
          status: 'pending',
        },
      ),
    ).toBeUndefined();

    expect(taskServiceSpy).toHaveBeenCalled();
    expect(taskServiceSpy).toHaveBeenCalledTimes(1);
  });

  it('should return a value from update', async () => {
    const taskServiceSpy = jest
      .spyOn(taskService, 'update')
      .mockImplementation(() => Promise.resolve(TASK_MOCK));

    expect(
      await controller.update(
        {
          user: { id: '1' },
        } as unknown as Request,
        {
          title: 'title',
          description: 'description',
          status: 'pending',
        },
        {
          taskId: TASK_MOCK.id,
        },
      ),
    ).toEqual(TASK_MOCK);

    expect(taskServiceSpy).toHaveBeenCalled();
    expect(taskServiceSpy).toHaveBeenCalledTimes(1);
  });

  it('should return a undefined from delete', async () => {
    const taskServiceSpy = jest
      .spyOn(taskService, 'delete')
      .mockImplementation(() => Promise.resolve());

    expect(
      await controller.delete(
        {
          user: { id: '1' },
        } as unknown as Request,
        {
          taskId: '1',
        },
      ),
    ).toBeUndefined();

    expect(taskServiceSpy).toHaveBeenCalled();
    expect(taskServiceSpy).toHaveBeenCalledTimes(1);
  });
});
