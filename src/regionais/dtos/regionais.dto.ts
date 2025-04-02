import { RegionalEntity } from '../../database/db_oracle/entities/regionalEntity';
import { ApiProperty } from '@nestjs/swagger';

export class RegionaisDto {

  constructor(entity: RegionalEntity) {
    this.id = entity.REG_ID_CODIGO;
    this.descricao = entity.REG_DESCRICAO;
  }

  @ApiProperty()
  id: number;

  @ApiProperty()
  descricao: string;

}
