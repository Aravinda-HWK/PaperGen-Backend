import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class ClassroomService {
  constructor(private prisma: PrismaService) {}

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
        throw new ForbiddenException(
          'You are not allowed to create a classroom',
        );
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
        throw new ForbiddenException(
          'You are not allowed to create a classroom',
        );
      }
      throw error;
    }
  }
}
