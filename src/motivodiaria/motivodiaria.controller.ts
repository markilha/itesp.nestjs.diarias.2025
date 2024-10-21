import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { MotivodiariaService } from './motivodiaria.service';
import {  FindAllParams, motivoDiariaDto } from './motivodiariaDto';


@UseGuards(AuthGuard)
@Controller('motivodiaria')
export class MotivodiariaController {
  constructor(private readonly requisicao: MotivodiariaService) {}

  @Get()
  async findAll(@Query() params: FindAllParams): Promise<motivoDiariaDto[]> {
    return await this.requisicao.findAll(params);
  }

  @Get('findone')
  async findOne(@Query() params: FindAllParams): Promise<motivoDiariaDto> {
    return await this.requisicao.findOne(params.CHAPA,params.REQ_ID_CODIGO);
  }
}
