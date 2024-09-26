import { Controller, Get, Query } from '@nestjs/common';
import { FuncsalarioService } from './funcsalario.service'; // Importa o serviço
import { FindAllParams,FuncSalarioDto } from './funcsalarioDto';


@Controller('funcsalario')
export class FuncsalarioController {
  constructor(private readonly funcSalarioService: FuncsalarioService) {}

  @Get()
  async findAll(@Query() params: FindAllParams): Promise<FuncSalarioDto[]> {
    return await this.funcSalarioService.findAll(params);
}

}
