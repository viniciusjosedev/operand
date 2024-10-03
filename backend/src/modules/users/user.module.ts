import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthFirebase } from 'src/firebase/auth.firebase';
import { UserController } from './user.controller';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [UserController],
  providers: [UserService, AuthFirebase, JwtService],
  exports: [UserService],
})
export class UserModule {}
