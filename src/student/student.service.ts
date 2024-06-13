import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StudentDto } from './dto/student.dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class StudentService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}
  async signup(dto: StudentDto) {
    // Generate the password hash (salt + hash)
    const salt = 'a1b2c3d4e5f607081920abcdefabcdef';
    const hash = await argon.hash(dto.password, {
      salt: Buffer.from(salt),
    });
    // Create the user record in the database
    try {
      const student1 = await this.prisma.student.findUnique({
        where: {
          email: dto.email,
        },
      });
      if (student1) {
        throw new ForbiddenException('Email already exists');
      }
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
    const salt = 'a1b2c3d4e5f607081920abcdefabcdef';
    // if the user is found, compare the password hashes
    const match = await argon.verify(student.password, dto.password, {
      salt: Buffer.from(salt),
    });
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
      const salt = 'a1b2c3d4e5f607081920abcdefabcdef';
      dto.password = await argon.hash(dto.password, {
        salt: Buffer.from(salt),
      });
    }
    try {
      if (dto.email) {
        const student1 = await this.prisma.student.findUnique({
          where: {
            email: dto.email,
          },
        });
        if (student1) {
          throw new ForbiddenException('Email already exists');
        }
      }
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
          photo: dto.photo,
        },
      });
      // Remove the password field from the student record
      delete student.password;
      return student;
    } catch (error) {
      throw new ForbiddenException('Student not found');
    }
  }

  // Get all the students for a teacher
  async getTeacherStudents(teacherID: any) {
    const teacherId = parseInt(teacherID.toString());
    const teacher = await this.prisma.teacher.findUnique({
      where: { id: teacherId },
    });

    if (!teacher) {
      throw new ForbiddenException('Teacher does not exist');
    } else {
      const classrooms = await this.prisma.teacher
        .findUnique({
          where: { id: teacherId },
        })
        .classrooms();

      let students: any[] = [];
      for (let i = 0; i < classrooms.length; i++) {
        const studentsInClassroom = await this.prisma.student.findMany({
          where: { classrooms: { some: { id: classrooms[i].id } } },
        });
        studentsInClassroom.forEach((student) => {
          delete student.password;
          // Add the classroom name and id to the student record
          student['classroom'] = {
            id: classrooms[i].id,
            name: classrooms[i].name,
          };
        });
        students = students.concat(studentsInClassroom);
      }
      return students;
    }
  }
}
