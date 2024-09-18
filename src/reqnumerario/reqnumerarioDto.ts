import { ReqNumerarioEntity } from 'src/database/db_oracle/entities/reqnumerario.entity';

export class ReqnumerarioDto {
  rnuIdCodigo: number;
  sqeIdCodigo: number;
  reqIdCodigo: number;
  iteIdCodigo: number;
  rreIdCodigo: number;
  dirIdCodigo: number;
  rnuDtInicio: Date;
  rnuHoraInicio: string;
  rnuDtFim: Date;
  rnuHoraFim: string;
  rnuIntPrev: string;
  rnuParPrev: string;
  rnuIntReal: string;
  rnuParReal: string;
  rnuMotivo: string;
  rnuPacote: string;
  rnuGovernador: string;
  rnuVlIntegral: number;
  rnuVlParcial: number;
  rnuVlBase: number;

  constructor(reqnumerario: ReqNumerarioEntity) {
    this.rnuIdCodigo = reqnumerario.rnuIdCodigo;
    this.sqeIdCodigo = reqnumerario.sqeIdCodigo;
    this.reqIdCodigo = reqnumerario.reqIdCodigo;
    this.iteIdCodigo = reqnumerario.iteIdCodigo;
    this.rreIdCodigo = reqnumerario.rreIdCodigo;
    this.dirIdCodigo = reqnumerario.dirIdCodigo;
    this.rnuDtInicio = reqnumerario.rnuDtInicio;
    this.rnuHoraInicio = reqnumerario.rnuHoraInicio;
    this.rnuDtFim = reqnumerario.rnuDtFim;
    this.rnuHoraFim = reqnumerario.rnuHoraFim;
    this.rnuIntPrev = reqnumerario.rnuIntPrev;
    this.rnuParPrev = reqnumerario.rnuParPrev;
    this.rnuIntReal = reqnumerario.rnuIntReal;
    this.rnuParReal = reqnumerario.rnuParReal;
    this.rnuMotivo = reqnumerario.rnuMotivo;
    this.rnuPacote = reqnumerario.rnuPacote;
    this.rnuGovernador = reqnumerario.rnuGovernador;
    this.rnuVlIntegral = reqnumerario.rnuVlIntegral;
    this.rnuVlParcial = reqnumerario.rnuVlParcial;
    this.rnuVlBase = reqnumerario.rnuVlBase;
  }
}

export interface FindAllParams {
  rnuIdCodigo: number; 
  reqIdCodigo: number;
  rnuDtInicio: Date;
  rnuHoraInicio: string;
  rnuDtFim: Date;
  rnuHoraFim: string;
  rnuIntPrev: string;
  rnuParPrev: string;
  rnuIntReal: string;
  rnuParReal: string;
  rnuMotivo: string;
  rnuPacote: string;
  rnuGovernador: string;
  rnuVlIntegral: number;
  rnuVlParcial: number;
  rnuVlBase: number;
  page: number;
  limit: number;
}

export class CreateReqnumerarioDto {
  rnuIdCodigo?: number;
  reqIdCodigo: number;
  chapa: string; 
  rnuDtInicio: Date;
  rnuHoraInicio: string;
  rnuDtFim: Date;
  rnuHoraFim: string;
  rnuIntPrev: string;
  rnuParPrev: string;
  rnuIntReal: string;
  rnuParReal: string;
  rnuMotivo: string;
  rnuPacote: string;
  rnuGovernador: string;
  rnuVlIntegral: number;
  rnuVlParcial20: number;
  rnuVlParcial40: number;
  rnuVlBase: number;
  rnuDtSaque: Date;
  rnuDtPrest: Date;
  rnuStatus: string;
  rnuMunOri: number;
  rnuMunDes: number;
}
