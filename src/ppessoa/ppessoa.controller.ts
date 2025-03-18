import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { PpessoaService } from './ppessoa.service';
import { FindAllParams } from './ppessoa.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { FuncionarioDto } from './returnRmDto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { AuthUserDto } from 'src/auth/use.auth.Dto';

@ApiTags('ppessoa')
@UseGuards(AuthGuard)
@Controller('ppessoa')
export class PpessoaController {
  constructor(private readonly rmService: PpessoaService) {}
  @Get()
  @ApiOperation({ summary: 'Busca info de funcionário' })
  @ApiResponse({ status: 200, description: 'Retorna info de funcionário', type: FuncionarioDto })
  @ApiResponse({ status: 404, description: 'Funcionário não encontrado!!!' })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor' })
  async findAll(
    @CurrentUser() user: AuthUserDto,
    @Query() params: FindAllParams,
  ): Promise<FuncionarioDto> {
    if (!params.chapa) {
      params.chapa = user.chapa;
    }
    return await this.rmService.find(params);
  }

  @Get('funcs')
  async findPrestacao(@Query() params: FindAllParams): Promise<any> {
    return await this.rmService.findFuncs(params);
  }
}
