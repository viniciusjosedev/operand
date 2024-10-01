import { IsEmail, IsString, Length } from 'class-validator';

export class AuthBodyDtoSignIn {
  @IsEmail()
  email: string;

  @IsString()
  @Length(6)
  password: string;
}
