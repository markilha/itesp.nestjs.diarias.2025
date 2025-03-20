import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { autorizaService } from './autoriza.service'; // Importa o serviço

import { AuthGuard } from '../auth/auth.guard';
import { FindAllParams } from './autorizaDto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('autoriza')
@Controller('autoriza')
@UseGuards(AuthGuard)
export class autorizaController {
  constructor(private readonly autorizaService: autorizaService) {}

  @Get()
  async findAll(@Query() params: FindAllParams): Promise<{ data: any[]; total: number }> {
    return await this.autorizaService.findAll(params);
  }

  @Get('findrecursos')
  async findre(@Query() params: FindAllParams): Promise<{ data: any[]; total: number }> {
    return await this.autorizaService.findRecursos(params);
  }
}
