import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { StudentModule } from './student/student.module';
import { PassportModule } from '@nestjs/passport';
import { ClassroomModule } from './classroom/classroom.module';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    StudentModule,
    ClassroomModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
})
export class AppModule {}
