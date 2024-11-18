import { Body, Controller, Get, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { PcontasService } from './pcontas.service';
import { createPcontasDto, FindAllParams, FindOneParams } from './pcontasDto';
import { pcontasDto } from './pcontasDto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';




@UseGuards(AuthGuard)
@ApiTags('pcontas')
@Controller('pcontas')
export class PcontasController {
    constructor(private readonly pcontasService: PcontasService) {}
  
    @Get()
    @ApiOperation({ summary: 'Busca todas as prestações de conta' })
    @ApiResponse({ status: 200, description: 'Retorna todas as prestações de conta',type: pcontasDto, isArray: true })
    @ApiResponse({ status: 500, description: 'Erro interno do servidor' })
    async findAll(@Query() params: FindAllParams): Promise<pcontasDto[]> {
      return await this.pcontasService.findAll(params);
    }
    @Get('findone')
    @ApiOperation({ summary: 'Busca uma prestações de conta' })
    @ApiResponse({ status: 200, description: 'Retorna uma prestações de conta',type: pcontasDto })
    @ApiResponse({ status: 500, description: 'Erro interno do servidor' })
    async findOne(@Query() params: FindOneParams): Promise<pcontasDto> {      
      return await this.pcontasService.findOne(params.PCO_ID_CODIGO);
    }
    //criar post
    @Post()
    @ApiOperation({ summary: 'Inseri uma nova prestação de conta' })
    @ApiResponse({ status: 200, description: 'Retorna o id da prestações de conta criada',schema: { example: { PCO_ID_CODIGO: 1 } } })
    @ApiResponse({ status: 500, description: 'Erro interno do servidor' })
    async create(@Body() params: createPcontasDto): Promise<{PCO_ID_CODIGO: number}> {
      return await this.pcontasService.createPcontas(params);
    }
}
