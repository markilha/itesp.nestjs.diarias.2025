import { reembolsoEntity } from "src/database/db_oracle/entities/reembolso.entity";


export class reembolsoDto {
  RRE_ID_CODIGO: number;
  DIR_ID_CODIGO: number; 
  ITE_ID_CODIGO: number; 
  SQE_ID_CODIGO: number;
  REE_DATA?: string; 
  REE_AUTORIZADO?: string;
  RRE_JUSTIFICATIVA: string;
  RRE_SAQUE?: number; 
  constructor(params: reembolsoEntity) {
    this.RRE_ID_CODIGO = params.RRE_ID_CODIGO;
    this.DIR_ID_CODIGO = params.DIR_ID_CODIGO;
    this.ITE_ID_CODIGO = params.ITE_ID_CODIGO;
    this.SQE_ID_CODIGO = params.SQE_ID_CODIGO;
    this.REE_DATA = params.REE_DATA;
    this.REE_AUTORIZADO = params.REE_AUTORIZADO;
    this.RRE_JUSTIFICATIVA = params.RRE_JUSTIFICATIVA;
    this.RRE_SAQUE = params.RRE_SAQUE;   
  }
}


export interface FindAllParams {
  RRE_ID_CODIGO?: number;
  SQE_ID_CODIGO?: number;
  ITE_ID_CODIGO?: number;
  page: number;
  limit: number;
}

