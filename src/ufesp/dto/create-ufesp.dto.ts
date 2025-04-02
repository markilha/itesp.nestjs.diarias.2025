import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsDefined, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateUfespDto {
  @ApiProperty()
  @IsDefined({ message: 'É necessário enviar o id do ' })
  @IsNumber({}, { message: 'O id deve ser um número' })
  tdeIdCodigo: number;

  @ApiProperty()
  @IsDefined({ message: 'É necessário enviar o valor da UFESP' })
  @IsNumber({}, { message: 'O valor da UFESP deve ser um número' })
  ufeValor: number;

  @ApiProperty()
  @IsDefined({ message: 'É necessário enviar a data de ínicio' })
  @IsDate({ message: 'Data de ínicio: Deve ser enviado uma data' })
  @Transform((value) => new Date(value.value))
  ufeDtInicio: Date;

  @ApiProperty()
  @IsDefined({ message: 'É necessário enviar a data final' })
  @IsDate({ message: 'Data final: Deve ser enviado uma data' })
  @Transform((value) => new Date(value.value))
  ufeDtFinal: Date;
}
