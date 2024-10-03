import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { JwtService } from '@nestjs/jwt';
import { DatabaseFirebase } from 'src/firebase/database.firebase';
import { RedisCache } from 'src/cache/redis';

@Module({
  controllers: [TaskController],
  providers: [TaskService, JwtService, DatabaseFirebase, RedisCache],
})
export class TaskModule {}
