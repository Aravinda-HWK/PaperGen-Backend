import { Body, Controller, Post, Put } from '@nestjs/common';
import { ClassroomService } from './classroom.service';

@Controller('classroom')
export class ClassroomController {
  constructor(private classroomService: ClassroomService) {}

  @Put()
  async createClassroom(@Body() data: { name: string; teacherID: any }) {
    return this.classroomService.createClassroom(data);
  }
}
