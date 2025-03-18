import { Controller, Get, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { psubstchefeService } from './psubstchefe.service';
import { FindAllParams } from './psubstchefeDto';

import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { psubstchefeEntity } from 'src/database/db_oracle/entities/psubstchefe.entity';

@UseGuards(AuthGuard)
@ApiTags('psubstchefe')
@Controller('psubstchefe')
export class psubstchefeController {
  constructor(private readonly psubstchefeService: psubstchefeService) {}

  @Get()
  @ApiOperation({ summary: 'Busca todos os psubstchefes' })
  @ApiResponse({
    status: 200,
    description: 'Retorna todos os psubstchefes',
    type: psubstchefeEntity,
    isArray: true,
  })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor' })
  async findAtual(@Query() params: FindAllParams): Promise<psubstchefeEntity> {
    const codigo = params.CODSECAO;
    return await this.psubstchefeService.findAtual(codigo);
  }
}
