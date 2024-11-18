import { Body, Controller, Get, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { extornoService } from './extorno.service';
import { FindAllParams, upateExtornoDto } from './extornoDto';
import { extornoDto } from './extornoDto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@UseGuards(AuthGuard)
@ApiTags('extorno')
@Controller('extorno')
export class extornoController {
  constructor(private readonly extornoService: extornoService) {}

  @Get()
  @ApiOperation({ summary: 'Busca todos os extornos' })
  @ApiResponse({
    status: 200,
    description: 'Retorna todos os extornos',
    type: extornoDto,
    isArray: true,
  })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor' })
  async findAll(@Query() params: FindAllParams): Promise<extornoDto[]> {
    return await this.extornoService.findAll(params);
  }

  @Get('findone')
  @ApiOperation({ summary: 'Busca o extorno pelo numero do saque' })
  @ApiResponse({
    status: 200,
    description: 'Retorna o extorno',
    type: extornoDto   
  })
  async findOne(@Query() params: FindAllParams): Promise<extornoDto> {
    return await this.extornoService.findOneOrFail(params.SQE_ID_CODIGO);
  }

  @Put()
  @ApiOperation({ summary: 'Atualizar extorno' })
  @ApiResponse({
    status: 200,
    description: 'Atualizar o extorno',
    schema: {
     example: {message: 'extorno atualizado com sucesso'},
    },  
  })
  async atualizar(@Body() dados: upateExtornoDto) {
    return await this.extornoService.update(dados);
  }

  @Post('viagemnaorealizada')
  @ApiOperation({ summary: 'Extornar' })
  @ApiResponse({
    status: 200,
    description: 'Extornar',
    schema: {
     example: {message: 'Extorno realizado com sucesso'},
    },  
  })
  @ApiResponse({ status: 500, description: 'Erro ao extornar viagem não realizada' })
  async extornar(@Body() dados: extornoDto): Promise<extornoDto> {
   return await this.extornoService.extornoViagemNaoRealizada(dados);
  }
}
