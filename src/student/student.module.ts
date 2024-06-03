import { Module } from '@nestjs/common';
import { StudentController } from './student.controller';
import { StudentService } from './student.service';
import { jwtConstants } from './constants';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [StudentController],
  providers: [StudentService],
  imports: [
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1d' },
    }),
  ],
})
export class StudentModule {}
