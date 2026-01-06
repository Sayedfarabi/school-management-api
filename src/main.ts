/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { Server } from 'http';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './common/filters/http_exception/http_exception.filter';
import { PrismaExceptionFilter } from './common/filters/prisma_exception/prisma_exception.filter';
import { TransformResponseInterceptor } from './common/interceptors/transform_response.interceptor';
import { AllExceptionsFilter } from './common/filters/all_exception/all_exception.filter';
import { ValidationPipe } from '@nestjs/common';

let server: Server;

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    app.use(helmet());
    app.use(cookieParser());
    app.enableCors({
      origin: ['*'],
      credentials: true,
    });

    // for global error handling
    app.useGlobalFilters(
      new HttpExceptionFilter(),
      new PrismaExceptionFilter(),
      new AllExceptionsFilter(),
    );

    // for response http error handling
    app.useGlobalInterceptors(
      new TransformResponseInterceptor(new Reflector()),
    );

    // for validation
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );

    // for swagger set meta info
    const options = new DocumentBuilder()
      .setTitle('School Management API')
      .setDescription('This is API documentation')
      .setVersion('1.0')
      .build();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('/docs', app, document);

    // server running on
    server = await app.listen(5000, () => {
      console.log(`Example app listening on port: ${5000}`);
    });
  } catch (error) {
    console.log(error);
  }
}
bootstrap();

// for server unhandledRejection
process.on('unhandledRejection', () => {
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

// for server uncaughtException
process.on('uncaughtException', () => {
  console.log('UncaughtException is detected, shutting down...');
  process.exit(1);
});
