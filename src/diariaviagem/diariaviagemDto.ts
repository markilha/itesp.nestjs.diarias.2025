import { DiariaViagemEntity } from 'src/database/db_mysql/entities/diariaViagem';

export class DiariaviagemDto {
  MDI_ID_CODIGO?: number;
  REQ_ID_CODIGO?: number;
  ITE_ID_CODIGO?: number;
  RRE_ID_CODIGO?: number;
  DIR_ID_CODIGO?: number;
  PRA_ID_CODIGO?: number;
  TDE_ID_CODIGO?: number;
  TDE_DESCRICAO?: string;
  MDI_TIPO?: string;
  MDI_VALOR?: number;
  MDI_CHEFE?: string;
  MDI_GERENTE?: string;
  MDI_DIRETOR?: string;
  MDI_DIREXECUTIVO?: string;
  MDI_DTAUTORIZA?: Date;
  MDI_JUSTIFICATIVA?: string;
  CHAPA?: string;
  NOME?: string;
  CODSECAO?: string;
  DESCRICAO?: string;
  REQ_DTSAIDA?: Date;
  REQ_HSAIDA?: string;
  REQ_DTRET?: Date;
  REQ_HRET?: string;
  REQ_KM?: number;
  REQ_INTEGRAL?: number;
  REQ_PARCIAL?: number;
  REQ_ESPECIAL?: number;
  TRA_DESCRICAO?: string;
  REQ_MOTIVO?: string;
  REQ_GOVERNADOR?: string;

  constructor(item: DiariaViagemEntity) {
    this.MDI_ID_CODIGO = item.MDI_ID_CODIGO;
    this.REQ_ID_CODIGO = item.REQ_ID_CODIGO;
    this.ITE_ID_CODIGO = item.ITE_ID_CODIGO;
    this.RRE_ID_CODIGO = item.RRE_ID_CODIGO;
    this.DIR_ID_CODIGO = item.DIR_ID_CODIGO;
    this.PRA_ID_CODIGO = item.PRA_ID_CODIGO;
    this.TDE_ID_CODIGO = item.TDE_ID_CODIGO;
    this.TDE_DESCRICAO = item.TDE_DESCRICAO;
    this.MDI_TIPO = item.MDI_TIPO;
    this.MDI_VALOR = item.MDI_VALOR;
    this.MDI_CHEFE = item.MDI_CHEFE;
    this.MDI_GERENTE = item.MDI_GERENTE;
    this.MDI_DIRETOR = item.MDI_DIRETOR;
    this.MDI_DIREXECUTIVO = item.MDI_DIREXECUTIVO;
    this.MDI_DTAUTORIZA = item.MDI_DTAUTORIZA;
    this.MDI_JUSTIFICATIVA = item.MDI_JUSTIFICATIVA;
    this.CHAPA = item.CHAPA;
    this.NOME = item.NOME;
    this.CODSECAO = item.CODSECAO;
    this.DESCRICAO = item.DESCRICAO;
    this.REQ_DTSAIDA = item.REQ_DTSAIDA;
    this.REQ_HSAIDA = item.REQ_HSAIDA;
    this.REQ_DTRET = item.REQ_DTRET;
    this.REQ_HRET = item.REQ_HRET;
    this.REQ_KM = item.REQ_KM;  
    this.REQ_INTEGRAL = item.REQ_INTEGRAL;
    this.REQ_PARCIAL = item.REQ_PARCIAL;
    this.REQ_ESPECIAL = item.REQ_ESPECIAL;
    this.TRA_DESCRICAO = item.TRA_DESCRICAO;
    this.REQ_MOTIVO = item.REQ_MOTIVO;
    this.REQ_GOVERNADOR = item.REQ_GOVERNADOR;
  }
}


export class FindAllParams {
  CHAPA?: string;
  NOME?: string;
  REQ_ID_CODIGO?: number;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
  orderBy?: string;
  orderDirection?: string;
}
