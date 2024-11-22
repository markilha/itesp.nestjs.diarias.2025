import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { FuncsalarioService } from './funcsalario.service'; // Importa o serviço
import { FindAllParams, FindParamsDadosPagamentoDto, FuncSalarioDto, returnFunPagDto } from './funcsalarioDto';
import { AuthGuard } from '../auth/auth.guard';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/roles.decorator';

@ApiTags('funcsalario')
@Controller('funcsalario')
@UseGuards(AuthGuard)
export class FuncsalarioController {
  constructor(private readonly funcSalarioService: FuncsalarioService) {}
  
  @Get()
  // @Roles('admin')
  async findAll(@Query() params: FindAllParams): Promise<FuncSalarioDto[]> {
    return await this.funcSalarioService.findAll(params);
  }

  @Get(':chapa')
  async findByCodigo(@Param('chapa') chapa: string): Promise<FuncSalarioDto>  {
    return await this.funcSalarioService.findByCodigo(chapa);
  }  
  @Get('perfil/dadosPagamento')
  @ApiResponse({ status: 200, description: 'Listagem de dados pagamento', type: returnFunPagDto })
  async dadosPagamento(@Query() params: FindParamsDadosPagamentoDto): Promise<returnFunPagDto> {
    const dados = await this.funcSalarioService.dadosPagamento(params); 
    return dados;
  }
}
