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
}
