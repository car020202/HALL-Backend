import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS
  app.enableCors({
    origin: 'http://localhost:5173', // Permitir solicitudes desde el frontend
    credentials: true, // Permitir el envío de cookies o encabezados de autenticación
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
