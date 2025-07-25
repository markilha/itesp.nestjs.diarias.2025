import { ApiProperty } from '@nestjs/swagger';

export class PsecaoDto {
  CODIGO: string;
  DESCRICAO: string;
}

export class FindAllParams {
  @ApiProperty()
  codigo: string;
  @ApiProperty()
  descricao?: string;
  @ApiProperty()
  cidade?: string;
  @ApiProperty({ required: false, default: 1 })
  page?: number;
  @ApiProperty({ required: false, default: 500 })
  limit?: number;
}
