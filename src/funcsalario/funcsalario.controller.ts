import { Controller, Get, Param, Query, UseGuards, Req } from '@nestjs/common';
import { FuncsalarioService } from './funcsalario.service'; // Importa o serviço
import { FindAllParams, FindParamsDadosPagamentoDto, FuncSalarioDto } from './funcsalarioDto';
import { AuthGuard } from '../auth/auth.guard';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { AuthUserDto } from 'src/auth/use.auth.Dto';

@ApiTags('funcsalario')
@Controller('funcsalario')
// @Roles(Role.admin)
@UseGuards(AuthGuard)
export class FuncsalarioController {
  constructor(private readonly funcSalarioService: FuncsalarioService) {}
  
  @Get() 
  async findAll(@Query() params: FindAllParams): Promise<FuncSalarioDto[]> { 
    return await this.funcSalarioService.findAll(params);
  }

  @Get(':chapa')
  async findByCodigo(@Param('chapa') chapa: string): Promise<FuncSalarioDto>  {    
    return await this.funcSalarioService.findByCodigo(chapa);
  } 

}
