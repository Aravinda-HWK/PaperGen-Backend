import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class QuestionService {
  constructor(private prisma: PrismaService) {}

  // Add a new method to the QuestionService class that creates a new question.
  async create(data: any) {
    try {
      return await this.prisma.question.create({
        data: {
          content: data.content,
          sampleAnswer: data.sampleAnswer,
          correctAnswer: data.correctAnswer,
          paper: { connect: { id: data.paperId } },
        },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new ForbiddenException(error.message);
      }
      throw error;
    }
  }

  // Add a new method to the QuestionService class that retrieves all questions for a paper.
  async findByPaperId(paperId: number) {
    return await this.prisma.question.findMany({
      where: {
        paperId,
      },
    });
  }
}
