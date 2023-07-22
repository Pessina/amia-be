import { HttpException, HttpStatus } from '@nestjs/common';

type Code = string;
type Meta = { target: string[] };

type AppExceptionData = {
  code: Code;
  meta: Meta;
  status: HttpStatus;
};

export class AppException extends HttpException {
  code: Code;
  meta: Meta;

  constructor(data: AppExceptionData, error: Error) {
    super(error.message, data.status);
    this.code = data.code;
    this.meta = data.meta;
    this.name = 'AppException';

    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}
