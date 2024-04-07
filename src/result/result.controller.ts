import { Body, Controller, Get, Post } from '@nestjs/common';
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
}
