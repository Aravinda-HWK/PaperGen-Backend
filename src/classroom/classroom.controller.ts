import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import { ClassroomService } from './classroom.service';

@Controller('classroom')
export class ClassroomController {
  constructor(private classroomService: ClassroomService) {}

  @Post()
  async createClassroom(@Body() data: { name: string; teacherID: any }) {
    return this.classroomService.createClassroom(data);
  }

  @Get('teacher-classrooms')
  async getTeacherClassrooms(@Body() data: { teacherID: any }) {
    return this.classroomService.getTeacherClassrooms(data.teacherID);
  }

  @Get('all-classrooms')
  async getClassrooms() {
    return this.classroomService.getClassrooms();
  }
}
