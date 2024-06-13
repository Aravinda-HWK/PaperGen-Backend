import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
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

  // Add a new method to the QuestionService class that retrieves a question by ID.
  async findOne(id: number) {
    try {
      const result = await this.prisma.question.findUnique({
        where: {
          id,
        },
      });

      if (!result) {
        throw new ForbiddenException('Question not found');
      } else {
        return result;
      }
    } catch (error) {
      throw error;
    }
  }

  // Check the answer is correct or not
  async checkAnswer(id: number, answer: string) {
    try {
      const question = await this.prisma.question.findUnique({
        where: {
          id,
        },
      });

      if (!question) {
        throw new ForbiddenException('Question not found');
      }

      return question.correctAnswer === answer;
    } catch (error) {
      throw error;
    }
  }

  // Add a new method to the QuestionService class that deletes a question by ID.
  async delete(id: number) {
    try {
      const result = await this.prisma.question.delete({
        where: {
          id,
        },
      });

      if (!result) {
        throw new ForbiddenException('Question not found');
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

  // Add a new method to the QuestionService class that updates a question by ID.
  async update(data: any) {
    try {
      const result = await this.prisma.question.update({
        where: {
          id: data.id,
        },
        data: {
          content: data.content,
          sampleAnswer: data.sampleAnswer,
          correctAnswer: data.correctAnswer,
        },
      });

      if (!result) {
        throw new ForbiddenException('Question not found');
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

  // Add a new method to the QuestionService class that retrieves a question by classroom ID.
  async findByClassroom(id: number) {
    try {
      return await this.prisma.question.findMany({
        where: {
          paper: {
            classroomId: id,
          },
        },
      });
    } catch (error) {
      throw error;
    }
  }
}
