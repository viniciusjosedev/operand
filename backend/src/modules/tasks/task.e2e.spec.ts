import 'dotenv/config';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import {
  createUserWithEmailAndPassword,
  deleteUser,
  signInWithEmailAndPassword,
  User,
} from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { AuthFirebase } from 'src/firebase/auth.firebase';
import { TaskModule } from './task.module';
import { EMAIL_MOCK, PASSWORD_MOCK, TASK_MOCK } from './mocks';
import { JwtService } from '@nestjs/jwt';
import { DatabaseFirebase } from 'src/firebase/database.firebase';
import { Task } from './task.service.interface';
import { RedisCache } from 'src/cache/redis';

type Credentials = {
  email: string;
  password: string;
};

type AuthFunctionsHelper = {
  findUser: ({ email, password }: Credentials) => Promise<User | null>;
  deleteUser: ({ email, password }: Credentials) => Promise<void>;
  createUser: ({ email, password }: Credentials) => Promise<User>;
};

describe('TaskRouter (e2e)', () => {
  let app: INestApplication = null;
  const authFirebase = new AuthFirebase();
  const databaseFirebase = new DatabaseFirebase();

  let accessToken: string;
  let jwtService: JwtService;
  let redisCache: RedisCache;

  let payload: { email: string; id: string };

  const authFunctionsHelper: AuthFunctionsHelper = {
    findUser: async function ({ email, password }) {
      try {
        const user = await signInWithEmailAndPassword(
          authFirebase.auth,
          email,
          password,
        );

        return user.user;
      } catch (_error) {
        return null;
      }
    },

    deleteUser: async function ({ email, password }) {
      const user = await this.findUser({ email, password });

      if (!user) {
        return;
      }

      await deleteUser(user);
    },

    createUser: async function ({ email, password }) {
      await this.deleteUser({ email, password });

      const user = await createUserWithEmailAndPassword(
        authFirebase.auth,
        email,
        password,
      );

      return user.user;
    },
  };

  const taskFunctionsHelper = {
    DATABASE_PATH: `${process.env.NODE_ENV || 'dev'}/tasks`,

    generateDbRef(id: string) {
      return ref(databaseFirebase.database, `${this.DATABASE_PATH}/${id}`);
    },

    deleteAllTasks: async function (id: string) {
      await set(this.generateDbRef(id), []);
    },

    createTask: async function (id: string, task: Task) {
      await this.deleteAllTasks(id);
      await set(this.generateDbRef(id), [task]);
      return task;
    },
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TaskModule],
      controllers: [],
      providers: [],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    jwtService = moduleFixture.get<JwtService>(JwtService);
    redisCache = moduleFixture.get<RedisCache>(RedisCache);

    const user = await authFunctionsHelper.createUser({
      email: EMAIL_MOCK,
      password: PASSWORD_MOCK,
    });

    payload = { email: user.email, id: user.uid };

    accessToken = jwtService.sign(payload, {
      algorithm: 'HS256',
      secret: process.env.JWT_SECRET || 'secret',
      expiresIn: '30d',
    });
  });

  afterAll(async () => {
    await authFunctionsHelper.deleteUser({
      email: EMAIL_MOCK,
      password: PASSWORD_MOCK,
    });

    await taskFunctionsHelper.deleteAllTasks(payload.id);

    await app.close();
  });

  beforeEach(async () => {
    await taskFunctionsHelper.createTask(payload.id, TASK_MOCK);
    await redisCache.delete(payload.id);
  });

  it('/task (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get('/task')
      .query({ pageNumber: '1' })
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual([TASK_MOCK]);
  });

  it('/task/create (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/task/create')
      .send(TASK_MOCK)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(201);
    expect(response.body).toEqual({});
  });

  it('/task/update (PUT)', async () => {
    const NEW_MOCK = { ...TASK_MOCK, title: 'new title' };

    const response = await request(app.getHttpServer())
      .put('/task/update')
      .send(NEW_MOCK)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(NEW_MOCK);
  });

  it('/task/delete (DELETE)', async () => {
    const response = await request(app.getHttpServer())
      .delete(`/task/delete/${TASK_MOCK.id}`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(204);
    expect(response.body).toEqual({});
  });
});
