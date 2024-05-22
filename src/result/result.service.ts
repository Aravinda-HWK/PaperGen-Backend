import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class ResultService {
  constructor(private prisma: PrismaService) {}

  // Create a new result
  async create(data: { studentID: any; paperID: any; answer: string[] }) {
    try {
      const question = await this.prisma.question.findMany({
        where: {
          paperId: data.paperID,
        },
      });

      let score = 0;

      if (question.length !== data.answer.length) {
        throw new ForbiddenException('Invalid answer');
      }

      for (let i = 0; i < question.length; i++) {
        if (question[i].correctAnswer === data.answer[i]) {
          score++;
        }
      }

      const result = await this.prisma.result.create({
        data: {
          studentId: data.studentID,
          paperId: data.paperID,
          score,
          answers: data.answer,
        },
      });
      return result;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new ForbiddenException(error.message);
      }
      throw error;
    }
  }

  // Get all results for a student for a paper
  async getStudentResults(studentID: any, paperID: any) {
    return this.prisma.result.findMany({
      where: {
        studentId: studentID,
        paperId: paperID,
      },
    });
  }

  // Update a result
  async update(data: { resultID: any; score: number }) {
    return this.prisma.result.update({
      where: {
        id: data.resultID,
      },
      data: {
        score: data.score,
      },
    });
  }

  // Delete a result
  async delete(resultID: any) {
    return this.prisma.result.delete({
      where: {
        id: resultID,
      },
    });
  }

  // Get all results for a paper
  async getPaperResults(paperID: any) {
    return this.prisma.result.findMany({
      where: {
        paperId: paperID,
      },
    });
  }

  // Get all results for a student
  async getStudentAllResults(studentID: any) {
    return this.prisma.result.findMany({
      where: {
        studentId: studentID,
      },
    });
  }

  // Get the highest score for a paper given the paper ID
  async getHighestScore(paperID: any) {
    return this.prisma.result.findFirst({
      where: {
        paperId: paperID,
      },
      orderBy: {
        score: 'desc',
      },
    });
  }
}
