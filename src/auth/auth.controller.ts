//--------------------------------------------------------------------------------------------------------------------

import {
  Controller,
  Post,
  Body,
  Headers,
  UnauthorizedException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { Auth } from './decorators/auth.decorator';

import type { SafeUser } from './entities/user.entity';

//--------------------------------------------------------------------------------------------------------------------

@Controller('auth')
class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
  ): Promise<{ user: SafeUser; token: string; expiresAt: number }> {
    try {
      const { user, token, expiresAt } = await this.authService.login(loginDto);

      return { user, token, expiresAt };
    } catch (error) {
      console.error('Error en login controller:', error);

      if (error instanceof UnauthorizedException) {
        throw error;
      }

      throw new HttpException(
        'Error interno del servidor',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('logout')
  @Auth()
  async logout(
    @Headers('authorization') authHeader: string,
  ): Promise<{ message: string }> {
    try {
      const token: string | undefined = authHeader?.split(' ')[1];
      if (!token) {
        throw new UnauthorizedException('Token no proporcionado');
      }

      await this.authService.logout(token);

      return { message: 'Logout successful' };
    } catch (error) {
      console.error('Error en logout controller:', error);

      if (error instanceof UnauthorizedException) {
        throw error;
      }

      throw new HttpException(
        'Error interno del servidor',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

export { AuthController };
