import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FindParamsSaque, RetNumSaque, PrestacaoDto, SolitarDto, SaqueDto, returnSaqueDto, updateEfetivoDto, returnaTotal, ParamsPendente, ParamsCancela } from './saque.dto';
import { SaqueService } from './saque.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { saquePrestacaoSwagger } from 'src/swagger/saqueswagger';
import { AllExceptionsFilter } from 'src/interceptors/all-exceptions.filter';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { AuthUserDto } from 'src/auth/use.auth.Dto';
import { SaqueEntity } from 'src/database/db_oracle/entities/saque.entity';

@UseGuards(AuthGuard)
@ApiTags('saque')
@Controller('saque')
@UseInterceptors(AllExceptionsFilter)
export class SaqueController {
  constructor(private readonly saqueService: SaqueService) {}  
  
  @Get()
  @ApiOperation({ summary: 'Busca todos os saques' })
  @ApiResponse({ status: 200, description: 'Retorna todos os saques',type: returnSaqueDto, isArray: true  })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor' })
  async findAll(@CurrentUser() user: AuthUserDto, @Query() params: FindParamsSaque): Promise<returnSaqueDto[]> {
   
    if (!params.CHAPA){
      params.CHAPA = user.chapa;
    }

    return await this.saqueService.findAll(params,user);
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
  async solicitarSaque(@CurrentUser() user: AuthUserDto,@Body() params: SolitarDto): Promise<RetNumSaque> {

    if(!params.chapa){
      params.chapa = user.chapa;
    }  

   return this.saqueService.solicitarSaque(params,user);
  }

  @Get('findone')
  @ApiOperation({ summary: 'Busca um saque' })
  @ApiResponse({ status: 200, description: 'Retorna um saque',type: SaqueDto })
  @ApiResponse({ status: 404, description: 'Saque não encontrado' })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor' })
  async findOne(@Query('SQE_ID_CODIGO') SQE_ID_CODIGO: number): Promise<SaqueDto> {
    return await this.saqueService.findOne(SQE_ID_CODIGO);
  } 

  @Post('updateEfetivo')
  @ApiOperation({ summary: 'Atualizar o status do saque' })
  @ApiResponse({ status: 200, description: 'Retorna um saque com a efetivo atualizado',type: SaqueDto })
  @ApiResponse({ status: 404, description: 'Saque não encontrado' })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor' })
  async update(@Body() params: updateEfetivoDto): Promise<SaqueDto> {
    return await this.saqueService.updateEfetivo(params.sqeIdCodigo,params.sqeEfetivo);
  }

  @Get('pendentes')
  @ApiOperation({ summary: 'Buscar saques pendente' })
  @ApiResponse({ status: 200, description: 'Retorna um saque pendentes'})
  @ApiResponse({ status: 404, description: 'Saque não encontrado' })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor' })
  async selecionaSaquePendente(@CurrentUser() user: AuthUserDto, @Query() params: ParamsPendente): Promise<SaqueDto> {
    if (!params.CHAPA){
      params.CHAPA = user.chapa;
    }
    return await this.saqueService.selecionaSaquePendentes(params);
  }

  @Get('cancela')
  @ApiOperation({ summary: 'Cancelar saque' })
  @ApiResponse({ status: 200, description: 'Cancelamento efetuado com sucesso'})
  @ApiResponse({ status: 404, description: 'Saque não encontrado' })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor' })
  async cancelarSaque(@CurrentUser() user: AuthUserDto, @Query() params: ParamsCancela): Promise<any> {
    if (!params.CHAPA){
      params.CHAPA = user.chapa;
    }
    return await this.saqueService.cancelarSaque(params, user);
  }

  @Post()
  async create(@Body() saque: SaqueEntity): Promise<SaqueEntity> {
    return await this.saqueService.create(saque);
  }

  @Get('pend')
  async selecionaPendentes(@Query() params: any): Promise<any> {
    return await this.saqueService.verificaSaquePendente(params);
  }
  @Get('confereReembolso')
  async confereReembolso(@Query('SQE_ID_CODIGO') SQE_ID_CODIGO: number): Promise<any> {
    return await this.saqueService.ConfereReembolsoDoc(SQE_ID_CODIGO);
  }

  @Post('gravasaquereembolso')
  async gravasaquereembolso(@CurrentUser() user: AuthUserDto,@Body() params: any): Promise<any> {
    return await this.saqueService.GravaSaqueReembolso(params,user);
  }
 
 
}
