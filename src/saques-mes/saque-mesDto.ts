export class SaqueMesDto {
  ITE_ID_CODIGO: number;
  RRE_ID_CODIGO: number;
  DIR_ID_CODIGO?: number;
  chapa: string;
  SQE_DTSAQUE?: Date;
  SQE_VLSAQUE?: number;
  SQE_DTPREST?: Date;
  SQE_VLPREST?: number;
  TDE_ID_CODIGO: string;
  SQE_TIPOSAQUE: string;
  SQE_EFETIVO: string;
  SQE_LOTE?: string;
  SQE_ANOLOTE?: number;
  MesPed?: string;
  MesSaque?: string;
  MesPrest?: string;
}

export class FindAllParams {
  chapa: string;
  page: number;
  limit: number;
}
