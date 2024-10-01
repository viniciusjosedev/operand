import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [TaskController],
  providers: [TaskService, JwtService],
})
export class TaskModule {}
