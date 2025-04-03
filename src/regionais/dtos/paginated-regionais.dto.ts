import { ApiProperty } from '@nestjs/swagger';
import { RegionaisDto } from './regionais.dto';

export class PaginatedRegionaisDto {

  constructor(partial: Partial<PaginatedRegionaisDto>) {
    Object.assign(this, partial);
  }

  @ApiProperty({
    example: 1,
    description: 'Página atual',
  })
  page: number;

  @ApiProperty({
    example: 100,
    description: 'Total de itens possíveis',
  })
  total: number;

  @ApiProperty({
    example: 10,
    description: 'Total de paginas possíveis',
  })
  pageCount: number;

  @ApiProperty({
    example: 10,
    description: 'Quantidade de itens na pagina',
  })
  count: number;

  @ApiProperty({
    description: 'Lista de regionais',
  })
  data: RegionaisDto[];
}
