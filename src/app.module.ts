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
import app_config from './config/app.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      load: [app_config],
    }),
    PrismaModule,
    StudentModule,
    ClassModule,
  ],
  controllers: [AppController, StudentController, ClassController],
  providers: [AppService, StudentService, ClassService],
})
export class AppModule {}
