import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { ErrorResponse } from './exceptions.types';
import { AppException } from './AppException';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof AppException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    let message = exception.message;
    let code = 'INTERNAL_ERROR';
    let meta = {};

    if (exception.response) {
      message = exception.response.message || exception.message;
      code = exception.response.code || 'INTERNAL_ERROR';
      meta = exception.response.meta || {};
    }

    const errorResponse: ErrorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: message,
      code: code,
      meta: meta,
    };

    response.status(status).json(errorResponse);
  }
}
