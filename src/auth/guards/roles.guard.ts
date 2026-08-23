import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../auth.constants';
import { AuthenticatedRequest } from '../interfaces/authenticated-user.interface';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const roleName = request.user?.role?.name;

    if (!roleName) {
      throw new ForbiddenException('User role is required');
    }

    if (roleName === 'super_admin') {
      return true;
    }

    if (!requiredRoles.includes(roleName)) {
      throw new ForbiddenException('Access denied for this role');
    }

    return true;
  }
}
