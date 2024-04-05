import { Body, Controller, Post } from '@nestjs/common';
import { QuestionService } from './question.service';

@Controller('question')
export class QuestionController {
  constructor(private questionService: QuestionService) {}

  @Post('create')
  async create(@Body() data: any) {
    return await this.questionService.create(data);
  }
}
