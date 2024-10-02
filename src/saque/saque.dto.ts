import { ReqNumerarioEntity } from 'src/database/db_mysql/entities/ReqNumerario.entity';
import { SaqueEntity } from 'src/database/db_mysql/entities/saque.entity';
import { StatusEntity } from 'src/database/db_mysql/entities/status.entity';

export class SaqueDto {
  sqeIdCodigo?: number;
  stsIdCodigo?: number;
  sqeDtSaque?: string | null;
  sqeVlPrest?: number | null;
  sqeDtPrest?: string | null;
  sqeVlSaque?: number | null;
  sqeEfetivo?: string | null;
  sqeDtPedido?: string | null;
  numerario?: ReqNumerarioEntity;
  status?: StatusEntity;

  constructor(SaqueEntity: SaqueEntity) {
    this.sqeIdCodigo = SaqueEntity.sqeIdCodigo;
    this.stsIdCodigo = SaqueEntity.stsIdCodigo;
    this.sqeDtSaque = SaqueEntity.sqeDtSaque;
    this.sqeVlPrest = SaqueEntity.sqeVlPrest;
    this.sqeDtPrest = SaqueEntity.sqeDtPrest;
    this.sqeVlSaque = SaqueEntity.sqeVlSaque;
    this.sqeEfetivo = SaqueEntity.sqeEfetivo;
    this.sqeDtPedido = SaqueEntity.sqeDtPedido;
  }
}

export interface FindAllParams {
  sqeIdCodigo?: number;
  stsIdCodigo?: number;
  stsDescricao?: string;
  page?: number;
  limit?: number;
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

export class SaqueResultDto {
  SQE_ID_CODIGO: number;
  RRE_ID_CODIGO: number;
  RNU_ID_CODIGO: number;
  RNU_DTINICIO: Date;
  CHAPA: string;
  NOME: string;
  REQ_ID_CODIGO: number;
  SQE_VLSAQUE: number;
  SQE_DTSAQUE: Date;
  SQE_EFETIVO: boolean;
  STS_ID_CODIGO: number;
  STS_DESCRICAO: string;
  SQE_VLPREST: number;
  SQE_DTPEDIDO: Date;
}

