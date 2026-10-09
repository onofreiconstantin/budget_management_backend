import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import type { Request } from 'express';

export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    return Boolean(request.currentUser);
  }
}
