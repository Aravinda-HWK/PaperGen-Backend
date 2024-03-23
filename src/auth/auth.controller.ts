import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
  Headers,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() dto: AuthDto) {
    return this.authService.signup(dto);
  }

  @Post('signin')
  signin(@Body() dto: AuthDto) {
    return this.authService.signin(dto);
  }

  @Get()
  findTeacherById(@Query('id') id: number) {
    return this.authService.findTeacherById(id);
  }

  @Get('findAll')
  findAll() {
    return this.authService.findAllTeachers();
  }

  @Post('update')
  @UseInterceptors(FileInterceptor('photo'))
  update(@Headers() dto: any, @UploadedFile() photo: Express.Multer.File) {
    if (photo) {
      dto.photo = photo;
    }
    return this.authService.updateTeacher(dto);
  }
}
