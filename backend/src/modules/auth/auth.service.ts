import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users/user.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async signIn(
    email: string,
    password: string,
  ): Promise<{ access_token: string }> {
    const user = await this.userService.findOne({ email, password });
    if (!user) {
      throw new UnauthorizedException();
    }

    const payload = { email: user.email, id: user.id };
    return {
      access_token: this.jwtService.sign(payload, {
        algorithm: 'HS256',
        secret: process.env.JWT_SECRET || 'secret',
        expiresIn: '30d',
      }),
    };
  }

  async signUp(email: string, password: string): Promise<void> {
    await this.userService.create({ email, password });
  }

  async forgot(email: string): Promise<void> {
    await this.userService.resetPassword(email);
  }
}
