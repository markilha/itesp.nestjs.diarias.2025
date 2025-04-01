import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDate, IsNumber, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateUfespDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber({}, { message: 'O id deve ser um número' })
  tdeIdCodigo?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber({}, { message: 'O valor da UFESP deve ser um número' })
  ufeValor?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDate({ message: 'Data de ínicio: Deve ser enviado uma data' })
  @Transform((value) => new Date(value.value))
  ufeDtInicio?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDate({ message: 'Data final: Deve ser enviado uma data' })
  @Transform((value) => new Date(value.value))
  ufeDtFinal?: Date;
}
