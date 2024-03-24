import { Controller } from '@nestjs/common';
import { PaperService } from './paper.service';

@Controller('paper')
export class PaperController {
  constructor(private paperService: PaperService) {}
}
