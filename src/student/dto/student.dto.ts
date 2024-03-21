import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class StudentDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
