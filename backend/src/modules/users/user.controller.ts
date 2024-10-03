import { Controller, Get, HttpCode, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guard/auth.guard';
import { UserService } from './user.service';
import { Request } from 'express';

@Controller('user')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @HttpCode(200)
  @Get('/me')
  async me(@Req() req: Request) {
    return {
      email: req.user.email,
    };
  }
}
