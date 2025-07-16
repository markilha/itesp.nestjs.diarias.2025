import { Controller, Get, Param, Query } from '@nestjs/common';
import { FuncionariosService } from './funcionarios.service';
import { FindAllFuncionariosDto, FuncionarioDto } from './funcionariosDto';
import { ApiTags, ApiResponse, ApiOperation, ApiParam } from '@nestjs/swagger';

@ApiTags('funcionarios')
@Controller('funcionarios')
export class FuncionarioController {
  constructor(private readonly funcionarioService: FuncionariosService) { }

  @Get()
  @ApiOperation({ summary: 'Lista todos os funcionários com filtros' })
  @ApiResponse({ status: 200, description: 'Lista de funcionários retornada com sucesso' })
  async findAll(@Query() params: FindAllFuncionariosDto): Promise<FuncionarioDto[]> {
    return await this.funcionarioService.findAll(params);
  }

  @Get(':chapa')
  @ApiOperation({ summary: 'Consulta funcionário por chapa' })
  @ApiResponse({ status: 200, description: 'Funcionário encontrado' })
  @ApiParam({ name: 'chapa', description: 'Código da chapa do funcionário' })
  async findByChapa(@Param('chapa') chapa: string): Promise<FuncionarioDto> {
    return await this.funcionarioService.findByChapa(chapa);
  }

  @Get(':chapa/detalhado')
  @ApiResponse({ status: 200, description: 'Funcionário encontrado' })
  @ApiParam({ name: 'chapa', description: 'Código da chapa do funcionário detalhado' })
  findFuncionarioDetalhado(@Param('chapa') chapa: string): Promise<FuncionarioDto> {
    return this.funcionarioService.findFuncionarioDetalhado(chapa);
  }
}