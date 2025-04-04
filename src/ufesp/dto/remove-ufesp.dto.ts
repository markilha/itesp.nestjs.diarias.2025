import { ApiProperty } from '@nestjs/swagger';

export class RemoveUfespDto {
  @ApiProperty({ description: 'Quantidade de itens removidos' })
  removidos: number;
}
