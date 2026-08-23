import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../auth.constants';
import { AuthenticatedRequest } from '../interfaces/authenticated-user.interface';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Authenticated user context is required');
    }

    if (user.role?.name === 'super_admin') {
      return true;
    }

    const permissionSet = new Set(user.permissions);
    const missingPermissions = requiredPermissions.filter(
      (permission) => !permissionSet.has(permission),
    );

    if (missingPermissions.length > 0) {
      throw new ForbiddenException(
        `Missing permissions: ${missingPermissions.join(', ')}`,
      );
    }

    return true;
  }
}
