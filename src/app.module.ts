import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { StudentService } from './modules/student/student.service';
import { StudentController } from './modules/student/student.controller';
import { StudentModule } from './modules/student/student.module';
import { ConfigModule } from '@nestjs/config';
import { ClassService } from './modules/class/class.service';
import { ClassController } from './modules/class/class.controller';
import { ClassModule } from './modules/class/class.module';
import { AuthService } from './modules/auth/auth.service';
import { AuthController } from './modules/auth/auth.controller';
import { AuthModule } from './modules/auth/auth.module';
import app_config from './config/app.config';
import { JwtModule } from '@nestjs/jwt';
import { StringValue } from 'ms';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      load: [app_config],
    }),
    JwtModule.register({
      secret: process?.env?.JWT_ACCESS_TOKEN_SECRET as string,
      signOptions: {
        expiresIn:
          (process?.env?.JWT_ACCESS_TOKEN_EXPIRES_IN as StringValue) || '10m',
      },
    }),
    PrismaModule,
    StudentModule,
    ClassModule,
    AuthModule,
  ],
  controllers: [
    AppController,
    StudentController,
    ClassController,
    AuthController,
  ],
  providers: [AppService, StudentService, ClassService, AuthService],
})
export class AppModule {}
