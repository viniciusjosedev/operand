import {
  Body,
  Controller,
  HttpCode,
  Post,
  Res,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthBodyDtoForgot, AuthBodyDtoSignIn } from './auth.body.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signin')
  @HttpCode(200)
  async signIn(
    @Res()
    res: Response,
    @Body(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    )
    body: AuthBodyDtoSignIn,
  ) {
    const accessToken = await this.authService.signIn(
      body.email,
      body.password,
    );

    res.cookie('token', accessToken.access_token, {
      httpOnly: true,
      secure: true,
      expires: new Date(Date.now() + 60 * 60 * 24 * 60 * 1000),
    });

    return res.json(accessToken);
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

  @Post('/forgot')
  @HttpCode(200)
  async forgot(
    @Body(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    )
    body: AuthBodyDtoForgot,
  ) {
    await this.authService.forgot(body.email);

    return;
  }
}
