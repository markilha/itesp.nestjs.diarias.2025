import { ReqNumerarioEntity } from 'src/database/db_mysql/entities/ReqNumerario.entity';

export class ReturnReqnumerarioDto {
  rnuIdCodigo?: number;
  chapa?: string;
  sqeIdCodigo?: number;
  reqIdCodigo?: number;
  iteIdCodigo?: number;
  rreIdCodigo?: number;
  dirIdCodigo?: number;
  rnuDtInicio?: Date;
  rnuHoraInicio?: string;
  rnuDtFim?: Date;
  rnuHoraFim?: string;
  rnuIntPrev?: string;
  rnuParPrev?: string;
  rnuIntReal?: string;
  rnuParReal?: string;
  rnuMotivo?: string;
  rnuPacote?: string;
  rnuGovernador?: string;
  rnuVlIntegral?: number;
  rnuVlParcial?: number;
  rnuVlBase?: number;
  constructor(reqnumerario: ReqNumerarioEntity) {
    this.rnuIdCodigo = reqnumerario.rnuIdCodigo;
    this.chapa = reqnumerario.chapa;
    this.reqIdCodigo = reqnumerario.reqIdCodigo;
    this.sqeIdCodigo = reqnumerario.sqeIdCodigo;
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


export class CreateReqnumerarioDto {
  rnuIdCodigo?: number;
  chapa?: string;
  sqeIdCodigo?: number;
  reqIdCodigo?: number;
  iteIdCodigo?: number;
  rreIdCodigo?: number;
  dirIdCodigo?: number;
  rnuDtInicio?: Date;
  rnuHoraInicio?: string;
  rnuDtFim?: Date;
  rnuHoraFim?: string;
  rnuIntPrev?: string;
  rnuParPrev?: string;
  rnuIntReal?: string;
  rnuParReal?: string;
  rnuMotivo?: string;
  rnuPacote?: string;
  rnuGovernador?: string;
  rnuVlIntegral?: number;
  rnuVlParcial?: number;
  rnuVlBase?: number;

  constructor(
    reqnumerario: ReqNumerarioEntity,
    totalVlIntegral: number,
    totalVlParcial: number,
    vlBase: number,
  ) {
    this.rnuIdCodigo = reqnumerario.rnuIdCodigo;
    this.chapa = reqnumerario.chapa;
    this.reqIdCodigo = reqnumerario.reqIdCodigo;
    this.sqeIdCodigo = reqnumerario.sqeIdCodigo;
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
    this.rnuVlIntegral = totalVlIntegral;
    this.rnuVlParcial = totalVlParcial;
    this.rnuVlBase = vlBase;
  }
}

export interface FindAllParams {
  rnuIdCodigo: number;
  reqIdCodigo: number;
  rnuDtInicio: Date;
  rnuHoraInicio: string;
  rnuDtFim: Date;
  rnuHoraFim: string;
  rnuIntPrev: number;
  rnuParPrev: number;
  rnuIntReal: number;
  rnuParReal: number;
  rnuMotivo: string;
  rnuPacote: string;
  rnuGovernador: string;
  rnuVlIntegral: number;
  rnuVlParcial: number;
  rnuVlBase: number;
  page: number;
  limit: number;
}



// export class CreateReqnumerarioDto {
//   rnuIdCodigo?: number;
//   reqIdCodigo: number;
//   sqeIdCodigo?: number;
//   chapa: string;
//   rnuDtInicio: Date;
//   rnuHoraInicio: string;
//   rnuDtFim: Date;
//   rnuHoraFim: string;
//   rnuIntPrev: string;
//   rnuParPrev: string;
//   rnuIntReal: string;
//   rnuParReal: string;
//   rnuMotivo: string;
//   rnuPacote: string;
//   rnuGovernador: string;
//   rnuVlIntegral: number;
//   rnuVlParcial20: number;
//   rnuVlParcial40: number;
//   rnuVlBase: number;
//   rnuDtSaque: Date;
//   rnuDtPrest: Date;
//   rnuMunOri: number;
//   rnuMunDes: number;
// }

// export class ReqnumerarioDto {
//   rnuIdCodigo: number;
//   sqeIdCodigo: number;
//   reqIdCodigo: number;
//   iteIdCodigo: number;
//   rreIdCodigo: number;
//   dirIdCodigo: number;
//   rnuDtInicio: Date;
//   rnuHoraInicio: string;
//   rnuDtFim: Date;
//   rnuHoraFim: string;
//   rnuIntPrev: string;
//   rnuParPrev: string;
//   rnuIntReal: string;
//   rnuParReal: string;
//   rnuMotivo: string;
//   rnuPacote: string;
//   rnuGovernador: string;
//   rnuVlIntegral: number;
//   rnuVlParcial20: number;
//   rnuVlParcial40: number;
//   rnuVlBase: number;
//   rnuDtSaque: Date;
//   rnuDtPrest: Date;
//   rnuMunOri: number;
//   rnuMunDes: number;

//   constructor(reqnumerario: ReqNumerarioEntity) {
//     this.rnuIdCodigo = reqnumerario.rnuIdCodigo;
//     this.reqIdCodigo = reqnumerario.reqIdCodigo;
//     this.sqeIdCodigo = reqnumerario.sqeIdCodigo;
//     this.rnuDtInicio = reqnumerario.rnuDtInicio;
//     this.rnuHoraInicio = reqnumerario.rnuHoraInicio;
//     this.rnuDtFim = reqnumerario.rnuDtFim;
//     this.rnuHoraFim = reqnumerario.rnuHoraFim;
//     this.rnuIntPrev = reqnumerario.rnuIntPrev;
//     this.rnuParPrev = reqnumerario.rnuParPrev;
//     this.rnuIntReal = reqnumerario.rnuIntReal;
//     this.rnuParReal = reqnumerario.rnuParReal;
//     this.rnuMotivo = reqnumerario.rnuMotivo;
//     this.rnuPacote = reqnumerario.rnuPacote;
//     this.rnuGovernador = reqnumerario.rnuGovernador;
//     this.rnuVlIntegral = reqnumerario.rnuVlIntegral;
//     this.rnuVlParcial20 = reqnumerario.rnuVlParcial20;
//     this.rnuVlParcial40 = reqnumerario.rnuVlParcial40;
//     this.rnuVlBase = reqnumerario.rnuVlBase;
//     this.rnuDtSaque = reqnumerario.rnuDtSaque;
//     this.rnuDtPrest = reqnumerario.rnuDtPrest;
//     this.rnuMunOri = reqnumerario.rnuMunOri;
//     this.rnuMunDes = reqnumerario.rnuMunDes;

//   }
// }
