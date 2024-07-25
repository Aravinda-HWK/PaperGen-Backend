import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class RequestService {
  constructor(private prisma: PrismaService) {}

  // Add a new method to the RequestService class that creates a new request.
  async create(data: { studentId: number; classroomId: number }) {
    try {
      return await this.prisma.$transaction(async (prisma) => {
        const newRequest = await prisma.request.create({
          data: {
            student: { connect: { id: data.studentId } },
            classroom: { connect: { id: data.classroomId } },
          },
        });

        return newRequest;
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new ForbiddenException(error.message);
      }
      throw error;
    }
  }
}
