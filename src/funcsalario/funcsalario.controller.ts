import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { FuncsalarioService } from './funcsalario.service'; // Importa o serviço
import { FindAllParams, FuncSalarioDto } from './funcsalarioDto';
import { AuthGuard } from '../auth/auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/roles.decorator';

@ApiTags('funcsalario')
@Controller('funcsalario')
export class FuncsalarioController {
  constructor(private readonly funcSalarioService: FuncsalarioService) {}

  @UseGuards(AuthGuard)
  @Get()
  @Roles('admin')
  async findAll(@Query() params: FindAllParams): Promise<FuncSalarioDto[]> {
    return await this.funcSalarioService.findAll(params);
  }

  @Get(':chapa')

  async findByCodigo(@Param('chapa') chapa: string): Promise<FuncSalarioDto>  {
    return await this.funcSalarioService.findByCodigo(chapa);
  }
}
