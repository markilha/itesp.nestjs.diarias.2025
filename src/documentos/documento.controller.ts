import { Controller, Get, UseGuards, Query, Post, Body, Delete } from '@nestjs/common';
import { documentosService } from './documento.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { FindAllParams } from './documento.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { docsEntity } from '../database/db_mysql/entities/docs.entity';
@UseGuards(AuthGuard)
@ApiTags('documentos')
@Controller('documentos')
export class documentosController {
  constructor(private readonly documentosService: documentosService) {}
  @Get()
  @ApiOperation({ summary: 'Listagem todo os documentos' })
  @ApiResponse({ status: 200, description: 'Usuários encontrados' })
  async findAll(@Query() params: FindAllParams): Promise<docsEntity[]> {
    return await this.documentosService.findAll(params);
  }
  //create
  @Post()
  @ApiOperation({ summary: 'Criação de um documento' })
  @ApiResponse({ status: 201, description: 'Documento criado com sucesso' })
  async create(@Body() dados: docsEntity): Promise<docsEntity> {
    return await this.documentosService.create(dados);
  }
  //find by id usando query
  @Get('iddoc')
  @ApiOperation({ summary: 'Busca um documento por id' })
  @ApiResponse({ status: 200, description: 'Documento encontrado' })
  async findOne(@Query('ID_DOC') ID_DOC: number): Promise<docsEntity> {
    return await this.documentosService.findOne(ID_DOC);
  }
  //delete by sqe_id_codigo
  @Delete()
  @ApiOperation({ summary: 'Deleta um documento' })
  @ApiResponse({ status: 200, description: 'Documento deletado com sucesso' })
  async delete(@Query('SQE_ID_CODIGO') SQE_ID_CODIGO: number) {
    await this.documentosService.deleteBySQE_ID_CODIGO(SQE_ID_CODIGO);
    return { message: 'Documento deletado com sucesso' };
  }
}
