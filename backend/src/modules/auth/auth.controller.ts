import {
  Body,
  Controller,
  HttpCode,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthBodyDtoSignIn } from './auth.body.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signin')
  @HttpCode(200)
  async signIn(
    @Body(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    )
    body: AuthBodyDtoSignIn,
  ) {
    return this.authService.signIn(body.email, body.password);
  }

  @Post('/signup')
  @HttpCode(201)
  async signUp(
    @Body(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    )
    body: AuthBodyDtoSignIn,
  ) {
    return this.authService.signUp(body.email, body.password);
  }
}
