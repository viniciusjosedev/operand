import 'dotenv/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UserModule } from '../users/user.module';
import { UserService } from '../users/user.service';
import { AuthController } from './auth.controller';

const EMAIL_MOCK = 'test@operand.com';
const PASSWORD_MOCK = '123456';

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UserModule],
      providers: [AuthService, JwtService],
      controllers: [AuthController],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
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
        Promise.resolve({ email: EMAIL_MOCK, id: '1' }),
      );

    const jwtServiceSpy = jest
      .spyOn(jwtService, 'sign')
      .mockImplementation(() => 'token');

    expect(await service.signIn(EMAIL_MOCK, PASSWORD_MOCK)).toEqual({
      access_token: 'token',
    });
    expect(userServiceSpy).toHaveBeenCalled();
    expect(userServiceSpy).toHaveBeenCalledTimes(1);
    expect(jwtServiceSpy).toHaveBeenCalled();
    expect(jwtServiceSpy).toHaveBeenCalledTimes(1);
  });

  it('should return a value from signUp', async () => {
    const userServiceSpy = jest
      .spyOn(userService, 'create')
      .mockImplementation(() =>
        Promise.resolve({ email: EMAIL_MOCK, id: '1' }),
      );

    expect(await service.signUp(EMAIL_MOCK, PASSWORD_MOCK)).toBeUndefined();

    expect(userServiceSpy).toHaveBeenCalled();
    expect(userServiceSpy).toHaveBeenCalledTimes(1);
  });
});
