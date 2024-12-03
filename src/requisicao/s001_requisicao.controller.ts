import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { S001RequisicaoService } from './s001_requisicao.service';
import {
  FindAllAutorizadasParams,
  FindAllParams,
  findMesParams,
  RequisDto,
  requiTotal,
  ReturnRequisicaoDto,
} from './requisicao.dto';
import { AuthGuard } from 'src/auth/auth.guard';

import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { requisicaoAutorizadaSwagger, requisicaoSwagger } from 'src/swagger/requisicaoswagger';
import { CurrentUser } from '../auth/current-user.decorator';
import { UsersDto } from 'src/users/users.dto';

@UseGuards(AuthGuard)
@ApiTags('usureq')
@Controller('usureq')
export class S001RequisicaoController {
  constructor(private readonly requisicao: S001RequisicaoService) {}

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
  async find(@CurrentUser() user: UsersDto,@Query() params: FindAllParams): Promise<ReturnRequisicaoDto[]> {

    if(!params.chapa){
     params.chapa = user.chapa;
    }

    return await this.requisicao.find(params);
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
  async findAllAprovadas(@CurrentUser() user: UsersDto,@Query() params: FindAllAutorizadasParams): Promise<RequisDto[]> {
    if(!params.all){
      if(!params.chapa){
        params.chapa = user.chapa;
       }
    }
    return await this.requisicao.findAllAprovadas(params);
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
  async findMes(@CurrentUser() user: UsersDto,@Query() params: findMesParams): Promise<RequisDto[]> {
    if(!params.chapa){
      params.chapa = user.chapa;
     }
    return await this.requisicao.findMesAtual(params);
  }

  @Get('pendentes')
  @ApiOperation({ summary: 'Lista todas requisições que estão no status pendente' })
  @ApiResponse({
    status: 200,
    description: 'Requições encontradas',
    type: requiTotal
   
  })
  @ApiResponse({
    status: 401,
    description: 'token inválido',
  })
  @ApiResponse({
    status: 500,
    description: 'Erro ao buscar requisições',
  })
  async findPendentes(@CurrentUser() user: UsersDto,@Query('chapa') chapa: string): Promise<requiTotal> {    
    if(!chapa){
      chapa = user.chapa;
     } 
    return await this.requisicao.findPendentes(chapa);
  }
}
