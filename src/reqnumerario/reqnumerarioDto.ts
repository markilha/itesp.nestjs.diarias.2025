
import { CreateReqNumerarioEntity } from 'src/database/db_mysql/entities/createReqNumerario.entity';


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
  rnuVlParcial20: number;
  rnuVlParcial40: number;
  rnuVlBase: number;
  rnuDtSaque: Date;
  rnuDtPrest: Date;
  rnuStatus: string;
  rnuMunOri: number;
  rnuMunDes: number;

  constructor(reqnumerario: CreateReqNumerarioEntity) {
    this.rnuIdCodigo = reqnumerario.rnuIdCodigo;
    this.reqIdCodigo = reqnumerario.reqIdCodigo;  
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
    this.rnuVlParcial20 = reqnumerario.rnuVlParcial20;
    this.rnuVlParcial40 = reqnumerario.rnuVlParcial40;
    this.rnuVlBase = reqnumerario.rnuVlBase;
    this.rnuDtSaque = reqnumerario.rnuDtSaque;
    this.rnuDtPrest = reqnumerario.rnuDtPrest;
    this.rnuStatus = reqnumerario.rnuStatus;
    this.rnuMunOri = reqnumerario.rnuMunOri;
    this.rnuMunDes = reqnumerario.rnuMunDes; 

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
