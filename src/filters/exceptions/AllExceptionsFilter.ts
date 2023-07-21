import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { ErrorResponse } from './exceptions.types';
import { AppException } from './AppException';
import * as Sentry from '@sentry/node';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    if (!(exception instanceof AppException)) {
      Sentry.captureException(exception);
    }

    const status =
      exception instanceof AppException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    let message = exception.message;
    let code = 'INTERNAL_ERROR';
    let meta = {};

    if (exception) {
      message = exception.message || exception.message;
      code = exception.code || 'INTERNAL_ERROR';
      meta = exception.meta || {};
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
