import { Module, Provider } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { globalErrorFilter } from './error.filter';

const GlobalErrorFilterProvider: Provider = {
  provide: APP_FILTER,
  useValue: {
    catch: globalErrorFilter
  }
};

@Module({
  providers: [GlobalErrorFilterProvider],
  exports: [],
})
export class ErrorHandlerModule {}