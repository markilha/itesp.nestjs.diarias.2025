import { converterPacote, converterParcial } from '../util/variaveis/converterValores';

export class CreateMotivodiariaDto {
  MDI_ID_CODIGO: number;
  ITE_ID_CODIGO: number;
  RRE_ID_CODIGO: number;
  DIR_ID_CODIGO: number;
  REQ_ID_CODIGO?: number | null;
  MDI_TIPO?: string | null;
  MDI_VALOR?: number | null;
  MDI_CHEFE?: string | null;
  MDI_GERENTE?: string | null;
  MDI_DIRETOR?: string | null;
  MDI_DIREXECUTIVO?: string | null;
  MDI_DTAUTORIZA?: Date | null;
  MDI_JUSTIFICATIVA?: string | null;
}

export class motivoDiariaDto {
  CHAPA: string;
  REQ_ID_CODIGO: number;
  TDE_ID_CODIGO: number;
  ITE_ID_CODIGO: number;
  RRE_ID_CODIGO: number;
  DIR_ID_CODIGO: number;
  MDI_VALOR: number;
  REQ_DTSAIDA: Date;
  REQ_HSAIDA: string;
  REQ_DTRET: Date;
  REQ_HRET: string;
  REQ_INTEGRAL: number;
  REQ_PARCIAL: number;
  REQ_GOVERNADOR: string;
  REQ_MOTIVO: string;
  REQ_PACOTE: string;
  REQ_STATUS: string;
  constructor(item: any) {
    this.CHAPA = item.CHAPA;
    this.REQ_ID_CODIGO = item.REQ_ID_CODIGO;
    this.TDE_ID_CODIGO = item.TDE_ID_CODIGO;
    this.ITE_ID_CODIGO = item.ITE_ID_CODIGO;
    this.RRE_ID_CODIGO = item.RRE_ID_CODIGO;
    this.MDI_VALOR = item.MDI_VALOR;
    this.DIR_ID_CODIGO = item.DIR_ID_CODIGO;
    this.REQ_DTSAIDA = item.REQ_DTSAIDA;
    this.REQ_HSAIDA = item.REQ_HSAIDA;
    this.REQ_DTRET = item.REQ_DTRET;
    this.REQ_HRET = item.REQ_HRET;
    this.REQ_INTEGRAL = Number(item.REQ_INTEGRAL) || 0;
    this.REQ_PARCIAL = converterParcial(item.REQ_PARCIAL);
    this.REQ_GOVERNADOR = item.REQ_GOVERNADOR;
    this.REQ_MOTIVO = item.REQ_MOTIVO;
    this.REQ_PACOTE = converterPacote(item.REQ_PACOTE);
    this.REQ_STATUS = item.REQ_STATUS;
  }
}

export interface FindAllParams {
  CHAPA?: string;
  REQ_ID_CODIGO?: number;
  page?: number;
  limit?: number;
}
