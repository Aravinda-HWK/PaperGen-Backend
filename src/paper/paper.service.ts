import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { CreatePaperDto } from './dto/create-paper.dto';

@Injectable()
export class PaperService {
  constructor(private prisma: PrismaService) {}

  // Add a new method to the PaperService class that creates a new paper.
  async create(data: CreatePaperDto) {
    try {
      if (
        typeof data.startTime === 'object' &&
        data.startTime instanceof Date &&
        typeof data.endTime === 'object' &&
        data.endTime instanceof Date
      ) {
        data.startTime = new Date(data.startTime);
        data.endTime = new Date(data.endTime);
      } else {
        data.startTime = new Date(data.startTime);
        data.endTime = new Date(data.endTime);
      }
      return await this.prisma.paper.create({
        data: {
          name: data.name,
          description: data.description,
          startTime: data.startTime,
          endTime: data.endTime,
          numberOfQuestions: data.numberOfQuestions,
          classroom: { connect: { id: data.classroomId } },
        },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new ForbiddenException(error.message);
      }
      throw error;
    }
  }

  // Add a new method to the PaperService class that retrieves all papers.
  async findAll() {
    return await this.prisma.paper.findMany();
  }

  // Add a new method to the PaperService class that retrieves a paper by ID.
  async findOne(id: number) {
    try {
      const result = await this.prisma.paper.findUnique({
        where: {
          id,
        },
      });

      if (!result) {
        throw new ForbiddenException('Paper not found');
      } else {
        return result;
      }
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new ForbiddenException(error.message);
      }
      throw error;
    }
  }
}
