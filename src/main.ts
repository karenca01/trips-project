import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
<<<<<<< HEAD
=======

  app.use(cookieParser());

  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  })


>>>>>>> 5cb3c7c984c0d9132513e345b2ad8abe9467eb72
  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
