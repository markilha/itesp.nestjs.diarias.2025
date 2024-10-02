import { Controller, Get, Query } from '@nestjs/common';
import { SaquesMesService } from './saques-mes.service';
import { FindAllParams, SaqueMesDto } from './saque-mesDto';

@Controller('saques-mes')
export class SaquesMesController {
    constructor(private readonly pcargoService: SaquesMesService) {}

    @Get()
    async findAll(@Query() params: FindAllParams): Promise<SaqueMesDto[]> {
      return await this.pcargoService.findAll(params);
    }
  
}

