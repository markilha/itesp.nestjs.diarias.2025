import { Body, Controller, Get, Post, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { itensreqrecService } from './itensreqrec.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AllExceptionsFilter } from 'src/interceptors/all-exceptions.filter';
import { itensreqrecEntity } from 'src/database/db_oracle/entities/itensreqrec.entity';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { AuthUserDto } from 'src/auth/use.auth.Dto';
import { paramsItemRecurso } from './itensreq.Dto';


@ApiTags('itensreqrec')
@UseGuards(AuthGuard)
@Controller('itensreqrec')
@UseInterceptors(AllExceptionsFilter)
export class itensreqrecController {
  constructor(private readonly itensreqrecService: itensreqrecService) {}

  @Post()
  async create(@Body() data: Partial<itensreqrecEntity>): Promise<itensreqrecEntity> {
    const itensreqrec = await this.itensreqrecService.create(data);
    return itensreqrec;
  }

  @Get('findone')
  async findOne(@Query('ITE_ID_CODIGO') ITE_ID_CODIGO: number): Promise<itensreqrecEntity> {
    const itensreqrec = await this.itensreqrecService.findOne(ITE_ID_CODIGO);
    return itensreqrec;
  }

  @Get('selecionaItensRecurso')
  @ApiOperation({ summary: 'Buscar iten(s) recurso do funcionario' })
  @ApiResponse({ status: 200, description: 'Retorna os itens recurso do funcionario' })
  @ApiResponse({ status: 404, description: 'Item não encontrado' })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor' })
  async selecionaSaquePendente(@CurrentUser() user: AuthUserDto, @Query() params: paramsItemRecurso): Promise<any> {
    if (!params.CHAPA){
      params.CHAPA = user.chapa;
    }
    return await this.itensreqrecService.selecionaItensRecurso(params, user);
  }
}
