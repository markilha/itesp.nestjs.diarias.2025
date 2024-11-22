import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { SaquesMesService } from './saques-mes.service';
import { FindAllParams, returnTransferenciaDto, SaqueMesDto } from './saque-mesDto';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiExcludeEndpoint, ApiResponse, ApiTags } from '@nestjs/swagger';

@UseGuards(AuthGuard)
@ApiTags('saques-mes')
@Controller('saques-mes')
export class SaquesMesController {
  constructor(private readonly saquesmesService: SaquesMesService) {}

  @ApiExcludeEndpoint()
  @Get()
  async findAll(@Query() params: FindAllParams): Promise<SaqueMesDto[]> {
    return await this.saquesmesService.findOne(params.chapa, params.messaque);
  } 
  //get transferencias
  @Get('transferencia')
  @ApiResponse({ status: 200, description: 'Listagem de transferências', type: returnTransferenciaDto })
  async findTransferencias(@Query() params: FindAllParams): Promise<returnTransferenciaDto[]> {
    return await this.saquesmesService.findTransferenciaMes(params.chapa, params.messaque);
  }
}
