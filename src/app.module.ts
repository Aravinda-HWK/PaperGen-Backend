import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { StudentModule } from './student/student.module';
import { PassportModule } from '@nestjs/passport';
import { ClassroomModule } from './classroom/classroom.module';
import { PaperModule } from './paper/paper.module';
import { QuestionModule } from './question/question.module';
import { ResultModule } from './result/result.module';
import { RequestModule } from './request/request.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    PrismaModule,
    StudentModule,
    ClassroomModule,
    PaperModule,
    QuestionModule,
    ResultModule,
    RequestModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
})
export class AppModule {}
