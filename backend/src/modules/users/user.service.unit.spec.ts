import 'dotenv/config';
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { AuthFirebase } from '../../firebase/auth.firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { EMAIL_MOCK, PASSWORD_MOCK, UUD_MOCK } from './mocks';

jest.mock('firebase/auth', () => {
  const actualFirebaseAuth = jest.requireActual('firebase/auth');

  return {
    ...actualFirebaseAuth,
    signInWithEmailAndPassword: jest.fn(),
    createUserWithEmailAndPassword: jest.fn(),
    sendPasswordResetEmail: jest.fn(),
  };
});

describe('AuthService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthFirebase, UserService],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should have a method findOne', () => {
    expect(service.findOne).toBeDefined();
  });

  it('should have a method create', () => {
    expect(service.create).toBeDefined();
  });

  it('should have a method resetPassword', () => {
    expect(service.resetPassword).toBeDefined();
  });
  it('should return a value from findOne', async () => {
    (signInWithEmailAndPassword as jest.Mock).mockResolvedValue(
      Promise.resolve({ user: { uid: UUD_MOCK, email: EMAIL_MOCK } }),
    );

    const user = await service.findOne({
      email: EMAIL_MOCK,
      password: PASSWORD_MOCK,
    });

    expect(user).toEqual({ id: UUD_MOCK, email: EMAIL_MOCK });
    expect(signInWithEmailAndPassword).toHaveBeenCalled();
    expect(signInWithEmailAndPassword).toHaveBeenCalledTimes(1);
  });

  it('should return a value from create', async () => {
    (createUserWithEmailAndPassword as jest.Mock).mockResolvedValue(
      Promise.resolve({ user: { uid: UUD_MOCK, email: EMAIL_MOCK } }),
    );

    const user = await service.create({
      email: EMAIL_MOCK,
      password: PASSWORD_MOCK,
    });

    expect(user).toEqual({ id: UUD_MOCK, email: EMAIL_MOCK });

    expect(createUserWithEmailAndPassword).toHaveBeenCalled();
    expect(createUserWithEmailAndPassword).toHaveBeenCalledTimes(1);
  });

  it('should return a value from create', async () => {
    (sendPasswordResetEmail as jest.Mock).mockResolvedValue(Promise.resolve());

    const user = await service.resetPassword(EMAIL_MOCK);

    expect(user).toBeUndefined();

    expect(createUserWithEmailAndPassword).toHaveBeenCalled();
    expect(createUserWithEmailAndPassword).toHaveBeenCalledTimes(1);
  });
});
