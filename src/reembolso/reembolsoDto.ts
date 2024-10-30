import { ApiProperty } from "@nestjs/swagger";
import { reembolsoEntity } from "../database/db_oracle/entities/reembolso.entity";


export class reembolsoDto {
  @ApiProperty()
  RRE_ID_CODIGO: number;
  @ApiProperty()
  DIR_ID_CODIGO: number; 
  @ApiProperty()
  ITE_ID_CODIGO: number; 
  @ApiProperty()
  SQE_ID_CODIGO: number;
  @ApiProperty()
  REE_DATA?: string; 
  @ApiProperty()
  REE_AUTORIZADO?: string;
  @ApiProperty()
  RRE_JUSTIFICATIVA: string;
  @ApiProperty()
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
export class FindAllParams {
  @ApiProperty({ required: false })
  RRE_ID_CODIGO?: number;
  @ApiProperty({ required: false })
  SQE_ID_CODIGO?: number;
  @ApiProperty({ required: false })
  ITE_ID_CODIGO?: number;
  @ApiProperty({ required: false })
  page: number;
  @ApiProperty({ required: false })
  limit: number;
}

export class justificativaDto{
  @ApiProperty()
  RRE_ID_CODIGO: number;
  @ApiProperty()
  DIR_ID_CODIGO: number;
  @ApiProperty()
  ITE_ID_CODIGO: number;
  @ApiProperty()
  SQE_ID_CODIGO: number;
  @ApiProperty()
  REQ_MOTIVO: string;  
}

