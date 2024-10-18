import { ReqNumerarioEntity } from 'src/database/db_mysql/entities/ReqNumerario.entity';
import { SaqueEntity } from 'src/database/db_mysql/entities/saque.entity';
import { StatusEntity } from 'src/database/db_mysql/entities/status.entity';



export interface FindAllParams {
  sqeIdCodigo?: number;
  stsIdCodigo?: number;
  stsDescricao?: string; 
  CHAPA?: string;
  page?: number;
  limit?: number;
}

export interface FindParamsSaque {
  REQ_ID_CODIGO?: number;
  SQE_ID_CODIGO?: number;
  ITE_ID_CODIGO?: number;
  CHAPA?: string;
  STS_DESCRICAO?: string;
  REQ_STATUS?: string;
  STATUS?: string;
  usePrestDate?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
  orderBy?: string;
  orderDirection?: 'ASC' | 'DESC';
}

export class CreateSaqueDto {
  sqeIdCodigo?: number;
  iteIdCodigo?: number;
  rreIdCodigo?: number;
  dirIdCodigo?: number;
  fpaIdCodigo?: number;
  stsIdCodigo?: number;
  sqedtSaque?: string;
  sqevlPrest?: number;
  sqedtPrest?: string;
  sqevlSaque?: number;
  sqetipoSaque?: string;
  sqeefetivo?: string;
  sqedtPedido?: string;
  sqelote?: number;
  sqeanoLote?: number;
  sqeterceiro?: string;
  pesidcodigo?: number;
  pespessoa?: string;
  sqe_suario?: string;
  sqeempenho?: string;
  sqelistaSiafem?: string;
}

export class SaqueDto {
  SQE_DTSAQUE: string;
  SQE_DTPREST: string;
  NOME: string;
  REQ_ID_CODIGO: number;
  SQE_ID_CODIGO: number;
  TDE_DESCRICAO: string;
  SQE_VLSAQUE: number;
  SQE_VLPREST: number;
  VL_COMPLEMENTAR: number;
  VL_EXTORNO: number;
  STATUS: string;
  REQ_DTREQ: string;
  SQE_DTPEDIDO: string;
  REQ_STATUS: string;
  CHAPA: string;
  STS_DESCRICAO: string;

  constructor(params: any) {
    this.SQE_DTPEDIDO = params.SQE_DTPEDIDO;
    this.SQE_DTSAQUE = params.SQE_DTSAQUE;
    this.SQE_DTPREST = params.SQE_DTPREST;
    this.NOME = params.NOME;
    this.REQ_ID_CODIGO = params.REQ_ID_CODIGO;
    this.SQE_ID_CODIGO = params.SQE_ID_CODIGO;
    this.TDE_DESCRICAO = params.TDE_DESCRICAO;
    this.SQE_VLSAQUE = params.SQE_VLSAQUE;
    this.SQE_VLPREST = params.SQE_VLPREST;
    this.VL_COMPLEMENTAR = params.VL_COMPLEMENTAR;
    this.VL_EXTORNO = params.VL_EXTORNO;
    this.STATUS = params.STATUS;
    this.REQ_DTREQ = params.REQ_DTREQ;
    this.REQ_STATUS = params.REQ_STATUS;
    this.CHAPA = params.CHAPA;
    this.STS_DESCRICAO = params.STS_DESCRICAO;  
    
  }
}


export class PrestacaoDto {
  NOME: string;
  REQ_ID_CODIGO: number;
  SQE_ID_CODIGO: number;
  CHAPA: string;
  SQE_VLPREST: number;
  REQ_DTREQ: string;
  TIPO_DESPESA: string;
  TRA_DESCRICAO: string;
  TIPO_SAQUE: string;
  NME_MUNIC: string;
  REG_DESCRICAO: string;
  MUN_CIDADE: string;
  DES_LOCAL: string;
  REQ_DTSAIDA: Date;
  REQ_DTRET: Date;
  REQ_HSAIDA: string;
  REQ_HRET: string;
  REQ_INTEGRAL: number;
  REQ_PARCIAL: number;
  REQ_PACOTE: string;
  REQ_GOVERNADOR: string;
  REQ_MOTIVO: string;
  CTR_STATUS: string;
  STATUS: string;
  ITI_DTSAIDA: Date;
  ITI_HSAIDA: string;
  ITI_DTCHEGADA: Date;
  ITI_HCHEGADA: string;
  INTREAL: number;
  PARREAL: number;
  VLINTEGRAL:number;
  VLPARCIAL: number; 
  VLBASE: number;
  SQE_VLSAQUE: number;
  VLPREST: number;
  VLCOMPLEMENTAR: number;
  VLEXTORNO: number;
  VLDIARIA: number;
  PORCDIARIA: number;
  SQE_DTPREST: string;
  REQ_STATUS: string; 
 

