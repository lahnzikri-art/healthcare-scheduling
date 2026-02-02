import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );
  const port = process.env.PORT || 3002;
  await app.listen(port);
  console.log(`Patient service is running on: http://localhost:${port}/graphql`);
}
bootstrap();
