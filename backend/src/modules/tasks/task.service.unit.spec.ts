import 'dotenv/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import { DatabaseFirebase } from 'src/firebase/database.firebase';
import { RedisCache } from 'src/cache/redis';
import { get, set } from 'firebase/database';
import { TASK_MOCK } from './mocks';

jest.mock('firebase/database', () => {
  const actualFirebaseAuth = jest.requireActual('firebase/database');

  return {
    ...actualFirebaseAuth,
    ref: jest.fn().mockImplementation(() => ({})),
    get: jest.fn(),
    set: jest.fn(),
  };
});

describe('TaskService', () => {
  let service: TaskService;
  let redisCache: RedisCache;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TaskService, DatabaseFirebase, RedisCache],
    }).compile();

    service = module.get<TaskService>(TaskService);
    redisCache = module.get<RedisCache>(RedisCache);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should a method findAll', () => {
    expect(service.findAll).toBeDefined();
  });

  it('should a method create', () => {
    expect(service.create).toBeDefined();
  });

  it('should a method update', () => {
    expect(service.update).toBeDefined();
  });

  it('should a method delete', () => {
    expect(service.delete).toBeDefined();
  });

  it('should a method generateUuid', () => {
    expect(service.generateUuid).toBeDefined();
  });

  it('should return a value from findAll whithout cache', async () => {
    const redisCacheSpy = jest
      .spyOn(redisCache, 'get')
      .mockImplementation(() => Promise.resolve(null));

    (get as jest.Mock).mockResolvedValue({
      exists: jest.fn().mockReturnValue(true),
      val: jest.fn().mockReturnValue([]),
    });

    expect(
      await service.findAll({ pageNumber: 1, id: '1', status: 'pending' }),
    ).toEqual({
      tasks: [],
      hasMore: false,
    });
    expect(redisCacheSpy).toHaveBeenCalled();
    expect(redisCacheSpy).toHaveBeenCalledTimes(1);
  });

  it('should return a value from findAll with cache', async () => {
    const redisCacheSpy = jest
      .spyOn(redisCache, 'get')
      .mockImplementation(() => Promise.resolve([TASK_MOCK]));

    expect(
      await service.findAll({ pageNumber: 1, id: '1', status: 'pending' }),
    ).toEqual({
      tasks: [TASK_MOCK],
      hasMore: false,
    });
    expect(redisCacheSpy).toHaveBeenCalled();
    expect(redisCacheSpy).toHaveBeenCalledTimes(1);
  });

  it('should return a value from findAll without cache and snapshot', async () => {
    const redisCacheSpy = jest
      .spyOn(redisCache, 'get')
      .mockImplementation(() => Promise.resolve(null));

    (get as jest.Mock).mockResolvedValue({
      exists: jest.fn().mockReturnValue(false),
      val: jest.fn().mockReturnValue([]),
    });

    expect(
      await service.findAll({ pageNumber: 1, id: '1', status: 'pending' }),
    ).toEqual({
      tasks: [],
      hasMore: false,
    });
    expect(redisCacheSpy).toHaveBeenCalled();
    expect(redisCacheSpy).toHaveBeenCalledTimes(1);
  });

  it('should return a value from create with cache', async () => {
    const redisCacheSpy = jest
      .spyOn(redisCache, 'get')
      .mockImplementation(() => Promise.resolve(null));

    (get as jest.Mock).mockResolvedValue({
      exists: jest.fn().mockReturnValue(true),
      val: jest.fn().mockReturnValue([]),
    });

    (set as jest.Mock).mockResolvedValue({});

    service.generateUuid = jest.fn().mockReturnValue('1');

    expect(
      await service.create({
        id: '1',
        task: { title: 'title', description: 'description' },
      }),
    ).toEqual({
      id: '1',
      title: 'title',
      description: 'description',
      createdAt: expect.any(String),
    });

    expect(redisCacheSpy).toHaveBeenCalled();
    expect(redisCacheSpy).toHaveBeenCalledTimes(1);
  });

  it('should return a value from create without cache', async () => {
    const redisCacheSpy = jest
      .spyOn(redisCache, 'get')
      .mockImplementation(() => Promise.resolve(null));

    (get as jest.Mock).mockResolvedValue({
      exists: jest.fn().mockReturnValue(false),
      val: jest.fn().mockReturnValue([]),
    });

    (set as jest.Mock).mockResolvedValue({});

    service.generateUuid = jest.fn().mockReturnValue('1');

    expect(
      await service.create({
        id: '1',
        task: { title: 'title', description: 'description' },
      }),
    ).toEqual({
      id: '1',
      title: 'title',
      description: 'description',
      createdAt: expect.any(String),
    });

    expect(redisCacheSpy).toHaveBeenCalled();
    expect(redisCacheSpy).toHaveBeenCalledTimes(1);
  });

  it('should return a value from update', async () => {
    const redisCacheSpy = jest
      .spyOn(redisCache, 'get')
      .mockImplementation(() => Promise.resolve(null));

    (get as jest.Mock).mockResolvedValue({
      exists: jest.fn().mockReturnValue(true),
      val: jest.fn().mockReturnValue([TASK_MOCK]),
    });

    (set as jest.Mock).mockResolvedValue({});

    expect(
      await service.update({
        id: '1',
        task: TASK_MOCK,
      }),
    ).toEqual(TASK_MOCK);

    expect(redisCacheSpy).toHaveBeenCalled();
    expect(redisCacheSpy).toHaveBeenCalledTimes(1);
  });

  it('should return null from update', async () => {
    const redisCacheSpy = jest
      .spyOn(redisCache, 'get')
      .mockImplementation(() => Promise.resolve(null));

    (get as jest.Mock).mockResolvedValue({
      exists: jest.fn().mockReturnValue(true),
      val: jest.fn().mockReturnValue([]),
    });

    (set as jest.Mock).mockResolvedValue({});

    expect(
      await service.update({
        id: '1',
        task: TASK_MOCK,
      }),
    ).toBeNull();

    expect(redisCacheSpy).toHaveBeenCalled();
    expect(redisCacheSpy).toHaveBeenCalledTimes(1);
  });

  it('should return a value from delete with cache', async () => {
    const redisCacheSpy = jest
      .spyOn(redisCache, 'get')
      .mockImplementation(() => Promise.resolve(null));

    (get as jest.Mock).mockResolvedValue({
      exists: jest.fn().mockReturnValue(true),
      val: jest.fn().mockReturnValue([]),
    });

    (set as jest.Mock).mockResolvedValue({});

    expect(
      await service.delete({
        id: '1',
        taskId: '1',
      }),
    ).toBeUndefined();

    expect(redisCacheSpy).toHaveBeenCalled();
    expect(redisCacheSpy).toHaveBeenCalledTimes(1);
  });

  it('should return a value from delete without cache', async () => {
    const redisCacheSpy = jest
      .spyOn(redisCache, 'get')
      .mockImplementation(() => Promise.resolve(null));

    (get as jest.Mock).mockResolvedValue({
      exists: jest.fn().mockReturnValue(false),
      val: jest.fn().mockReturnValue([]),
    });

    (set as jest.Mock).mockResolvedValue({});

    expect(
      await service.delete({
        id: '1',
        taskId: '1',
      }),
    ).toBeUndefined();

    expect(redisCacheSpy).toHaveBeenCalled();
    expect(redisCacheSpy).toHaveBeenCalledTimes(1);
  });

  it('should return a value from delete without cache and snapshot', async () => {
    const redisCacheSpy = jest
      .spyOn(redisCache, 'get')
      .mockImplementation(() => Promise.resolve(null));

    (get as jest.Mock).mockResolvedValue({
      exists: jest.fn().mockReturnValue(true),
      val: jest.fn().mockReturnValue([]),
    });

    (set as jest.Mock).mockResolvedValue({});

    expect(
      await service.delete({
        id: '1',
        taskId: '1',
      }),
    ).toBeUndefined();

    expect(redisCacheSpy).toHaveBeenCalled();
    expect(redisCacheSpy).toHaveBeenCalledTimes(1);
  });

  it('should return a value from generateUuid', () => {
    const uuid = service.generateUuid();
    expect(uuid).toHaveLength(64);
  });
});
