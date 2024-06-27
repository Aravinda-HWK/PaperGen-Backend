import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
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

  // Add a new method to the PaperService class that retrieves a paper by classroom ID.
  async findByClassroom(id: number) {
    try {
      return await this.prisma.paper.findMany({
        where: {
          classroomId: id,
        },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new ForbiddenException(error.message);
      }
      throw error;
    }
  }

  // Add a new method to the PaperService class that deletes a paper by ID.
  async delete(id: number) {
    try {
      const result = await this.prisma.paper.delete({
        where: {
          id,
        },
      });

      if (!result) {
        throw new ForbiddenException('Paper not found');
      } else {
        return { message: 'Paper deleted successfully', result };
      }
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new ForbiddenException(error.message);
      }
      throw error;
    }
  }

  // Add a new method to the PaperService class that updates a paper by ID.
  async update(id: number, data: CreatePaperDto) {
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
      id = Number(id);
      return await this.prisma.paper.update({
        where: {
          id,
        },
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

  // Add a new method to the PaperService class that retrieves papers for given teacher ID.
  async findByTeacher(id: number) {
    try {
      return await this.prisma.paper.findMany({
        where: {
          classroom: {
            teacherId: parseInt(id.toString()),
          },
        },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new ForbiddenException(error.message);
      }
      throw error;
    }
  }

  // Get all the papers for a given student ID.
  async findByStudent(id: number) {
    try {
      let paperList = await this.prisma.paper.findMany({
        where: {
          classroom: {
            students: {
              some: {
                id: parseInt(id.toString()),
              },
            },
          },
        },
      });

      // Check if the end time of the paper has passed, if passed remove those papers from the list
      paperList = paperList.filter((paper) => {
        return new Date(paper.endTime) > new Date();
      });

      // Find the number of question in each paper
      for (let i = 0; i < paperList.length; i++) {
        const questions = await this.prisma.question.findMany({
          where: {
            paperId: paperList[i].id,
          },
        });
        paperList[i]['usedNumberOfQuestions'] = questions.length;
      }

      return paperList;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new ForbiddenException(error.message);
      }
      throw error;
    }
  }
}
