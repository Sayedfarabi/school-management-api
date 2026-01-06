import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ClassController } from './class.controller';
import { ClassService } from './class.service';
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
  controllers: [ClassController],
  providers: [ClassService],
})
export class ClassModule {}
