import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthFirebase } from 'src/firebase/auth.firebase';

@Module({
  providers: [UserService, AuthFirebase],
  exports: [UserService],
})
export class UserModule {}
