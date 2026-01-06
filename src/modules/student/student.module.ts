import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { StudentController } from './student.controller';
import { StudentService } from './student.service';
import { JwtModule } from '@nestjs/jwt';
import { StringValue } from 'ms';

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: process?.env?.JWT_ACCESS_TOKEN_SECRET as string,
      signOptions: {
        expiresIn:
          (process?.env?.JWT_ACCESS_TOKEN_EXPIRES_IN as StringValue) || '10m',
      },
    }),
  ],
  controllers: [StudentController],
  providers: [StudentService],
})
export class StudentModule {}
