//------------------------------------------------------------------------------------------------------------------------------------

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

//------------------------------------------------------------------------------------------------------------------------------------

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  const configService: ConfigService = app.get(ConfigService);
  const frontendUrl: string | undefined =
    configService.get<string>('FRONTEND_URL');

  // CORS
  const corsOptions = {
    origin: frontendUrl ? [frontendUrl] : [],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'role'],
  };

  app.enableCors(corsOptions);

  await app.listen(3000);
}

void bootstrap();
