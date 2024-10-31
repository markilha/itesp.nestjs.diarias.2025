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
import { FindParamsSaque, RetNumSaque, PrestacaoDto, SolitarDto, SaqueDto, returnSaqueDto } from './saque.dto';
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
  @ApiResponse({ status: 200, description: 'Retorna todos os saques',type: returnSaqueDto, isArray: true  })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor' })

  async findAll(@Query() params: FindParamsSaque): Promise<returnSaqueDto[]> {
    if (!params.CHAPA) {
      throw new HttpException(
        'CHAPA não informada. Por favor, forneça uma CHAPA válida.',
        HttpStatus.BAD_REQUEST,
      );
    }
    return await this.saqueService.findAll(params);
  }

  @ApiOperation({ summary: 'Lista todas as prestações de conta' })
  @ApiResponse({ status: 200, description: 'Retorna todos as prestações',type: saquePrestacaoSwagger, isArray: true  })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor' }) 
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

  @Get('findone')
  @ApiOperation({ summary: 'Busca um saque' })
  @ApiResponse({ status: 200, description: 'Retorna um saque',type: SaqueDto })
  @ApiResponse({ status: 404, description: 'Saque não encontrado' })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor' })
  async findOne(@Query('SQE_ID_CODIGO') SQE_ID_CODIGO: number): Promise<SaqueDto> {
    return await this.saqueService.findOne(SQE_ID_CODIGO);
  }
}
