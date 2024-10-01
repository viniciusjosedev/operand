import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { TaskService } from './task.service';
import { AuthGuard } from 'src/guard/auth.guard';

@Controller('task')
@UseGuards(AuthGuard)
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Get('/')
  async index(@Request() req) {
    console.log('teste', req.user);

    return 'teste';
  }
}
