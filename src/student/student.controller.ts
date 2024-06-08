import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentDto } from './dto/student.dto';
import { FileInterceptor } from '@nestjs/platform-express';

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

  @Get('findAll')
  findAll() {
    return this.studentService.findAll();
  }

  @Post('update')
  update(@Body() dto: any) {
    return this.studentService.update(dto);
  }

  @Get('allStudentsForTeacher')
  allStudentsForTeacher(@Query('teacherID') teacherID: number) {
    return this.studentService.getTeacherStudents(teacherID);
  }
}
