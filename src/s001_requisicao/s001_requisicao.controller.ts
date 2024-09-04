import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { S001RequisicaoService } from './s001_requisicao.service';
import { RequisicaoDto,FindAllParams } from './requisicao.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('requisicao')
export class S001RequisicaoController {
    constructor(private readonly requisicao: S001RequisicaoService) {}

    @Get()
    async findAll(@Query() params: FindAllParams): Promise<RequisicaoDto[]> {
      return await this.requisicao.findAll(params);
    }



}
