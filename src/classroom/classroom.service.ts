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

  // Add a student to a classroom
  async addStudent(dto: { classroomID: any; studentID: any }) {
    try {
      let classroom: {
        id: any;
        createdAt?: Date;
        updatedAt?: Date;
        name?: string;
        teacherId?: any;
      };
      try {
        classroom = await this.prisma.classroom.findUnique({
          where: { id: dto.classroomID },
        });
      } catch {
        throw new ForbiddenException('Classroom does not exist');
      }
      let student: {
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
        student = await this.prisma.student.findUnique({
          where: { id: dto.studentID },
        });
      } catch {
        throw new ForbiddenException('Student does not exist');
      }
      return await this.prisma.classroom.update({
        where: { id: dto.classroomID },
        data: {
          students: {
            connect: { id: student.id },
          },
        },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new ForbiddenException('Student is already in the classroom');
        } else {
          throw new ForbiddenException('An error occurred');
        }
      }
      throw error;
    }
  }

  // Get all students in a classroom
  async getStudents(classroomID: any) {
    const classroom = await this.prisma.classroom.findUnique({
      where: { id: classroomID },
    });

    if (!classroom) {
      throw new ForbiddenException('Classroom does not exist');
    } else {
      return await this.prisma.classroom
        .findUnique({
          where: { id: classroomID },
        })
        .students();
    }
  }

  // Update the classroom details
  async updateClassroom(dto: {
    classroomID: any;
    name: string;
    description: string;
  }) {
    try {
      return await this.prisma.classroom.update({
        where: { id: dto.classroomID },
        data: { name: dto.name, description: dto.description },
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

  // Delete a classroom
  async deleteClassroom(classroomID: any) {
    try {
      return await this.prisma.classroom.delete({
        where: { id: classroomID },
      });
    } catch {
      throw new ForbiddenException('Classroom does not exist');
    }
  }

  // Delete a student from a classroom
  async deleteStudent(dto: { classroomID: any; studentID: any }) {
    try {
      return await this.prisma.classroom.update({
        where: { id: dto.classroomID },
        data: {
          students: {
            disconnect: { id: dto.studentID },
          },
        },
      });
    } catch {
      throw new ForbiddenException('Student is not in the classroom');
    }
  }
}
