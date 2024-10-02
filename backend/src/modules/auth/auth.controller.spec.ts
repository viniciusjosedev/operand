import 'dotenv/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UserModule } from '../users/user.module';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UserModule],
      providers: [AuthService, JwtService],
      controllers: [AuthController],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should have a method singIn', () => {
    expect(controller.signIn).toBeDefined();
  });

  it('should have a method singUp', () => {
    expect(controller.signUp).toBeDefined();
  });

  it('should return a value from singIn', async () => {
    const authServiceSpy = jest
      .spyOn(authService, 'signIn')
      .mockImplementation(() => Promise.resolve({ access_token: 'token' }));

    expect(
      await controller.signIn({
        email: 'test@gmail.com',
        password: '123456',
      }),
    ).toEqual({
      access_token: 'token',
    });

    expect(authServiceSpy).toHaveBeenCalled();
    expect(authServiceSpy).toHaveBeenCalledTimes(1);
  });

  it('should return a value from singUp', async () => {
    const authServiceSpy = jest
      .spyOn(authService, 'signUp')
      .mockImplementation(() => Promise.resolve());

    expect(
      await controller.signUp({
        email: 'test@gmail.com',
        password: '123456',
      }),
    ).toEqual(undefined);

    expect(authServiceSpy).toHaveBeenCalled();
    expect(authServiceSpy).toHaveBeenCalledTimes(1);
  });
});
