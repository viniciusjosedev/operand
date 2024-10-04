import {
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/guard/auth.guard';
import { UserService } from './user.service';
import { Request, Response } from 'express';

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

  @HttpCode(200)
  @Post('/logout')
  async logout(@Res() res: Response) {
    res.clearCookie('token');
    res.send();
  }
}
