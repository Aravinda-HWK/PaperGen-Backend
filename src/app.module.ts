import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { StudentModule } from './student/student.module';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    StudentModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
})
export class AppModule {}
