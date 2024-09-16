import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { PfuncaoService } from './pfuncao.service';
import { FindAllParams, PfuncaoDto } from './pfuncaoDto';
import { AuthGuard } from 'src/auth/auth.guard';
import { returnPfuncaDto } from './returnPfuncaoDto';


@UseGuards(AuthGuard) 
@Controller('pfuncao')
export class PfuncaoController {
    constructor(
        private readonly pfuncaoService: PfuncaoService,
    ) {}

    @Get()
    async findAll(@Query() params: FindAllParams): Promise<returnPfuncaDto[]> {
      return await this.pfuncaoService.findAll(params);
    }
    
    @Get(':codigo')
    async findByCodigo(@Param('codigo') codigo: string): Promise<returnPfuncaDto> {
      return await this.pfuncaoService.findByCodigo(codigo);
    }
}
