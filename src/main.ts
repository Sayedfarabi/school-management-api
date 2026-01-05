/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Server } from 'http';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

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
