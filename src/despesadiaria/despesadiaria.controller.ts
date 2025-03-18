import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { DespesadiariaService } from './despesadiaria.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { FindAllParams } from './despesadiariaDto';
import { DespesaDiariaEntity } from 'src/database/db_oracle/entities/despesaDiaria.entity';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

@Controller('despesadiaria')
export class DespesadiariaController {
  constructor(private readonly despesadiariaService: DespesadiariaService) {}

  @UseGuards(AuthGuard)
  @Get()
  @ApiExcludeEndpoint()
  async findAll(@Query() params: FindAllParams): Promise<DespesaDiariaEntity[]> {
    return await this.despesadiariaService.findAll(params);
  }

  @UseGuards(AuthGuard)
  @Get('findOne')
  @ApiExcludeEndpoint()
  async findOne(@Query('cargo') cargo: string): Promise<any> {
    return await this.despesadiariaService.findOne(cargo);
  }
}
