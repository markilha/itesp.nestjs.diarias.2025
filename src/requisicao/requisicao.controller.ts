import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { FindAllParams } from './requisicao.dto';
import { RequisicaoService } from './requisicao.service';
import { Requisicao_Entity } from 'src/database/db_mysql/entities/requisicao_.entity';



@UseGuards(AuthGuard)
@Controller('req')
export class RequisicaoController {

    constructor(private readonly requisicao: RequisicaoService) {}

    @Get()
    async findAll(@Query() params: FindAllParams): Promise<any[]> {
      return await this.requisicao.findAll(params);
    }
   

}
