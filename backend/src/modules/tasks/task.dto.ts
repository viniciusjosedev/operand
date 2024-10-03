import { IsNotEmpty, IsString } from 'class-validator';
import { Task } from './task.service.interface';

export class TaskQueryGetDto {
  @IsString()
  @IsNotEmpty()
  pageNumber: string;
}

export class TaskBodyCreateDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  status: 'pending' | 'done' | 'in progress';
}

export class TaskBodyUpdateDto implements Task {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  status: 'pending' | 'done' | 'in progress';

  @IsString()
  @IsNotEmpty()
  createdAt: string;
}
