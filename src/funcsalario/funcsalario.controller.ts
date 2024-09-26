import { Controller, Get, Param, Query } from '@nestjs/common';
import { FuncsalarioService } from './funcsalario.service'; // Importa o serviço
import { FindAllParams, FuncSalarioDto } from './funcsalarioDto';

@Controller('funcsalario')
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
