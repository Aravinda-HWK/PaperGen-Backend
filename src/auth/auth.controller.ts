import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { JwtGuard } from './guard';

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

  @UseGuards(JwtGuard)
  @Get()
  findTeacherById(@Query('id') id: number) {
    return this.authService.findTeacherById(id);
  }

  @Get('findAll')
  findAll() {
    return this.authService.findAllTeachers();
  }

  @Post('update')
  update(@Body() dto: any) {
    return this.authService.updateTeacher(dto);
  }
}