  constructor(params: any) {
    this.NOME = params.NOME;
    this.REQ_ID_CODIGO = params.REQ_ID_CODIGO;
    this.SQE_ID_CODIGO = params.SQE_ID_CODIGO;
    this.CHAPA = params.CHAPA;
    this.SQE_DTPREST = params.SQE_DTPREST;
    this.STATUS = params.STATUS;
    this.REQ_DTREQ = params.REQ_DTREQ;
    this.TIPO_DESPESA = 'Diarias'
    this.TRA_DESCRICAO = params.TRA_DESCRICAO;
    this.TIPO_SAQUE = 'Viagem';
    this.NME_MUNIC = params.NME_MUNIC;
    this.REG_DESCRICAO = params.REG_DESCRICAO;
    this.MUN_CIDADE = params.MUN_CIDADE;
    this.DES_LOCAL = params.DES_LOCAL;
    this.REQ_DTSAIDA = params.REQ_DTSAIDA;
    this.REQ_DTRET = params.REQ_DTRET;
    this.REQ_HSAIDA = params.REQ_HSAIDA;
    this.REQ_HRET = params.REQ_HRET;
    this.REQ_INTEGRAL = params.REQ_INTEGRAL;
    this.REQ_PARCIAL = params.REQ_PARCIAL;
    this.REQ_PACOTE = params.REQ_PACOTE;
    this.REQ_GOVERNADOR = params.REQ_GOVERNADOR;
    this.REQ_MOTIVO = params.REQ_MOTIVO;
    this.CTR_STATUS = params.CTR_STATUS;
    this.ITI_DTSAIDA = params.ITI_DTSAIDA;
    this.ITI_HSAIDA = params.ITI_HSAIDA;
    this.ITI_DTCHEGADA = params.ITI_DTCHEGADA;
    this.ITI_HCHEGADA = params.ITI_HCHEGADA;
    this.INTREAL = params.INTREAL;     
    this.PARREAL = params.PARREAL;
    this.VLINTEGRAL = params.VLINTEGRAL;
    this.VLPARCIAL = params.VLPARCIAL;   
    this.VLBASE = params.VLBASE;
    this.SQE_VLSAQUE = params.SQE_VLSAQUE;   
    this.VLCOMPLEMENTAR = params.VLCOMPLEMENTAR;
    this.VLEXTORNO = params.VLEXTORNO;
    this.REQ_STATUS = params.REQ_STATUS;
    this.VLPREST = params.VLPREST;
    this.VLDIARIA = params.VLDIARIA;
    this.PORCDIARIA = params.PORCDIARIA;

  }
}

export class SaquePrestDto {
  SQE_DTSAQUE: string;
  SQE_DTPREST: string;
  NOME: string;
  REQ_ID_CODIGO: number;
  SQE_ID_CODIGO: number;
  TDE_DESCRICAO: string;
  SQE_VLSAQUE: number;
  SQE_VLPREST: number;
  VL_COMPLEMENTAR: number;
  VL_EXTORNO: number;
  STATUS: string;
  REQ_DTREQ: string;
  SQE_DTPEDIDO: string;
  REQ_STATUS: string;
  CHAPA: string;
  STS_DESCRICAO: string;
  TIPO_DESPESA: string;
  TRA_DESCRICAO: string;
  TIPO_SAQUE: string;
  NME_MUNIC: string;
  REG_DESCRICAO: string;
  MUN_CIDADE: string;
  DES_LOCAL: string;
  REQ_DTSAIDA: Date;
  REQ_DTRET: Date;
  REQ_HSAIDA: string;
  REQ_HRET: string;
  REQ_INTEGRAL: number;
  REQ_PARCIAL: number;
  REQ_PACOTE: string;
  REQ_GOVERNADOR: string;
  REQ_MOTIVO: string;
  CTR_STATUS: string; 
  ITI_DTSAIDA: Date;
  ITI_HSAIDA: string;
  ITI_DTCHEGADA: Date;
  ITI_HCHEGADA: string;
  INTREAL: number;
  PARREAL: number;
  VLINTEGRAL:number;
  VLPARCIAL: number; 
  VLBASE: number; 
  VLPREST: number;
  VLCOMPLEMENTAR: number;
  VLEXTORNO: number;
  VLDIARIA: number;
  PORCDIARIA: number;

