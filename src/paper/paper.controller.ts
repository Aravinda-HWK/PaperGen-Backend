import { Controller, Post, Body, Get, Delete } from '@nestjs/common';
import { PaperService } from './paper.service';
import { CreatePaperDto } from './dto/create-paper.dto'; // Import the missing CreatePaperDto class

@Controller('paper')
export class PaperController {
  constructor(private paperService: PaperService) {}

  @Post('create')
  async create(@Body() data: CreatePaperDto) {
    return await this.paperService.create(data);
  }

  @Get('all')
  async findAll() {
    return await this.paperService.findAll();
  }

  @Get('paper-by-id')
  async findOne(@Body() data: { id: number }) {
    return await this.paperService.findOne(data.id);
  }

  @Get('paper-by-classroom')
  async findByClassroom(@Body() data: { classroomId: number }) {
    return await this.paperService.findByClassroom(data.classroomId);
  }

  @Delete('delete')
  async delete(@Body() data: { id: number }) {
    return await this.paperService.delete(data.id);
  }
}
