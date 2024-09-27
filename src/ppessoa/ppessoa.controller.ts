import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { PpessoaService } from './ppessoa.service';
import { RMPessoaDto,FindAllParams } from './ppessoa.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { returnRmDto } from './returnRmDto';
import { FuncParams, returnFuncDto } from './returnFuncDto';


@UseGuards(AuthGuard) 
@Controller('ppessoa')
export class PpessoaController {

    constructor(private readonly rmService: PpessoaService) {}

    @Get()
    async findAll(@Query() params: FindAllParams): Promise<returnRmDto[]> {
      return await this.rmService.findAll(params);
    }  

}
