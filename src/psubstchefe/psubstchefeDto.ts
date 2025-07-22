import { ApiProperty } from '@nestjs/swagger';

export class extornoDto {
  @ApiProperty()
  SQE_ID_CODIGO: number;
  @ApiProperty()
  ITE_ID_CODIGO: number;
  @ApiProperty()
  RRE_ID_CODIGO: number;
  @ApiProperty()
  DIR_ID_CODIGO: number;
  @ApiProperty()
  PCO_ID_CODIGO: number;
  @ApiProperty()
  FPA_ID_CODIGO?: number;
  @ApiProperty()
  EXT_VALOR?: number;
  @ApiProperty()
  EXT_DATA?: string;
  @ApiProperty()
  EXT_JUSTIFICA?: string;
  constructor(item?: Partial<extornoDto>) {
    this.SQE_ID_CODIGO = item?.SQE_ID_CODIGO;
    this.ITE_ID_CODIGO = item?.ITE_ID_CODIGO;
    this.RRE_ID_CODIGO = item?.RRE_ID_CODIGO;
    this.DIR_ID_CODIGO = item?.DIR_ID_CODIGO;
    this.PCO_ID_CODIGO = item?.PCO_ID_CODIGO;
    this.FPA_ID_CODIGO = item?.FPA_ID_CODIGO;
    this.EXT_VALOR = item?.EXT_VALOR;
    this.EXT_DATA = item?.EXT_DATA;
    this.EXT_JUSTIFICA = item?.EXT_JUSTIFICA;
  }
}

export class upateExtornoDto {
  @ApiProperty()
  SQE_ID_CODIGO: number;
  @ApiProperty()
  PCO_ID_CODIGO: number;
  @ApiProperty()
  FPA_ID_CODIGO?: number;
  @ApiProperty()
  EXT_VALOR?: number;
  @ApiProperty()
  EXT_DATA?: string;
  @ApiProperty()
  EXT_JUSTIFICA?: string;
}

export class FindAllParams {
  @ApiProperty()
  CODSECAO: string;
  @ApiProperty()
  CHAPASUBST: string;
}
