import { Body, Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { ResultService } from './result.service';

@Controller('result')
export class ResultController {
  constructor(private resultService: ResultService) {}

  @Post('create')
  async createResult(
    @Body() data: { studentID: any; paperID: any; answer: string[] },
  ) {
    return this.resultService.create(data);
  }

  @Get('student-paper-results')
  async getStudentResults(@Body() data: { studentID: any; paperID: any }) {
    return this.resultService.getStudentResults(data.studentID, data.paperID);
  }

  @Put('update')
  async updateResult(@Body() data: { resultID: any; score: number }) {
    return this.resultService.update(data);
  }

  @Delete('delete')
  async deleteResult(@Body() data: { resultID: any }) {
    return this.resultService.delete(data.resultID);
  }

  @Get('paper-results')
  async getPaperResults(@Body() data: { paperID: any }) {
    return this.resultService.getPaperResults(data.paperID);
  }

  @Get('student-results')
  async getStudentAllResults(@Body() data: { studentID: any }) {
    return this.resultService.getStudentAllResults(data.studentID);
  }

  @Get('highest-score')
  async getHighestScore(@Body() data: { paperID: any }) {
    return this.resultService.getHighestScore(data.paperID);
  }
}