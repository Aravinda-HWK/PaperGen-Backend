import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

interface Answer {
  questionId: number;
  answer: string;
}

@Injectable()
export class ResultService {
  constructor(private prisma: PrismaService) {}

  // Create a new result
  async create(data: { studentID: any; paperID: any; answer: Answer[] }) {
    try {
      const question = await this.prisma.question.findMany({
        where: {
          paperId: data.paperID,
        },
      });

      let score = 0;

      if (question.length !== data.answer.length) {
        throw new ForbiddenException('Invalid number of answers');
      }

      for (let i = 0; i < question.length; i++) {
        if (question[i].id == data.answer[i].questionId)
          if (question[i].correctAnswer === data.answer[i].answer) {
            score++;
          }
      }
      const result = await this.prisma.result.create({
        data: {
          studentId: data.studentID,
          paperId: data.paperID,
          score,
          answers: [...data.answer.map((a) => a.answer)],
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
    const id = parseInt(studentID);
    const resultList = this.prisma.result.findMany({
      where: {
        studentId: id,
      },
    });

    // Add the paper name and description to the result
    // Get the number of questions in the paper
    const results = await Promise.all(
      (await resultList).map(async (result) => {
        const paper = await this.prisma.paper.findUnique({
          where: {
            id: result.paperId,
          },
        });

        const questions = await this.prisma.question.findMany({
          where: {
            paperId: result.paperId,
          },
        });
        return {
          ...result,
          paperName: paper?.name,
          paperDescription: paper?.description,
          numberOfQuestions: questions.length,
        };
      }),
    );

    return results;
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

  // Fetch given answers and real answers for given result id
  async getAnswers(id: any) {
    const resultID = parseInt(id);
    const result = await this.prisma.result.findUnique({
      where: {
        id: resultID,
      },
    });

    const paper = await this.prisma.paper.findUnique({
      where: {
        id: result?.paperId,
      },
    });

    const questions = await this.prisma.question.findMany({
      where: {
        paperId: result?.paperId,
      },
    });

    return {
      questions: questions.map((q) => q.content),
      answers: result?.answers,
      realAnswers: questions.map((q) => q.correctAnswer),
      paperName: paper?.name,
      paperDescription: paper?.description,
    };
  }
}
