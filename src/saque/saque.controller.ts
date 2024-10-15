import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus, 
  Post,
  Query,
} from '@nestjs/common';
import {  FindParamsSaque, RetNumSaque,  PrestacaoDto, SolitarDto } from './saque.dto';
import { SaqueService } from './saque.service';


@Controller('saque')
export class SaqueController {
  constructor(private readonly saqueService: SaqueService) {}

  @Get()
  async findAll(@Query() params: FindParamsSaque): Promise<any> {
    if (!params.CHAPA) {
      throw new HttpException(
        'CHAPA não informada. Por favor, forneça uma CHAPA válida.',
        HttpStatus.BAD_REQUEST,
      );
    }
    return await this.saqueService.findAll(params);
  }

  @Get('prestacao')
  async findPrestacao(
    @Query() params: FindParamsSaque): Promise<PrestacaoDto> { 
    if (!params.SQE_ID_CODIGO) {
      throw new HttpException(
        'Saque id não informado. Por favor, forneça uma Saque id válido.',
        HttpStatus.BAD_REQUEST,
      );
    }
   
    return await this.saqueService.findPrestacao(params);

    
  }
  
  @Post('solicitar')
  async solicitarSaque(@Body() params: SolitarDto): Promise<RetNumSaque> {
    return this.saqueService.solicitarSaque(params);
  }
}
