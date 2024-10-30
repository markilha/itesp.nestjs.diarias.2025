import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { FindParamsSaque, RetNumSaque, PrestacaoDto, SolitarDto } from './saque.dto';
import { SaqueService } from './saque.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { saquePrestacaoSwagger } from 'src/swagger/saqueswagger';

@UseGuards(AuthGuard)
@ApiTags('saque')
@Controller('saque')
export class SaqueController {
  constructor(private readonly saqueService: SaqueService) {}  
  
  @Get()
  @ApiOperation({ summary: 'Busca todos os saques' })
  @ApiResponse({ status: 200, description: 'Retorna todos os saques' })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor' })

  async findAll(@Query() params: FindParamsSaque): Promise<any> {
    if (!params.CHAPA) {
      throw new HttpException(
        'CHAPA não informada. Por favor, forneça uma CHAPA válida.',
        HttpStatus.BAD_REQUEST,
      );
    }
    return await this.saqueService.findAll(params);
  }

  @ApiOperation({ summary: 'Lista todas as prestações de conta' })
  @ApiResponse({ status: 200, description: 'Retorna todos as prestações' })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor', type: saquePrestacaoSwagger, isArray: true }) 
  @Get('prestacao')
  async findPrestacao(@Query() params: FindParamsSaque): Promise<PrestacaoDto> {
    if (!params.SQE_ID_CODIGO) {
      throw new HttpException(
        'Saque id não informado. Por favor, forneça uma Saque id válido.',
        HttpStatus.BAD_REQUEST,
      );      
    }

    return await this.saqueService.findPrestacao(params);
  }


  
  
  @Post('solicitar')
  @ApiOperation({ summary: 'Solicita um novo saque' })
  @ApiResponse({ status: 201, description: 'Saque solicitado com sucesso'})
  @ApiResponse({ status: 404, description: 'Diária de viagem não encontrada' })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor' })
  async solicitarSaque(@Body() params: SolitarDto): Promise<RetNumSaque> {
    return this.saqueService.solicitarSaque(params);
  }
}
