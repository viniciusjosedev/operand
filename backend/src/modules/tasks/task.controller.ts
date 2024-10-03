import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { AuthGuard } from 'src/guard/auth.guard';
import {
  TaskBodyCreateDto,
  TaskBodyUpdateDto,
  TaskQueryGetDto,
} from './task.dto';

@Controller('task')
@UseGuards(AuthGuard)
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Get('/')
  async index(
    @Request() req,
    @Query(
      new ValidationPipe({
        forbidNonWhitelisted: true,
      }),
    )
    query: TaskQueryGetDto,
  ) {
    const tasks = await this.taskService.findAll({
      id: req.user.id,
      pageNumber: query.pageNumber,
    });

    return tasks;
  }

  @Post('/create')
  @HttpCode(201)
  async create(
    @Request() req,
    @Body(
      new ValidationPipe({
        forbidNonWhitelisted: true,
      }),
    )
    body: TaskBodyCreateDto,
  ) {
    await this.taskService.create({
      id: req.user.id,
      task: body,
    });

    return;
  }

  @Put('/update')
  @HttpCode(200)
  async update(
    @Request() req,
    @Body(
      new ValidationPipe({
        forbidNonWhitelisted: true,
      }),
    )
    body: TaskBodyUpdateDto,
  ) {
    const taskUpdate = await this.taskService.update({
      id: req.user.id,
      task: body,
    });

    return taskUpdate;
  }

  @Delete('/delete/:taskId')
  @HttpCode(204)
  async delete(
    @Request() req,
    @Param()
    param: { taskId: string },
  ) {
    await this.taskService.delete({
      id: req.user.id,
      taskId: param.taskId,
    });

    return;
  }
}
