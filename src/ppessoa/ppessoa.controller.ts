import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { PpessoaService } from './ppessoa.service';
import { FindAllParams } from './ppessoa.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { FuncionarioDto, } from './returnRmDto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';


@ApiTags('ppessoa')
@UseGuards(AuthGuard) 
@Controller('ppessoa')
export class PpessoaController {

    constructor(private readonly rmService: PpessoaService) {}

    @Get()
    @ApiOperation({ summary: 'Busca info de funcionário' })
    @ApiResponse({ status: 200, description: 'Retorna info de funcionário',type: FuncionarioDto })
    @ApiResponse({ status: 404, description: 'Funcionário não encontrado!!!' })
    @ApiResponse({ status: 500, description: 'Erro interno do servidor' })
   
    async findAll(@Query() params: FindAllParams): Promise<FuncionarioDto> {
      return await this.rmService.find(params);
    }  

}
