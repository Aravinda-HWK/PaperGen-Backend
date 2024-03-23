import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class ClassroomService {
  constructor(private prisma: PrismaService) {}

  // Create a classroom
  async createClassroom(dto: { teacherID: any; name: string }) {
    try {
      let teacher: {
        id: any;
        createdAt?: Date;
        updatedAt?: Date;
        email?: string;
        password?: string;
        firstName?: string;
        lastName?: string;
        photo?: Buffer;
        description?: string;
      };
      try {
        teacher = await this.prisma.teacher.findUnique({
          where: { id: dto.teacherID },
        });
      } catch {
        throw new ForbiddenException('Teacher does not exist');
      }
      return await this.prisma.classroom.create({
        data: {
          name: dto.name,
          teacher: {
            connect: { id: teacher.id },
          },
        },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Classroom name is already taken');
        } else {
          throw new ForbiddenException('An error occurred');
        }
      }
      throw error;
    }
  }

  // Get all classrooms for a teacher
  async getTeacherClassrooms(teacherID: any) {
    return await this.prisma.classroom.findMany({
      where: { teacherId: teacherID },
    });
  }

  // Get all classrooms
  async getClassrooms() {
    return await this.prisma.classroom.findMany();
  }
}
