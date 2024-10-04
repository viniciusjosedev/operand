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
  Req,
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
import { Request } from 'express';

@Controller('task')
@UseGuards(AuthGuard)
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Get('/')
  async index(
    @Req() req: Request,
    @Query(
      new ValidationPipe({
        forbidNonWhitelisted: true,
      }),
    )
    query: TaskQueryGetDto,
  ) {
    console.log({ query });

    const tasks = await this.taskService.findAll({
      id: req.user.id,
      pageNumber: query.pageNumber,
      status: query.status,
    });

    return tasks;
  }

  @Post('/create')
  @HttpCode(201)
  async create(
    @Req() req: Request,
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

  @Put('/update/:taskId')
  @HttpCode(200)
  async update(
    @Req() req: Request,
    @Body(
      new ValidationPipe({
        forbidNonWhitelisted: true,
      }),
    )
    body: TaskBodyUpdateDto,
    @Param() param: { taskId: string },
  ) {
    const taskUpdate = await this.taskService.update({
      id: req.user.id,
      task: {
        ...body,
        id: param.taskId,
      },
    });

    return taskUpdate;
  }

  @Delete('/delete/:taskId')
  @HttpCode(204)
  async delete(
    @Req() req: Request,
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
