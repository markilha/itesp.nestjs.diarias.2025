import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { S001RequisicaoService } from './s001_requisicao.service';
import {
  FindAllAutorizadasParams,
  FindAllParams,
  findMesParams,
  findPendentesParams,
  ListSaqueParams,
  RequisDto,
  requiTotal,
  ReturnRequisicaoDto,
} from './requisicao.dto';
import { AuthGuard } from 'src/auth/auth.guard';

import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { requisicaoAutorizadaSwagger, requisicaoSwagger } from 'src/swagger/requisicaoswagger';
import { CurrentUser } from '../auth/current-user.decorator';
import { AuthUserDto } from 'src/auth/use.auth.Dto';

// @UseGuards(AuthGuard)
@ApiTags('usureq')
@Controller('usureq')
export class S001RequisicaoController {
  constructor(private readonly requisicao: S001RequisicaoService) { }
  @Get()
  @ApiOperation({ summary: 'Lista todas requisições de viagem pela chapa do funcionário' })
  @ApiResponse({
    status: 200,
    description: 'Requições encontradas',
    type: requisicaoSwagger,
    isArray: true,
  })
  @ApiResponse({
    status: 401,
    description: 'token inválido',
  })
  @ApiResponse({
    status: 500,
    description: 'Erro ao buscar requisições',
  })
  async find(
    @CurrentUser() user: AuthUserDto,
    @Query() params: FindAllParams,
  ): Promise<ReturnRequisicaoDto[]> {
    return await this.requisicao.find(params, user);
  }

  @Get('aprovadas')
  @ApiOperation({ summary: 'Lista todas requisições que estão no status aprovada' })
  @ApiResponse({
    status: 200,
    description: 'Requições encontradas',
    type: requisicaoAutorizadaSwagger,
    isArray: true,
  })
  @ApiResponse({
    status: 401,
    description: 'token inválido',
  })
  @ApiResponse({
    status: 500,
    description: 'Erro ao buscar requisições',
  })
  async findAllAprovadas(
    @CurrentUser() user: AuthUserDto,
    @Query() params: FindAllAutorizadasParams,
  ): Promise<RequisDto[]> {
    return await this.requisicao.findAllAprovadas(params, user);
  }

  @Get('mesatual')
  @ApiOperation({ summary: 'Lista todas requisições que estão no status aprovada no mês atual' })
  @ApiResponse({
    status: 200,
    description: 'Requições encontradas',
    type: requisicaoAutorizadaSwagger,
    isArray: true,
  })
  @ApiResponse({
    status: 401,
    description: 'token inválido',
  })
  @ApiResponse({
    status: 500,
    description: 'Erro ao buscar requisições',
  })
  async findMes(
    @CurrentUser() user: AuthUserDto,
    @Query() params: findMesParams,
  ): Promise<RequisDto[]> {
    return await this.requisicao.findMesAtual(params, user);
  }

  @Get('pendentes')
  @ApiOperation({ summary: 'Lista todas requisições que estão no status pendente' })
  @ApiResponse({
    status: 200,
    description: 'Requições encontradas',
    type: requiTotal,
  })
  @ApiResponse({
    status: 401,
    description: 'token inválido',
  })
  @ApiResponse({
    status: 500,
    description: 'Erro ao buscar requisições',
  })
  async findPendentes(
    @Query() params: findPendentesParams,
    @CurrentUser() user: AuthUserDto,
  ): Promise<requiTotal> {
    return await this.requisicao.findPendentes(user, params);
  }

  @Get('listaSaque')
  @ApiOperation({ summary: 'Lista todas requisições de saque' })
  @ApiResponse({
    status: 200,
    description: 'Requições encontradas',
  })
  @ApiResponse({
    status: 401,
    description: 'token inválido',
  })
  @ApiResponse({
    status: 500,
    description: 'Erro ao buscar requisições',
  })
  async findListaSaque(
    @Query() params: ListSaqueParams,
    @CurrentUser() user: AuthUserDto,
  ): Promise<any> {
    return await this.requisicao.findListaSaque(user, params);
  }
}
