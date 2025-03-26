import { ApiProperty } from '@nestjs/swagger';

export class FindAllParams {
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
  STATUS?: string;
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
}
