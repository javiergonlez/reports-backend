//------------------------------------------------------------------------------------------------------------------------------------

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { S3Controller } from './s3.controller';
import { AuthModule } from '../auth/auth.module';
import { S3Service } from './s3.service';

//------------------------------------------------------------------------------------------------------------------------------------

@Module({
  imports: [AuthModule, ConfigModule],
  controllers: [S3Controller],
  providers: [S3Service],
  exports: [S3Service],
})
export class S3Module {}
