import { ApiProperty } from '@nestjs/swagger';

export class RegionaisParamsDto {
  @ApiProperty({ required: false, example: '1', description: 'Página atual (começa em 0)' })
  page: number;

  @ApiProperty({ required: false, example: '100', description: 'Total de itens por pagina' })
  limit: number;
}
