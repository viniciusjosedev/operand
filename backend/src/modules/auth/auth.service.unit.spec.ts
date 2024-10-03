import 'dotenv/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UserModule } from '../users/user.module';
import { UserService } from '../users/user.service';
import { AuthController } from './auth.controller';
import { EMAIL_MOCK, ID_MOCK, PASSWORD_MOCK, TOKEN_MOCK } from './mocks';

const signMock = jest.fn().mockImplementation(() => TOKEN_MOCK);

jest.mock('@nestjs/jwt', () => {
  return {
    JwtService: jest.fn().mockImplementation(() => ({
      sign: signMock,
    })),
  };
});

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UserModule],
      providers: [AuthService, JwtService],
      controllers: [AuthController],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should have a method signIn', () => {
    expect(service.signIn).toBeDefined();
  });

  it('should have a method signUp', () => {
    expect(service.signUp).toBeDefined();
  });

  it('should return a value from signIn', async () => {
    const userServiceSpy = jest
      .spyOn(userService, 'findOne')
      .mockImplementation(() =>
        Promise.resolve({ email: EMAIL_MOCK, id: ID_MOCK }),
      );

    expect(await service.signIn(EMAIL_MOCK, PASSWORD_MOCK)).toEqual({
      access_token: TOKEN_MOCK,
    });
    expect(userServiceSpy).toHaveBeenCalled();
    expect(userServiceSpy).toHaveBeenCalledTimes(1);
    expect(signMock).toHaveBeenCalled();
    expect(signMock).toHaveBeenCalledTimes(1);
  });

  it('should return a value from signUp', async () => {
    const userServiceSpy = jest
      .spyOn(userService, 'create')
      .mockImplementation(() =>
        Promise.resolve({ email: EMAIL_MOCK, id: ID_MOCK }),
      );

    expect(await service.signUp(EMAIL_MOCK, PASSWORD_MOCK)).toBeUndefined();
    expect(userServiceSpy).toHaveBeenCalled();
    expect(userServiceSpy).toHaveBeenCalledTimes(1);
  });
});
