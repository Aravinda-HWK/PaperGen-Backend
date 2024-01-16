import { Body, Controller, ParseIntPipe, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/index';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() dto: AuthDto) {
    return this.authService.signup(dto);
  }

  @Post('signin')
  signin() {
    return this.authService.signin();
  }
}
