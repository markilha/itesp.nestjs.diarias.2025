import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ReqnumerarioService } from './reqnumerario.service';
import {  FindAllParams, ReqnumerarioDto } from './reqnumerarioDto';
import { ApiExcludeEndpoint, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { reqnumerarioSwagger } from 'src/swagger/reqnumerario.swagger';



@Controller('reqnumerario')
@ApiTags('reqnumerario')
export class ReqnumerarioController {
  constructor(private readonly reqnumerarioService: ReqnumerarioService) {}

  @Get()
  @ApiOperation({ summary: 'Lista todos os requisição de numerários' })
  @ApiResponse({
    status: 200,
    description: 'Numerários encontradas',
    type: reqnumerarioSwagger,
    isArray: true,
  })
  @ApiResponse({
    status: 401,
    description: 'token inválido',
  })
  @ApiResponse({
    status: 500,
    description: 'Erro ao buscar numerarios',
  })

  async findAll(@Query() params: FindAllParams): Promise<ReqnumerarioDto[]> {
    return await this.reqnumerarioService.findAll(params);
  } 

  @ApiExcludeEndpoint()
  @Get('findlast')
  async findLast(): Promise<number> {
    return await this.reqnumerarioService.findLast();    
  }
}
