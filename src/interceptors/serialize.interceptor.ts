import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { map, Observable } from 'rxjs';

export class SerializeInterceptor<T> implements NestInterceptor {
  constructor(private readonly dto: ClassConstructor<T>) {}

  intercept(
    _context: ExecutionContext,
    next: CallHandler<unknown>,
  ): Observable<T | T[]> | Promise<Observable<T | T[]>> {
    return next.handle().pipe(
      map((data: unknown) => {
        return plainToInstance(this.dto, data, {
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}

export function Serialize<T>(dto: ClassConstructor<T>) {
  return UseInterceptors(new SerializeInterceptor(dto));
}
