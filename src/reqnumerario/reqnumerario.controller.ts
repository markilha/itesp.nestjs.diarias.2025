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
}
