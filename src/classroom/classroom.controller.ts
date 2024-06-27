import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ClassroomService } from './classroom.service';

@Controller('classroom')
export class ClassroomController {
  constructor(private classroomService: ClassroomService) {}

  @Post()
  async createClassroom(
    @Body() data: { name: string; teacherID: any; description?: string },
  ) {
    return this.classroomService.createClassroom(data);
  }

  @Get('teacher-classrooms')
  async getTeacherClassrooms(@Query() data: { teacherID: any }) {
    return this.classroomService.getTeacherClassrooms(data.teacherID);
  }

  @Get('all-classrooms')
  async getClassrooms() {
    return this.classroomService.getClassrooms();
  }

  @Put('add-student')
  async addStudent(@Body() data: { classroomID: any; email: any }) {
    return this.classroomService.addStudent(data);
  }

  @Get('students')
  async getStudents(@Body() data: { classroomID: any }) {
    return this.classroomService.getStudents(data.classroomID);
  }

  @Put('update-details')
  async updateClassroomDetails(
    @Body() data: { classroomID: any; name: string; description: string },
  ) {
    return this.classroomService.updateClassroom(data);
  }

  @Delete('delete')
  async deleteClassroom(@Body() data: { classroomID: any }) {
    return this.classroomService.deleteClassroom(data.classroomID);
  }

  @Delete('delete-student')
  async deleteStudent(@Body() data: { classroomID: any; studentID: any }) {
    return this.classroomService.deleteStudent(data);
  }

  @Get('classroom-by-student')
  async getClassroomByStudent(@Query() data: { studentID: any }) {
    return this.classroomService.getStudentClassrooms(data.studentID);
  }
}
