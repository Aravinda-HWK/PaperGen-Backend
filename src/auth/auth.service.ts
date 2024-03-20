import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}
  async signup(dto: AuthDto) {
    // Generate the password hash (salt + hash)
    const hash = await argon.hash(dto.password);
    // Create the user record in the database
    try {
      const teacher = await this.prisma.teacher.create({
        data: {
          email: dto.email,
          password: hash,
        },
      });

      // Return the user record
      delete teacher.password;
      return teacher;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Email already exists');
        }
      }

      throw error;
    }
  }

  async signin(dto: AuthDto) {
    // find the user by email
    const teacher = await this.prisma.teacher.findUnique({
      where: {
        email: dto.email,
      },
    });

    // if the user is not found, throw an error
    if (!teacher) {
      throw new ForbiddenException('Invalid credentials');
    }
    // if the user is found, compare the password hashes
    const match = await argon.verify(teacher.password, dto.password);
    // if the password hashes match, return the user record
    if (match) {
      delete teacher.password;
      return teacher;
    }
    // if the password hashes do not match, throw an error
    throw new ForbiddenException('Invalid credentials');
  }
}
