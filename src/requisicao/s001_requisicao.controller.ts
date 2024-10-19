import {
  Controller,
  Get, 
  Query,
  UseGuards,
} from '@nestjs/common';
import { S001RequisicaoService } from './s001_requisicao.service';
import {  FindAllParams } from './requisicao.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { ReturnRequisicaoDto } from './returnRequisicao.dto';

@UseGuards(AuthGuard)
@Controller('usureq')
export class S001RequisicaoController {
  constructor(private readonly requisicao: S001RequisicaoService) {}

  @Get()
  async find(@Query() params: FindAllParams): Promise<ReturnRequisicaoDto[]> {
    return await this.requisicao.find(params);
  }
 
}
