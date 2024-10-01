import { Injectable, UnauthorizedException } from '@nestjs/common';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { AuthFirebase } from 'src/firebase/auth.firebase';

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
      console.log(err);
      throw new UnauthorizedException('User already exists');
    }
  }
}
