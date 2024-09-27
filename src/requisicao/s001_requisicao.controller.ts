import {
  Body,
  Controller,
  Delete,
  Get, 
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { S001RequisicaoService } from './s001_requisicao.service';
import { RequisicaoDto, FindAllParams } from './requisicao.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { RequisicaoEntity } from 'src/database/db_mysql/entities/requisicao.entity';
import { ReturnRequisicaoDto } from './returnRequisicao.dto';

@UseGuards(AuthGuard)
@Controller('requisicao')
export class S001RequisicaoController {
  constructor(private readonly requisicao: S001RequisicaoService) {}

  @Get()
  async findAll(@Query() params: FindAllParams): Promise<ReturnRequisicaoDto[]> {
    return await this.requisicao.findAll(params);
  }

  @Post()
  async createRequisicao(
    @Body() requisicaoDto: RequisicaoDto,
  ): Promise<RequisicaoEntity> {
    return await this.requisicao.createRequisicao(requisicaoDto);
  }

  @Delete(':reqIdCodigo')
  async deleteRequisicao(@Param('reqIdCodigo') reqIdCodigo: number): Promise<{ message: string }> {
    return await this.requisicao.removeRequisicao(reqIdCodigo);
  }
}
