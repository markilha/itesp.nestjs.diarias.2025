import { ApiProperty } from '@nestjs/swagger';
import { UfespDto } from './ufesp.dto';

export class PaginatedUfespDto {
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
    example: [],
    description: 'Lista de ufesp',
    type: () => UfespDto,
  })
  data: UfespDto[];

  constructor(partial: Partial<PaginatedUfespDto>) {
    Object.assign(this, partial);
  }
}
