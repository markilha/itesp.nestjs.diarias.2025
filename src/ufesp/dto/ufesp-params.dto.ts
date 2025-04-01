import { ApiProperty } from '@nestjs/swagger';

export class UfespParamsDto {
  @ApiProperty({ required: false, example: '1', description: 'Página atual (começa em 1)' })
  page?: number;

  @ApiProperty({ required: false, example: '100', description: 'Total de itens por pagina' })
  limit?: number;
}
