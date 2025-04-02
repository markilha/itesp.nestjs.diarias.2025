import { UfespEntity } from '../../database/db_oracle/entities/UfespEntity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UfespDto {
  constructor(entity: UfespEntity) {
    this.ufeIdCodigo = entity.ufeIdCodigo;
    this.tdeIdCodigo = entity.tdeIdCodigo;
    this.ufeValor = entity.ufeValor;
    this.ufeDtInicio = entity.ufeDtInicio;
    this.ufeDtFinal = entity.ufeDtFinal;
  }

  @ApiProperty()
  ufeIdCodigo: number;

  @ApiPropertyOptional()
  tdeIdCodigo?: number;

  @ApiPropertyOptional()
  ufeValor?: number;

  @ApiPropertyOptional()
  ufeDtInicio?: Date;

  @ApiPropertyOptional()
  ufeDtFinal?: Date;
}
