import 'dotenv/config';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AuthModule } from './auth.module';
import { deleteUser, signInWithEmailAndPassword, User } from 'firebase/auth';
import { AuthFirebase } from 'src/firebase/auth.firebase';
import { EMAIL_MOCK, PASSWORD_MOCK } from './mocks';

type Credentials = {
  email: string;
  password: string;
};

type AuthFunctionsHelper = {
  findUser: ({ email, password }: Credentials) => Promise<User | null>;
  deleteUser: ({ email, password }: Credentials) => Promise<void>;
};

describe('AuthRouter (e2e)', () => {
  let app: INestApplication = null;
  const authFirebase: AuthFirebase = new AuthFirebase();

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
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
      controllers: [],
      providers: [],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await authFunctionsHelper.deleteUser({
      email: EMAIL_MOCK,
      password: PASSWORD_MOCK,
    });
    await app.close();
  });

  beforeEach(async () => {
    await authFunctionsHelper.deleteUser({
      email: EMAIL_MOCK,
      password: PASSWORD_MOCK,
    });
  });

  it('POST /auth/signup', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        email: EMAIL_MOCK,
        password: PASSWORD_MOCK,
      });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({});
  });

  it('POST /auth/signin', async () => {
    await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: EMAIL_MOCK, password: PASSWORD_MOCK });

    const response = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({
        email: EMAIL_MOCK,
        password: PASSWORD_MOCK,
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('access_token');
  });
});
