import { Body, Controller, Get, Post, Query } from '@nestjs/common';
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

  @Get()
  findOne(@Query('id') id: number) {
    return this.studentService.findOne(id);
  }

  @Get()
  findAll() {
    return this.studentService.findAll();
  }

  @Post('update')
  update(@Body() dto: any) {
    return this.studentService.update(dto);
  }
}
