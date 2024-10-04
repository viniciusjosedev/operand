import 'dotenv/config';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { deleteUser, signInWithEmailAndPassword, User } from 'firebase/auth';
import { AuthFirebase } from 'src/firebase/auth.firebase';
import { EMAIL_MOCK, PASSWORD_MOCK } from './mocks';
import { UserController } from './user.controller';
import { JwtService } from '@nestjs/jwt';
import { UserService } from './user.service';
import * as cookieParser from 'cookie-parser';

type Credentials = {
  email: string;
  password: string;
};

type AuthFunctionsHelper = {
  findUser: ({ email, password }: Credentials) => Promise<User | null>;
  deleteUser: ({ email, password }: Credentials) => Promise<void>;
};

describe('UserRouter (e2e)', () => {
  let app: INestApplication = null;
  const authFirebase: AuthFirebase = new AuthFirebase();
  let token: string;

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
      controllers: [UserController],
      providers: [UserService, AuthFirebase, JwtService],
      exports: [UserService],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.use(cookieParser());

    await app.init();

    const jwtService = app.get<JwtService>(JwtService);

    const payload = { email: EMAIL_MOCK, id: '1' };

    token = jwtService.sign(payload, {
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
    await app.close();
  });

  beforeEach(async () => {
    await authFunctionsHelper.deleteUser({
      email: EMAIL_MOCK,
      password: PASSWORD_MOCK,
    });
  });

  it('POST /user/me', async () => {
    const response = await request(app.getHttpServer())
      .get('/user/me')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      email: EMAIL_MOCK,
    });
  });

  it('POST /user/logout', async () => {
    const response = await request(app.getHttpServer())
      .post('/user/logout')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({});
  });

  it('POST /user/logout without token', async () => {
    const response = await request(app.getHttpServer()).post('/user/logout');

    expect(response.status).toBe(401);
  });

  it('POST /user/logout with invalid token', async () => {
    const response = await request(app.getHttpServer())
      .post('/user/logout')
      .set('Authorization', 'Bearer invalid_token');

    expect(response.status).toBe(401);
  });
});