  constructor(params: any) {
    this.SQE_DTPEDIDO = params.SQE_DTPEDIDO;
    this.SQE_DTSAQUE = params.SQE_DTSAQUE;
    this.SQE_DTPREST = params.SQE_DTPREST;
    this.NOME = params.NOME;
    this.REQ_ID_CODIGO = params.REQ_ID_CODIGO;
    this.SQE_ID_CODIGO = params.SQE_ID_CODIGO;
    this.TDE_DESCRICAO = params.TDE_DESCRICAO;
    this.SQE_VLSAQUE = params.SQE_VLSAQUE;
    this.SQE_VLPREST = params.SQE_VLPREST;
    this.VL_COMPLEMENTAR = params.VL_COMPLEMENTAR;
    this.VL_EXTORNO = params.VL_EXTORNO;
    this.REQ_DTREQ = params.REQ_DTREQ;
    this.REQ_STATUS = params.REQ_STATUS;
    this.CHAPA = params.CHAPA;
    this.STS_DESCRICAO = params.STS_DESCRICAO;
    this.STATUS = params.STATUS;
    this.TIPO_DESPESA = 'Diarias';
    this.TRA_DESCRICAO = params.TRA_DESCRICAO;
    this.TIPO_SAQUE = 'Viagem';
    this.NME_MUNIC = params.NME_MUNIC;
    this.REG_DESCRICAO = params.REG_DESCRICAO;
    this.MUN_CIDADE = params.MUN_CIDADE;
    this.DES_LOCAL = params.DES_LOCAL;
    this.REQ_DTSAIDA = params.REQ_DTSAIDA;
    this.REQ_DTRET = params.REQ_DTRET;
    this.REQ_HSAIDA = params.REQ_HSAIDA;
    this.REQ_HRET = params.REQ_HRET;
    this.REQ_INTEGRAL = params.REQ_INTEGRAL;
    this.REQ_PARCIAL = params.REQ_PARCIAL;
    this.REQ_PACOTE = params.REQ_PACOTE;
    this.REQ_GOVERNADOR = params.REQ_GOVERNADOR;
    this.REQ_MOTIVO = params.REQ_MOTIVO;
    this.CTR_STATUS = params.CTR_STATUS;
    this.ITI_DTSAIDA = params.ITI_DTSAIDA;
    this.ITI_HSAIDA = params.ITI_HSAIDA;
    this.ITI_DTCHEGADA = params.ITI_DTCHEGADA;
    this.ITI_HCHEGADA = params.ITI_HCHEGADA;
    this.INTREAL = params.INTREAL;
    this.PARREAL = params.PARREAL;
    this.VLINTEGRAL = params.VLINTEGRAL;
    this.VLPARCIAL = params.VLPARCIAL;
    this.VLBASE = params.VLBASE;
    this.VLCOMPLEMENTAR = params.VLCOMPLEMENTAR;
    this.VLEXTORNO = params.VLEXTORNO;
    this.VLPREST = params.VLPREST;
    this.VLDIARIA = params.VLDIARIA;
    this.PORCDIARIA = params.PORCDIARIA;   
    
  }
}



export class InsS009SaqueDto {
  par1: string; // REEMBOLSO/COMPLEMENTO
  par2: string; // SEM RECURSO
  par3: string; // Tipo de despesa
  par4: number; // ITE_ID_CODIGO
  par5: number; // RRE_ID_CODIGO
  par6: number; // DIR_ID_CODIGO
  par7: number; // SQE_VLPREST
  par8: Date; // SQE_DTPREST
  par9: number; // SQE_VLSAQUE
  par10: string; // SQE_TIPOSAQUE
  par11: string; // SQE_EFETIVO
  par12: string; // SQE_TERCEIRO
  par13: number; // PES_ID_CODIGO
  par14: string; // PES_PESSOA
  par15: number; // STS_ID_CODIGO
  par16: string; // SQE_USUARIO
  par17: number; // REQ_ID_CODIGO
  par18: Date; // RNU_DTINICIO
  par19: string; // RNU_HORAINICIO
  par20: Date; // RNU_DTFIM
  par21: string; // RNU_HORAFIM
  par22: number; // RNU_INTPREV
  par23: number; // RNU_PARPREV
  par24: number; // RNU_INTREAL
  par25: number; // RNU_PARREAL
  par26: string; // RNU_PACOTE
  par27: string; // RNU_GOVERNADOR
  par28: string; // RRE_JUSTIFICATIVA
  par29: string; // REQ_STATUS
  par30: number; // RNU_VLINTEGRAL
  par31: number; // RNU_VLPARCIAL
  par32: number; // RNU_VLBASE

  constructor(params: any) {
    this.par1 = params.par1;
    this.par2 = params.par2;
    this.par3 = params.par3;
    this.par4 = params.par4;
    this.par5 = params.par5;
    this.par6 = params.par6;
    this.par7 = params.par7;
    this.par8 = params.par8;
    this.par9 = params.par9;
    this.par10 = params.par10;
    this.par11 = params.par11;
    this.par12 = params.par12;
    this.par13 = params.par13;
    this.par14 = params.par14;
    this.par15 = params.par15;
    this.par16 = params.par16;
    this.par17 = params.par17;
    this.par18 = params.par18;
    this.par19 = params.par19;
    this.par20 = params.par20;
    this.par21 = params.par21;
    this.par22 = params.par22;
    this.par23 = params.par23;
    this.par24 = params.par24;
    this.par25 = params.par25;
    this.par26 = params.par26;
    this.par27 = params.par27;
    this.par28 = params.par28;
    this.par29 = params.par29;
    this.par30 = params.par30;
    this.par31 = params.par31;
    this.par32 = params.par32;
  }
}

export class SolitarDto {
  reqIdCodigo: number;
  chapa: string;
  reqPacote: number;
  reqStatus: string;
  diariaIntegral: number;
  diariaParcial: number;
  diariaBase: number;
}

export interface RetNumSaque {
  sqeIdCodigo: string;
}
