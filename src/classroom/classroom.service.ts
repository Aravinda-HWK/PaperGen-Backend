import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class ClassroomService {
  constructor(private prisma: PrismaService) {}

  // Create a classroom
  async createClassroom(dto: {
    teacherID: any;
    name: string;
    description?: string;
  }) {
    try {
      let teacher: {
        id: any;
        createdAt?: Date;
        updatedAt?: Date;
        email?: string;
        password?: string;
        firstName?: string;
        lastName?: string;
        photo?: string;
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
          description: dto.description,
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
    // Change the teacher Id to number
    teacherID = parseInt(teacherID);
    const classrooms = await this.prisma.classroom.findMany({
      where: { teacherId: teacherID },
    });
    for (let i = 0; i < classrooms.length; i++) {
      const students = await this.prisma.student.findMany({
        where: { classrooms: { some: { id: classrooms[i].id } } },
      });
      classrooms[i]['numberOfStudents'] = students.length;
    }
    return classrooms;
  }

  // Get all classrooms
  async getClassrooms(studentId: any) {
    const studentID = parseInt(studentId);
    // Need to get the teacher details along with the classroom details
    const classrooms = await this.prisma.classroom.findMany();

    // Remove if the student is already in the classroom
    for (let i = 0; i < classrooms.length; i++) {
      const students = await this.prisma.student.findMany({
        where: { classrooms: { some: { id: classrooms[i].id } } },
      });
      for (let j = 0; j < students.length; j++) {
        if (students[j].id === studentID) {
          classrooms.splice(i, 1);
          i--;
          break;
        }
      }
    }

    // Remove if the student has already sent a request to join the classroom
    for (let i = 0; i < classrooms.length; i++) {
      const requests = await this.prisma.request.findMany({
        where: { studentId: studentID, classroomId: classrooms[i].id },
      });
      if (requests.length > 0) {
        classrooms.splice(i, 1);
        i--;
      }
    }

    // Add the teacher details to the classroom
    for (let i = 0; i < classrooms.length; i++) {
      const teacher = await this.prisma.teacher.findUnique({
        where: { id: classrooms[i].teacherId },
      });
      classrooms[i]['teacher'] = teacher;
    }
    return classrooms;
  }

  // Add a student to a classroom
  async addStudent(dto: { classroomID: any; email: string }) {
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
        photo?: string;
        description?: string;
      };
      try {
        student = await this.prisma.student.findUnique({
          where: { email: dto.email },
        });
        return await this.prisma.classroom.update({
          where: { id: dto.classroomID },
          data: {
            students: {
              connect: { id: student.id },
            },
          },
        });
      } catch {
        throw new ForbiddenException('Student does not exist');
      }
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

  // Get all the classrooms for a student
  async getStudentClassrooms(studentID: any) {
    // Change the student Id to number
    studentID = parseInt(studentID);
    let classroomList = await this.prisma.classroom.findMany({
      where: { students: { some: { id: studentID } } },
    });

    for (let i = 0; i < classroomList.length; i++) {
      const teacher = await this.prisma.teacher.findUnique({
        where: { id: classroomList[i].teacherId },
      });
      classroomList[i]['teacher'] = teacher;
    }
    return classroomList;
  }
}
