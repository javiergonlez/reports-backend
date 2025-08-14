//--------------------------------------------------------------------------------------------------------------------

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from './entities/user.entity';
import { Token } from './entities/token.entity';
import { AuthGuard } from './decorators/auth.guard';

//--------------------------------------------------------------------------------------------------------------------

@Module({
  imports: [TypeOrmModule.forFeature([User, Token]), ConfigModule],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard],
  exports: [TypeOrmModule, AuthGuard],
})
export class AuthModule {}
