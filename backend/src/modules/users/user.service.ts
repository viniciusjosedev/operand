import { Injectable, UnauthorizedException } from '@nestjs/common';
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { AuthFirebase } from 'src/firebase/auth.firebase';
import logger from 'src/log/logger';

@Injectable()
export class UserService {
  constructor(private authFirebase: AuthFirebase) {}

  async findOne({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<{ id: string; email: string }> {
    const user = await signInWithEmailAndPassword(
      this.authFirebase.auth,
      email,
      password,
    );

    return {
      id: user.user.uid,
      email: user.user.email,
    };
  }

  async create({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<{ id: string; email: string }> {
    try {
      const user = await createUserWithEmailAndPassword(
        this.authFirebase.auth,
        email,
        password,
      );

      return {
        id: user.user.uid,
        email: user.user.email,
      };
    } catch (err) {
      logger.error(err);
      throw new UnauthorizedException('User already exists');
    }
  }

  async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(this.authFirebase.auth, email);
    } catch (err) {
      logger.error(err);
      throw new UnauthorizedException('Error sending password reset email');
    }
  }
}
