//--------------------------------------------------------------------------------------------------------------------

import type { CanActivate, ExecutionContext } from '@nestjs/common';

import { Injectable, ForbiddenException } from '@nestjs/common';

import { Reflector } from '@nestjs/core';
import type { Role } from '../enums/role.enum';
import type { Request } from 'express';

import { ROLES_KEY } from './roles.decorator';

//--------------------------------------------------------------------------------------------------------------------

interface RequestWithUser extends Request {
  user?: {
    email: string;
    role: string;
  };
}

@Injectable()
class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles: Role[] = this.reflector.getAllAndOverride<Role[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const request: RequestWithUser = context.switchToHttp().getRequest();
    const user:
      | {
          email: string;
          role: string;
        }
      | undefined = request.user;

    if (!user || !user.role) {
      throw new ForbiddenException('Usuario no autenticado');
    }

    if (!requiredRoles.includes(user.role as Role)) {
      throw new ForbiddenException('Role inv\u{00E1}lido');
    }

    return true;
  }
}

export { RolesGuard };
