import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { SaquesMesService } from './saques-mes.service';
import { FindAllParams, SaqueMesDto } from './saque-mesDto';
import { AuthGuard } from 'src/auth/auth.guard';
import { SaqueMesEntity } from 'src/database/db_oracle/entities/saqueMes.entity';

@Controller('saques-mes')
export class SaquesMesController {
  constructor(private readonly pcargoService: SaquesMesService) {}
  @UseGuards(AuthGuard)
  @Get()
  async findAll(@Query() params: FindAllParams): Promise<SaqueMesDto[]> {
    return await this.pcargoService.findOne(params.chapa, params.messaque);
  } 
}
