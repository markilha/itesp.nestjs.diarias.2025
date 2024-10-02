import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ReqnumerarioService } from './reqnumerario.service';
import { CreateReqnumerarioDto, FindAllParams, ReturnReqnumerarioDto } from './reqnumerarioDto';

interface Requisicao {
  reqIdCodigo: number;
  chapa: string;
  codMunicipio: number;
  ori_municipio: string;
  reqDtReq: string; // "YYYY-MM-DD"
  reqDtSaida: string; // "YYYY-MM-DD"
  reqHSaida: string; // "HH:MM"
  reqDtRetorno: string; // "YYYY-MM-DD"
  reqMotivo: string;
  reqHRet: string; // "HH:MM"
  reqKm: number;
  reqStatus: string;
  reqDiaria: string;
  reqIntegral: number;
  reqParcial: number;
  reqEspecial: number;
  reqPacote: string;
  reqGovernador: string;
  transmeio: number;
  municipio: number;
  des_local: string;
  des_mun_id_codigo: number;
  des_mun_nme: string;
  diariaIntegral: number;
  diariaParcial20: number;
  diariaParcial40: number;
  diariaBase: number;
  excedeu50Porcento: boolean;
}


@Controller('reqnumerario')
export class ReqnumerarioController {
  constructor(private readonly reqnumerarioService: ReqnumerarioService) {}

  @Get()
  async findAll(@Query() params: FindAllParams): Promise<ReturnReqnumerarioDto[]> {
    return await this.reqnumerarioService.findAll(params);
  }

  @Post()
  async createReqNumerario(@Body() body: Requisicao) {   

    const parcial20 = body.diariaParcial20 || 0;
    const parcial40 = body.diariaParcial40 || 0;

    const totalVlParcial = (parcial20 + parcial40);
    
    const createReqNumerarioDto: CreateReqnumerarioDto = {     
      reqIdCodigo: body.reqIdCodigo,     
      sqeIdCodigo: null,
      chapa: body.chapa,
      rnuMotivo: body.reqMotivo,
      rnuDtInicio: new Date(body.reqDtSaida), 
      rnuHoraInicio: body.reqHSaida,
      rnuDtFim: new Date(body.reqDtRetorno),
      rnuHoraFim: body.reqHRet,    
      rnuPacote: body.reqPacote,
      rnuIntPrev: body.reqIntegral.toString() || null, 
      rnuParPrev: body.reqParcial.toString() || null, 
      rnuIntReal: null,
      rnuParReal: null,
      rnuGovernador: body.reqGovernador || null,   
      rnuVlBase: body.diariaBase,
      rnuVlIntegral:body.diariaIntegral,
      rnuVlParcial: totalVlParcial,   
 
    };
   
    return this.reqnumerarioService.create(createReqNumerarioDto);
  }
  @Get('totalmes/:chapa')
  async findOne(@Param('chapa') chapa: string): Promise<number> {
    return await this.reqnumerarioService.findTotalReNumerarioMesAtual(chapa);
  }
}
