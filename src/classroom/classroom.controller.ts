import { Body, Controller, Post } from '@nestjs/common';
import { ClassroomService } from './classroom.service';

@Controller('classroom')
export class ClassroomController {
  constructor(private classroomService: ClassroomService) {}
}
