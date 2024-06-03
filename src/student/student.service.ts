import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { StudentDto } from './dto/student.dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import * as fs from 'fs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class StudentService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}
  async signup(dto: StudentDto) {
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
      const payload = {
        id: student.id,
        email: student.email,
      };
      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    }
    // if the password hashes do not match, throw an error
    throw new ForbiddenException('Invalid credentials');
  }

  // Find a student by id
  async findOne(id: number) {
    const studentId = parseInt(id.toString());
    try {
      const student = await this.prisma.student.findUnique({
        where: {
          id: studentId,
        },
      });
      // Remove the password field from the student record
      delete student.password;
      return student;
    } catch (error) {
      throw new ForbiddenException('Student not found');
    }
  }

  // Get the list of all students
  async findAll() {
    try {
      // Find all students

      const students = await this.prisma.student.findMany();
      // Remove the password field from each student record
      return students.map((student) => {
        delete student.password;
        return student;
      });
    } catch (error) {
      throw new ForbiddenException('Students not found');
    }
  }

  // Update a student by id
  async update(dto: any) {
    const studentId = parseInt(dto.id.toString());
    // Generate the password hash (salt + hash)
    if (dto.password) {
      dto.password = await argon.hash(dto.password);
    }
    try {
      // Update the student record
      const student = await this.prisma.student.update({
        where: {
          id: studentId,
        },
        data: {
          email: dto.email,
          password: dto.password,
          firstName: dto.firstName,
          lastName: dto.lastName,
          description: dto.description,
          photo: dto.photo.buffer,
        },
      });
      // Remove the password field from the student record
      delete student.password;
      return student;
    } catch (error) {
      throw new ForbiddenException('Student not found');
    }
  }
}
