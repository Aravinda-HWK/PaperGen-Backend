import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
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
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
        },
      });

      // Return the user record
      delete user.hash;
      return user;
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
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    // if the user is not found, throw an error
    if (!user) {
      throw new ForbiddenException('Invalid credentials');
    }
    // if the user is found, compare the password hashes
    const match = await argon.verify(user.hash, dto.password);
    // if the password hashes match, return the user record
    if (match) {
      delete user.hash;
      return user;
    }
    // if the password hashes do not match, throw an error
    throw new ForbiddenException('Invalid credentials');
  }
}
