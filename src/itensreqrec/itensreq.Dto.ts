import { ApiProperty } from '@nestjs/swagger';

export class paramsItemRecurso {
  @ApiProperty()
  CHAPA: string;
  @ApiProperty({ required: false })
  RRE_ID_CODIGO?: number;
  @ApiProperty({ required: false })
  page?: number;
  @ApiProperty({ required: false })
  limit?: number;
}

export class itemRecursoDto {
  ITE_ID_CODIGO: number;
  RRE_ID_CODIGO: number;
  DIR_ID_CODIGO: number;
  ORI_ID_CODIGO?: number;
  FPA_ID_CODIGO?: number;
  STS_ID_CODIGO?: number;
  CHAPA?: string;
  CODCOLIGADA?: number;
  IRR_VALOR_SOL?: number;
  IRR_DATA_SOL?: string;
  IRR_VALOR_CONC?: number;
  IRR_DATA_CONC?: string;
  IRR_VALOR_PREST?: number;
  IRR_DATA_PREST?: string;
  IRR_JUSTIFICA?: string;
  IRR_RECURSO?: string;
  IRR_VALOR_AUT?: number;
  IRR_VLRECEBIDO?: number;
  IRR_VLDEVOLUCAO?: number;
  IRR_VLSAQUE?: number;
  IRR_VLTRANSFERIDO?: number;
  IRR_SALDO?: number;
  IRR_COMPLEMENTO?: number;
  IRR_VLREGIONAL?: number;
  TDE_ID_CODIGO?: number;

  constructor(partial?: Partial<itemRecursoDto>) {
    Object.assign(this, partial);
  }
}
