import { Controller, Post, Body } from '@nestjs/common';
import { PaperService } from './paper.service';
import { CreatePaperDto } from './dto/create-paper.dto'; // Import the missing CreatePaperDto class

@Controller('paper')
export class PaperController {
  constructor(private paperService: PaperService) {}

  @Post('create')
  async create(@Body() data: CreatePaperDto) {
    return await this.paperService.create(data);
  }
}
