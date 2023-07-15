import { HttpException, HttpStatus } from '@nestjs/common';
import { AppExceptionResponse } from './exceptions.types';

export class AppException extends HttpException {
  constructor(response: AppExceptionResponse, status: HttpStatus) {
    super(response, status);
  }
}
