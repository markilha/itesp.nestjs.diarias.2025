import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { SaquesMesService } from './saques-mes.service';
import {
  ExtratoDto,
  FindAllParams,
  FindParamsExtrato,
  returnTransferenciaDto,
  SaqueMesDto,
} from './saque-mesDto';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiExcludeEndpoint, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { AuthUserDto } from 'src/auth/use.auth.Dto';

@UseGuards(AuthGuard)
@ApiTags('saques-mes')
@Controller('saques-mes')
export class SaquesMesController {
  constructor(private readonly saquesmesService: SaquesMesService) {}

  @ApiExcludeEndpoint()
  @Get()
  async findAll(
    @CurrentUser() user: AuthUserDto,
    @Query() params: FindAllParams,
  ): Promise<SaqueMesDto[]> {
    if (!params.chapa) {
      params.chapa = user.chapa;
    }

    return await this.saquesmesService.findOne(params.chapa, params.messaque);
  }
  //get transferencias
  @Get('transferencia')
  @ApiResponse({
    status: 200,
    description: 'Listagem de transferências',
    type: returnTransferenciaDto,
  })
  async findTransferencias(
    @CurrentUser() user: AuthUserDto,
    @Query() params: { messaque: string; chapa: string },
  ): Promise<returnTransferenciaDto[]> {
    
    if (!params.chapa) {
      params.chapa = user.chapa;
    }   

    return await this.saquesmesService.findTransferenciaMes(user.chapa, params.messaque);
  }

  @Get('perfil/extrato')
  @ApiResponse({ status: 200, description: 'Listagem de extrato', type: ExtratoDto, isArray: true })
  async findExtrato(
    @CurrentUser() user: AuthUserDto,
    @Query('chapa') chapa: string,
  ): Promise<ExtratoDto[]> {
    if (!chapa) {
      chapa = user.chapa;
    }

    return await this.saquesmesService.findExtrato(chapa);
  }
}
