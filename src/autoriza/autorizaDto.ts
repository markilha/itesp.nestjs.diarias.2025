import { ApiProperty } from '@nestjs/swagger';

export class FindAllParams {
  @ApiProperty({ required: false })
  regionalId?: number;

  @ApiProperty({ required: false })
  CHAPA?: string;
  @ApiProperty({ required: false })
  SQE_ID_CODIGO?: number;
  @ApiProperty({ required: false })
  ITE_ID_CODIGO?: number;
  @ApiProperty({ required: false })
  RRE_ID_CODIGO?: number;
  @ApiProperty({ required: false })
  DIR_ID_CODIGO?: number;
  @ApiProperty({ required: false })
  STS_ID_CODIGO?: string;
  @ApiProperty({ required: false })
  REQ_ID_CODIGO?: string;
  @ApiProperty({ required: false })
  SQE_EFETIVO?: string;
  @ApiProperty({ required: false })
  CODSECAO?: string;
  @ApiProperty({ required: false })
  @ApiProperty({ required: false })
  SOLICITANTE?: string;
  STATUS?: string;
  @ApiProperty({ required: false })
  page?: number;
  @ApiProperty({ required: false })
  limit?: number;
}

export class filtroAutoriacao {
  @ApiProperty({ required: false })
  chapa?: string;

  @ApiProperty({ required: false })
  saque?: number;

  @ApiProperty({ required: false })
  requisicao?: number;

  @ApiProperty({ required: false })
  tipo?: string;

  @ApiProperty({ required: false })
  regional?: number;

  @ApiProperty({ required: false })
  setor?: string;

  @ApiProperty({ required: false })
  status?: string;

  @ApiProperty({ required: false })
  page?: number;

  @ApiProperty({ required: false })
  limit?: number;
}

export class CarreagaSetorDto {
  @ApiProperty({ required: false })
  CODIGO?: string;
  @ApiProperty({ required: false })
  SETOR?: string;
}

export class AutorizarRecursoDto {
  ITE_ID_CODIGO?: number;
  @ApiProperty({ required: false })
  RRE_ID_CODIGO?: number;
  @ApiProperty({ required: false })
  DIR_ID_CODIGO?: number;
  @ApiProperty({ required: false })
  VALOR?: number;
  @ApiProperty({ required: false })
  NEGADA?: boolean;
}

export class AutorizarPendenteParams {
  @ApiProperty({ required: false })
  prazo: number;

  @ApiProperty({ required: false })
  tipo: number;

  @ApiProperty({ required: false })
  page?: number;

  @ApiProperty({ required: false })
  limit?: number;
}
