import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import type { Request } from 'express';

export class AdminGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    if (!request.currentUser?.admin) {
      return false;
    }

    return !request.currentUser.admin.archivedAt;
  }
}
