import { Body, Controller, Post } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentDto } from './dto/student.dto';

@Controller('student')
export class StudentController {
  constructor(private studentService: StudentService) {}

  @Post('signup')
  signup(@Body() dto: StudentDto) {
    return this.studentService.signup(dto);
  }

  @Post('signin')
  signin(@Body() dto: StudentDto) {
    return this.studentService.signin(dto);
  }
}
