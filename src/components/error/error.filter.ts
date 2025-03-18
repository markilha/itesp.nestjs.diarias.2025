import { ArgumentsHost } from '@nestjs/common';
import { Request, Response } from 'express';
import { formatError } from './error.service';

export const globalErrorFilter = (error: Error, host: ArgumentsHost) => {
  const ctx = host.switchToHttp();
  const response = ctx.getResponse<Response>();
  const request = ctx.getRequest<Request>();

  const errorResponse = formatError(error, request);

  response.status(errorResponse.statusCode).json(errorResponse);
};
