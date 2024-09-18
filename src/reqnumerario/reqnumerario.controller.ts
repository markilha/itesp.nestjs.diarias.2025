import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ReqnumerarioService } from './reqnumerario.service';
import { CreateReqnumerarioDto, FindAllParams, ReqnumerarioDto } from './reqnumerarioDto';

@Controller('reqnumerario')
export class ReqnumerarioController {
  constructor(private readonly reqnumerarioService: ReqnumerarioService) {}

  @Get()
  async findAll(@Query() params: FindAllParams): Promise<ReqnumerarioDto[]> {
    return await this.reqnumerarioService.findAll(params);
  }

  @Post()
  async createReqNumerario(@Body() body: any) {
    
    const createReqNumerarioDto: CreateReqnumerarioDto = {     
      reqIdCodigo: body.reqIdCodigo,      
      chapa: body.chapa,
      rnuMotivo: body.reqMotivo,
      rnuDtInicio: new Date(body.reqDtSaida), 
      rnuHoraInicio: body.reqHSaida,
      rnuDtFim: new Date(body.reqDtRetorno),
      rnuHoraFim: body.reqHRet,    
      rnuPacote: body.reqPacote,
      rnuIntPrev: body.reqIntegral, 
      rnuParPrev: body.reqParcial, 
      rnuIntReal: null,
      rnuParReal: null,
      rnuGovernador: body.reqGovernador,   
      rnuVlBase: 0, 
      rnuVlIntegral:body.diariaIntegral,
      rnuVlParcial20: body.diariaParcial20,
      rnuVlParcial40: body.diariaParcial40,
      rnuStatus: body.reqStatus,
      rnuDtSaque: null,
      rnuDtPrest: null,      
      rnuMunOri: body.codMunicipio,
      rnuMunDes: body.destino_cod_municipio,
    };
   
    return this.reqnumerarioService.create(createReqNumerarioDto);
  }
}
