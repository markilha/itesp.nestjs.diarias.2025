import { Body, Controller, Get, Post, Put, Query, UseGuards } from '@nestjs/common';
import { reembolsoService } from './reembolso.service';
import {  FindAllParams, reembolsoDto, updateDto } from './reembolsoDto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { reembolsoSwagger } from 'src/swagger/reembolsowagger';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@ApiTags('reembolso')
@Controller('reembolso')
export class reembolsoController {
  constructor(private readonly reembolsoService: reembolsoService) {}

  @Get()
  @ApiOperation({ summary: 'Busca todos os reembolsos' })
  @ApiResponse({ status: 200, description: 'Retorna todos os reembolsos',type: reembolsoSwagger, isArray: true })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor' })
  async findAll(@Query() params: FindAllParams): Promise<reembolsoDto[]> {
    return await this.reembolsoService.findAll(params);
  } 

  @Get('findone')
  @ApiOperation({ summary: 'Buscar reembolso pelo numero do saque' })
  @ApiResponse({ status: 200, description: 'Retorna somente um reembolso',type: reembolsoSwagger})
  @ApiResponse({ status: 500, description: 'Erro interno do servidor' })
  async findone(@Query() params: FindAllParams): Promise<reembolsoDto> {
    const sqlidcodigo = Number(params.SQE_ID_CODIGO);
    return await this.reembolsoService.findone(sqlidcodigo);
  }

  @Put()
  @ApiOperation({ summary: 'Atualizar um reembolso' })
  @ApiResponse({
    status: 200,
    description: 'Atualizado com sucesso',
    schema: {
      example: { message: 'Atualizado com sucesso!!!' },
    },
  })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor' })
  async update(@Body() dados: updateDto): Promise<{ message: string }> { 
    return await this.reembolsoService.update(dados);
  }
 
}
