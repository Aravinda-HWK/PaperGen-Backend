import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Query,
} from '@nestjs/common';
import { RequestService } from './request.service';

@Controller('request')
export class RequestController {
  constructor(private requestService: RequestService) {}

  @Post('create')
  async create(
    @Body() data: { studentId: number; classroomId: number; message: string },
  ) {
    return await this.requestService.create(data);
  }
}
