import { ApiProperty } from '@nestjs/swagger';
import { PrazosEntity } from 'src/database/db_oracle/entities/prazos.entity';

export class PrazosDto {
  @ApiProperty()
  PRA_ID_CODIGO: number;
  @ApiProperty()
  PRA_PREVISAO: string;
  @ApiProperty()
  PRA_INICIO_RECURSO: Date;
  @ApiProperty()
  PRA_FIM_RECURSO: Date;
  @ApiProperty()
  PRA_ATIVO: string;
  @ApiProperty()
  PRA_INICIO_APLICA: Date;
  @ApiProperty()
  PRA_FIM_APLICA: Date;
  @ApiProperty()
  REG_ID_CODIGO: number;
  @ApiProperty()
  ORR_ID_CODIGO: number;

  constructor(prazos?: Partial<PrazosEntity>) {
    this.PRA_ID_CODIGO = prazos?.PRA_ID_CODIGO;
    this.PRA_PREVISAO = prazos?.PRA_PREVISAO;
    this.PRA_INICIO_RECURSO = prazos?.PRA_INICIO_RECURSO;
    this.PRA_FIM_RECURSO = prazos?.PRA_FIM_RECURSO;
    this.PRA_ATIVO = prazos?.PRA_ATIVO;
    this.PRA_INICIO_APLICA = prazos?.PRA_INICIO_APLICA;
    this.PRA_FIM_APLICA = prazos?.PRA_FIM_APLICA;
    this.REG_ID_CODIGO = prazos?.REG_ID_CODIGO;
    this.ORR_ID_CODIGO = prazos?.ORR_ID_CODIGO;
  }
}

export class FindAllParams {
  PRA_ID_CODIGO?: number;
  REG_ID_CODIGO?: number;
  PRA_ATIVO?: string;
  page?: number;
  @ApiProperty({ required: false })
  limit?: number;
}
