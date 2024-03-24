import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePaperDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  numberOfQuestions: number;

  @IsNumber()
  @IsNotEmpty()
  classroomId: number;

  @IsNotEmpty()
  startTime: string | Date;

  @IsNotEmpty()
  endTime: string | Date;
}
