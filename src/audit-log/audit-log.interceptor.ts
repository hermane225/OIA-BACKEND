import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { AuditAction } from '@prisma/client';
import { Observable, tap } from 'rxjs';
import { AuditLogService } from './audit-log.service';
import { AuthenticatedRequest } from '../auth/interfaces/authenticated-user.interface';

const METHOD_ACTION: Record<string, AuditAction> = {
  POST: AuditAction.create,
  PUT: AuditAction.update,
  PATCH: AuditAction.update,
  DELETE: AuditAction.delete,
};

@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
  constructor(private readonly auditLogService: AuditLogService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const action = METHOD_ACTION[request.method];

    if (!action || !request.path.startsWith('/admin/')) {
      return next.handle();
    }

    const segments = request.path.split('/').filter(Boolean);
    const entity = segments[1] ?? 'unknown';
    const entityId = segments[2];

    return next.handle().pipe(
      tap({
        next: () => {
          const response = context.switchToHttp().getResponse<{
            statusCode: number;
          }>();

          void this.auditLogService.log({
            userId: request.user?.id ?? null,
            action,
            entity,
            entityId: entityId ?? null,
            method: request.method,
            path: request.path,
            statusCode: response.statusCode,
            ipAddress: request.ip ?? null,
          });
        },
      }),
    );
  }
}
