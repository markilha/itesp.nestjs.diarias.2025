import { ApiProperty } from '@nestjs/swagger';
import { RegionaisDto } from './regionais.dto';

export class PaginatedRegionaisDto {

  @ApiProperty({
    example: 1,
    description: 'Página atual',
  })
  page: number;

  @ApiProperty({
    example: 10,
    description: 'Total de itens possíveis',
  })
  count: number;

  @ApiProperty({
    example: 100,
    description: 'Quantidade de itens na pagina',
  })
  dataCount: number;

  @ApiProperty({
    example: 10,
    description: 'Total de paginas possíveis',
  })
  pageCount: number;

  @ApiProperty({
    description: 'Lista de regionais',
  })
  data: RegionaisDto[];
}
