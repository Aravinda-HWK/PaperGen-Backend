import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { QuestionService } from './question.service';

@Controller('question')
export class QuestionController {
  constructor(private questionService: QuestionService) {}

  @Post('create')
  async create(@Body() data: any) {
    return await this.questionService.create(data);
  }

  @Get('by-paper-id')
  async findByPaperId(@Query() data: { paperId: number }) {
    return await this.questionService.findByPaperId(data.paperId);
  }

  @Get('by-id')
  async findOne(@Body() data: { id: number }) {
    return await this.questionService.findOne(data.id);
  }

  @Post('check-answer')
  async checkAnswer(@Body() data: { id: number; answer: string }) {
    return await this.questionService.checkAnswer(data.id, data.answer);
  }

  @Delete('delete')
  async delete(@Body() data: { id: number }) {
    return await this.questionService.delete(data.id);
  }

  @Put('update')
  async update(@Body() data: any) {
    return await this.questionService.update(data);
  }

  @Get('question-by-clssroomId')
  async findByClassroom(@Body() data: { classroomId: number }) {
    return await this.questionService.findByClassroom(data.classroomId);
  }

  @Post('correct-question')
  async correctQuestion(@Body() data: { question: string }) {
    return await this.questionService.removeGrammerMistakes(data.question);
  }
}
