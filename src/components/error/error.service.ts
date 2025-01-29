import { HttpException, HttpStatus } from '@nestjs/common';
import { Request } from 'express';
import { QueryFailedError } from 'typeorm';
import { ErrorResponse } from './error.types';
import { ErrorMessages } from './error.constants';

export const formatError = (
    error: Error | HttpException | QueryFailedError,
    request?: Request
  ): ErrorResponse => {
    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: (typeof ErrorMessages)[keyof typeof ErrorMessages] = ErrorMessages.INTERNAL_ERROR;
    let errorType = 'Internal Server Error';
    let details = null;
  
    if (error instanceof HttpException) {
      statusCode = error.getStatus();
      const response = error.getResponse() as any;
      message = response.message || error.message;
      errorType = response.error || 'Http Exception';
      details = response.details;
    } else if (error instanceof QueryFailedError) {
      statusCode = HttpStatus.BAD_REQUEST;
      message = ErrorMessages.DATABASE_ERROR;
      errorType = 'Database Error';
  
      if ((error as any).code === 'ORA-00001') {
        message = ErrorMessages.DUPLICATE_ENTRY;
      }
  
      if (process.env.NODE_ENV === 'development') {
        details = {
          code: (error as any).code,
          detail: (error as any).detail,
          query: (error as any).query
        };
      }
    }
  
    const errorResponse: ErrorResponse = {
      statusCode,
      message,
      error: errorType,
      timestamp: new Date().toISOString(),
      path: request?.url,
      details
    };
  
    console.error('[Error Handler]', {
      ...errorResponse,
      stack: error.stack
    });
  
    return errorResponse;
  };

  export const throwError = (
    message: string,
    statusCode: HttpStatus = HttpStatus.BAD_REQUEST,
    details?: any
  ): never => {
    throw new HttpException(
      {
        message,
        error: HttpStatus[statusCode],
        details
      },
      statusCode
    );
  };

  export const handleDatabaseError = (error: QueryFailedError): never => {
    const oracleErrorCode = (error as any).code;
    switch (oracleErrorCode) {
      case 'ORA-00001':
        throwError(ErrorMessages.DUPLICATE_ENTRY, HttpStatus.CONFLICT);
      case 'ORA-02292':
        throwError('Não é possível excluir devido a registros relacionados', HttpStatus.CONFLICT);
      default:
        throwError(ErrorMessages.DATABASE_ERROR, HttpStatus.BAD_REQUEST, {
          code: oracleErrorCode
        });
    }
    throw new Error('Erro de banco de dados não tratado'); 
  };
  