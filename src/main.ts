import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  // Do not call `app.init()` here — configure Swagger before the server starts

  const config = new DocumentBuilder()
    .setTitle('Hunters API')
    .setDescription(
      'API for managing the football team, players, donations, and documents',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
  console.log(
    `✅ Server running at http://localhost:${process.env.PORT ?? 3000}`,
  );
  console.log(
    `📚 Swagger docs available at http://localhost:${process.env.PORT ?? 3000}/docs`,
  );
}
bootstrap().catch((err) => {
  console.error('❌ Bootstrap failed:', err);
  process.exit(1);
});
