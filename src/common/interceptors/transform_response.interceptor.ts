/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { map, Observable } from 'rxjs';

@Injectable()
export class TransformResponseInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data: unknown) => {
        const responseMessage = this.reflector.get<string>(
          'responseMessage',
          context.getHandler(),
        );
        const httpContext = context.switchToHttp();
        const response = httpContext.getResponse();
        return {
          success: response?.statusCode >= 200 && response?.statusCode < 300,
          message: responseMessage || 'Operation completed successfully.',
          data,
        };
      }),
    );
  }
}
