export interface AppExceptionResponse {
  message: string;
  code: string;
  meta: {
    target?: string[];
  };
}

export interface ErrorResponse extends AppExceptionResponse {
  statusCode: number;
  timestamp: string;
  path: string;
}
