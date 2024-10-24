import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { PpessoaService } from './ppessoa.service';
import { FindAllParams } from './ppessoa.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { FuncionarioDto, } from './returnRmDto';



@UseGuards(AuthGuard) 
@Controller('ppessoa')
export class PpessoaController {

    constructor(private readonly rmService: PpessoaService) {}

    @Get()
    async findAll(@Query() params: FindAllParams): Promise<FuncionarioDto> {
      return await this.rmService.findAll(params);
    }  

}
