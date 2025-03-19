import { ApiProperty } from '@nestjs/swagger';

export class RMPessoaDto {
  codigo: number;
  nome?: string;
}

export class FindAllParams {
  @ApiProperty()
  chapa: string;
  @ApiProperty()
  DIR_ID_CODIGO?: number;
  @ApiProperty()
  REG_ID_CODIGO?: number;
  @ApiProperty()
  NOME?: string;
}
