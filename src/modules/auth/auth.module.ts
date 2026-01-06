/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
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
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
