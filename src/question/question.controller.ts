import { Body, Controller, Get, Post } from '@nestjs/common';
import { QuestionService } from './question.service';

@Controller('question')
export class QuestionController {
  constructor(private questionService: QuestionService) {}

  @Post('create')
  async create(@Body() data: any) {
    return await this.questionService.create(data);
  }

  @Get('by-paper-id')
  async findByPaperId(@Body() data: { paperId: number }) {
    return await this.questionService.findByPaperId(data.paperId);
  }

  @Get('by-id')
  async findOne(@Body() data: { id: number }) {
    return await this.questionService.findOne(data.id);
  }
}
