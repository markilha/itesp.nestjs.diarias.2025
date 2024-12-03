import { Body, Controller, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { ndocumentoService } from './ndocumento.service';

import { AuthGuard } from 'src/auth/auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { AllExceptionsFilter } from 'src/interceptors/all-exceptions.filter';
import { ndocumentoEntity } from 'src/database/db_oracle/entities/ndocumento.entity';

@ApiTags('ndocumento')
@UseGuards(AuthGuard)
@Controller('ndocumento')
@UseInterceptors(AllExceptionsFilter)
export class ndocumentoController {
  constructor(private readonly ndocumentoService: ndocumentoService) {}

  @Post()
  async create(@Body() ndocumentoDto: ndocumentoEntity): Promise<ndocumentoEntity> {
    return await this.ndocumentoService.create(ndocumentoDto);
  }
}
