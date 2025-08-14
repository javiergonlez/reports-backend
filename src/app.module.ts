//------------------------------------------------------------------------------------------------------------------------------------

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { S3Module } from './s3/s3.module';

//------------------------------------------------------------------------------------------------------------------------------------

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const host: string = configService.getOrThrow<string>('DB_HOST');
        const port: number = configService.getOrThrow<number>('DB_PORT');
        const username: string =
          configService.getOrThrow<string>('DB_USERNAME');
        const password: string =
          configService.getOrThrow<string>('DB_PASSWORD');
        const database: string = configService.getOrThrow<string>('DB_NAME');

        return {
          type: 'postgres' as const,
          host,
          port,
          username,
          password,
          database,
          autoLoadEntities: true,
          synchronize: true,
          ssl: {
            rejectUnauthorized: false,
          },
        };
      },
    }),
    AuthModule,
    S3Module,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
