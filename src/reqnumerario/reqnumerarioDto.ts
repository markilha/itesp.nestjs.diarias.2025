import { ApiProperty } from '@nestjs/swagger';
import { ReqNumerarioEntity } from '../database/db_oracle/entities/reqnumerario.entity';

export class ReqnumerarioDto {
  @ApiProperty()
  RNU_ID_CODIGO?: number;
  @ApiProperty({ required: false })
  SQE_ID_CODIGO: number;
  @ApiProperty({ required: false })
  REQ_ID_CODIGO: number;
  @ApiProperty({ required: false })
  ITE_ID_CODIGO: number;
  @ApiProperty({ required: false })
  RRE_ID_CODIGO: number;
  @ApiProperty({ required: false })
  DIR_ID_CODIGO: number;
  @ApiProperty({ required: false })
  RNU_DTINICIO: Date;
  @ApiProperty({ required: false })
  RNU_HORAINICIO: string;
  @ApiProperty({ required: false })
  RNU_DTFIM: Date;
  @ApiProperty({ required: false })
  RNU_HORAFIM: string;
  @ApiProperty({ required: false })
  RNU_INTPREV: string;
  @ApiProperty({ required: false })
  RNU_PARPREV: string;
  @ApiProperty({ required: false })
  RNU_INTREAL: string;
  @ApiProperty({ required: false })
  RNU_PARREAL: string;
  @ApiProperty({ required: false })
  RNU_MOTIVO: string;
  @ApiProperty({ required: false })
  RNU_PACOTE: string;
  @ApiProperty({ required: false })
  RNU_GOVERNADOR: string;
  @ApiProperty({ required: false })
  RNU_VLINTEGRAL: number;
  @ApiProperty({ required: false })
  RNU_VLPARCIAL: number;
  @ApiProperty({ required: false })
  RNU_VLBASE: number;
  constructor(item: ReqNumerarioEntity) {
    this.RNU_ID_CODIGO = item.RNU_ID_CODIGO;
    this.SQE_ID_CODIGO = item.SQE_ID_CODIGO;
    this.REQ_ID_CODIGO = item.REQ_ID_CODIGO;
    this.ITE_ID_CODIGO = item.ITE_ID_CODIGO;
    this.RRE_ID_CODIGO = item.RRE_ID_CODIGO;
    this.DIR_ID_CODIGO = item.DIR_ID_CODIGO;
    this.RNU_DTINICIO = item.RNU_DTINICIO;
    this.RNU_HORAINICIO = item.RNU_HORAINICIO;
    this.RNU_DTFIM = item.RNU_DTFIM;
    this.RNU_HORAFIM = item.RNU_HORAFIM;
    this.RNU_INTPREV = item.RNU_INTPREV;
    this.RNU_PARPREV = item.RNU_PARPREV;
    this.RNU_INTREAL = item.RNU_INTREAL;
    this.RNU_PARREAL = item.RNU_PARREAL;
    this.RNU_MOTIVO = item.RNU_MOTIVO;
    this.RNU_PACOTE = item.RNU_PACOTE;
    this.RNU_GOVERNADOR = item.RNU_GOVERNADOR;
    this.RNU_VLINTEGRAL = item.RNU_VLINTEGRAL;
    this.RNU_VLPARCIAL = item.RNU_VLPARCIAL;
    this.RNU_VLBASE = item.RNU_VLBASE;
  }
}

export class updatChegadaDto {
  @ApiProperty()
  RNU_ID_CODIGO?: number;
  @ApiProperty()
  RNU_INTREAL: string;
  @ApiProperty()
  RNU_PARREAL: string;
}

export class FindAllParams {
  @ApiProperty({ required: false })
  RNU_ID_CODIGO?: number;
  @ApiProperty({ required: false })
  SQE_ID_CODIGO?: number;
  @ApiProperty({ required: false })
  REQ_ID_CODIGO?: number;
  @ApiProperty({ required: false })
  page: number;
  @ApiProperty({ required: false })
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
