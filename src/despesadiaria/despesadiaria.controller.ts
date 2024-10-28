import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { DespesadiariaService } from './despesadiaria.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { FindAllParams } from './despesadiariaDto';
import { DespesaDiariaEntity } from '../database/db_mysql/entities/despesaDiaria.entity';

@Controller('despesadiaria')
export class DespesadiariaController {
    constructor(
        private readonly despesadiariaService: DespesadiariaService,
    ) {}


    @UseGuards(AuthGuard)
    @Get()
    async findAll(@Query() params: FindAllParams): Promise<DespesaDiariaEntity[]> {
      return await this.despesadiariaService.findAll(params);
    }

    @UseGuards(AuthGuard)
    @Get('findOne')
    async findOne(@Query('cargo') cargo: string): Promise<DespesaDiariaEntity> {
      return await this.despesadiariaService.findOne(cargo);
    }


}
