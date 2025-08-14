//--------------------------------------------------------------------------------------------------------------------

import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { Request } from 'express';
import { Token } from '../entities/token.entity';

//--------------------------------------------------------------------------------------------------------------------

interface RequestWithUser extends Request {
  user?: {
    email: string;
    role: string;
  };
}

@Injectable()
class AuthGuard implements CanActivate {
  constructor(
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: RequestWithUser = context.switchToHttp().getRequest();
    const token: string | undefined = this.extractTokenFromRequest(request);

    if (!token) {
      throw new UnauthorizedException('Token no proporcionado');
    }

    const tokenEntity: Token | null = await this.tokenRepository.findOne({
      where: { id: token },
      relations: ['user'],
    });

    if (!tokenEntity || !tokenEntity.user) {
      throw new UnauthorizedException('Token inv\u{00E1}lido');
    }

    if (Date.now() > tokenEntity.expiresAt) {
      // Eliminar token expirado
      await this.tokenRepository.remove(tokenEntity);
      throw new UnauthorizedException('Token expirado');
    }

    // Agregar usuario al request
    request.user = {
      email: tokenEntity.user.email,
      role: tokenEntity.user.role,
      // agregar fecha de expiracion para en el frontend pedir relogin. Hablar el lunes lo de pisar el relogin
    };

    return true;
  }

  private extractTokenFromRequest(request: Request): string | undefined {
    // Obtener del header Authorization
    const authHeader: string | undefined = request.headers.authorization;
    if (authHeader) {
      const [type, token] = authHeader.split(' ');
      if (type === 'Bearer' && token) {
        return token;
      }
    }

    return undefined;
  }
}

export { AuthGuard };
