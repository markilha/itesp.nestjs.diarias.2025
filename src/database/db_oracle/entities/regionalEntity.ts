import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('S000_REGIONAL', { schema: 'COMUM' })
export class RegionalEntity {

  constructor(partial: Partial<RegionalEntity> | RegionalEntity) {
    Object.assign(this, { ...partial });
  }

  @PrimaryColumn({ name: 'REG_ID_CODIGO' })
  @ApiProperty()
  REG_ID_CODIGO: number;

  @Column({ name: 'REG_DESCRICAO' })
  @ApiProperty()
  REG_DESCRICAO: string;
}
