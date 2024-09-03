export class RequisicaoDto {
  readonly reqIdCodigo: number;

  readonly regIdCodigo?: number;

  readonly codMunicipio?: number;

  readonly traIdCodigo?: number;

  readonly reqDtReq?: string;

  readonly reqDtSaida?: Date;

  readonly reqMotorista?: string;

  readonly reqHSaida?: string;

  readonly reqDtRetorno?: Date;

  readonly reqMotivo?: string;

  readonly reqHRet?: string;

  readonly reqKm?: number;

  readonly reqStatus?: string;

  readonly reqDiaria?: string;

  readonly reqIntegral?: number;

  readonly reqParcial?: number;

  readonly reqEspecial?: number;

  readonly reqPacote?: string;

  readonly reqGovernador?: string;
}

export enum RequisicaoStatus {
  FINALIZADA = 'FINALIZADA',  
  CANCELADA = 'CANCELADA'
}

export interface FindAllParams {
  reqIdCodigo: number;
  codMunicipio: number;
  reqStatus: RequisicaoStatus;
  page?: number;
  limit?: number;
}

