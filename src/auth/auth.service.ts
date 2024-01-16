import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}
  async signup(dto: AuthDto) {
    // Generate the password hash (salt + hash)
    console.log(dto);
    const hash = await argon.hash(dto.password);
    // Create the user record in the database
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        hash,
      },
    });
    // Return the user record
    delete user.hash;
    return user;
  }

  signin() {
    return {
      message: 'I am sign up',
    };
  }
}
