import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { StudentDto } from './dto/student.dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class StudentService {
  constructor(private prisma: PrismaService) {}
  async signup(dto: StudentDto) {
    console.log('dto', dto);
    // Generate the password hash (salt + hash)
    const hash = await argon.hash(dto.password);
    // Create the user record in the database
    try {
      const student = await this.prisma.student.create({
        data: {
          email: dto.email,
          password: hash,
        },
      });

      // Return the user record
      delete student.password;
      return student;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Email already exists');
        }
      }

      throw error;
    }
  }

  async signin(dto: StudentDto) {
    // find the user by email
    const student = await this.prisma.student.findUnique({
      where: {
        email: dto.email,
      },
    });

    // if the user is not found, throw an error
    if (!student) {
      throw new ForbiddenException('Invalid credentials');
    }
    // if the user is found, compare the password hashes
    const match = await argon.verify(student.password, dto.password);
    // if the password hashes match, return the user record
    if (match) {
      delete student.password;
      return student;
    }
    // if the password hashes do not match, throw an error
    throw new ForbiddenException('Invalid credentials');
  }
}
