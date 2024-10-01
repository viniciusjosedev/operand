import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthBodyDtoSignIn } from './auth.body.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/singin')
  async singIn(
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

  @Post('/singup')
  async singUp(
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
