import { Controller, Get, Query, UseGuards } from '@nestjs/common';

import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { FindAllParams } from './dtos/psecao.dto';

import { AuthGuard } from '../auth/auth.guard';
import { PsecaoService } from './Psecao.service';

@UseGuards(AuthGuard)
@ApiTags('Secao Regionais')
@Controller('psecao')
export class PsecaoController {
  constructor(private readonly service: PsecaoService) {}

  @ApiOperation({ summary: 'Listar todas seções' })
  @Get()
  async findAll(@Query() params: FindAllParams): Promise<any> {
    return this.service.findAll(params);
  }
}
