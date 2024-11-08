import {
  Controller,
  Get, 
  Param, 
  Query,
  UseGuards,
} from '@nestjs/common';
import { S001RequisicaoService } from './s001_requisicao.service';
import {  FindAllAutorizadasParams, FindAllParams, findMesParams, RequisDto, ReturnRequisicaoDto } from './requisicao.dto';
import { AuthGuard } from 'src/auth/auth.guard';

import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { requisicaoAutorizadaSwagger, requisicaoSwagger } from 'src/swagger/requisicaoswagger';

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
  async find(@Query() params: FindAllParams): Promise<ReturnRequisicaoDto[]> {
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
  async findAllAprovadas(@Query()params:FindAllAutorizadasParams): Promise<RequisDto[]> {
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
  
  async findMes(@Query() params:findMesParams): Promise<RequisDto[]> {
    return await this.requisicao.findMesAtual(params);
  }
 
}
