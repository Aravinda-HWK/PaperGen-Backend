import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}
  async signup(dto: AuthDto) {
    const salt = 'a1b2c3d4e5f607081920abcdefabcdef';

    // Hash the password with the salt
    const hash = await argon.hash(dto.password, {
      salt: Buffer.from(salt),
    });
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

    const salt = 'a1b2c3d4e5f607081920abcdefabcdef';

    // if the user is found, compare the password hashes
    const match = await argon.verify(teacher.password, dto.password, {
      salt: Buffer.from(salt),
    });
    // if the password hashes match, return the user record
    if (match) {
      const payload = {
        id: teacher.id,
        email: teacher.email,
      };
      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    }
    // if the password hashes do not match, throw an error
    throw new ForbiddenException('Invalid credentials');
  }

  // Find a teacher by id
  async findTeacherById(id: number) {
    const teacherId = parseInt(id.toString());
    try {
      const teacher = await this.prisma.teacher.findUnique({
        where: {
          id: teacherId,
        },
      });
      delete teacher.password;
      return teacher;
    } catch (error) {
      throw new ForbiddenException('Teacher not found');
    }
  }

  //Get all the teachers
  async findAllTeachers() {
    try {
      // Get all the teachers
      const teachers = await this.prisma.teacher.findMany();
      return teachers.map((teacher) => {
        // Remove the password field from the teacher record
        delete teacher.password;
        return teacher;
      });
    } catch (error) {
      throw new ForbiddenException('Teachers not found');
    }
  }

  // Update the teacher record
  async updateTeacher(dto: any) {
    console.log(dto);
    const teacherId = parseInt(dto.id.toString());
    // Generate the password hash (salt + hash)
    if (dto.password) {
      const salt = 'a1b2c3d4e5f607081920abcdefabcdef';
      dto.password = await argon.hash(dto.password, {
        salt: Buffer.from(salt),
      });
    }
    try {
      // Update the teacher record
      const teacher = await this.prisma.teacher.update({
        where: {
          id: teacherId,
        },
        data: {
          email: dto.email,
          password: dto.password,
          firstName: dto.firstName,
          lastName: dto.lastName,
          description: dto.description,
          photo: dto.photo,
        },
      });
      // Remove the password field from the teacher record
      delete teacher.password;
      return teacher;
    } catch (error) {
      throw new ForbiddenException('Teacher not found');
    }
  }
}
