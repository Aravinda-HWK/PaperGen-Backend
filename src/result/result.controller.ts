import { Body, Controller, Get, Post } from '@nestjs/common';
import { ResultService } from './result.service';

@Controller('result')
export class ResultController {
  constructor(private resultService: ResultService) {}
}
