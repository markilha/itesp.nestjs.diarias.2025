import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('S001_NAOTRAB', { schema: 'TRANSPORTE' }) 
export class naotrabEntity {
  
  @PrimaryGeneratedColumn({ name: 'NAO_ID_CODIGO', type: 'number' })
  @ApiProperty()
  NAO_ID_CODIGO: number;
  @ApiProperty()
  @Column({ name: 'REQ_ID_CODIGO', type: 'number', nullable: false })
  REQ_ID_CODIGO: number;
  @ApiProperty({required: false})
  @Column({ name: 'NAO_INICIO', type: 'date', nullable: true })
  NAO_INICIO: Date;
  @ApiProperty({required: false})
  @Column({ name: 'NAO_FIM', type: 'date', nullable: true })
  NAO_FIM: Date;
  @ApiProperty({required: false})
  @Column({ name: 'EFE_INICIO', type: 'date', nullable: true })
  EFE_INICIO: Date;
  @ApiProperty({required: false})
  @Column({ name: 'EFE_FIM', type: 'date', nullable: true })
  EFE_FIM: Date;

  constructor(naotrab?: Partial<naotrabEntity>) {
    this.NAO_ID_CODIGO = naotrab?.NAO_ID_CODIGO;
    this.REQ_ID_CODIGO = naotrab?.REQ_ID_CODIGO;
    this.NAO_INICIO = naotrab?.NAO_INICIO;
    this.NAO_FIM = naotrab?.NAO_FIM;
    this.EFE_INICIO = naotrab?.EFE_INICIO;
    this.EFE_FIM = naotrab?.EFE_FIM;
  }
 
}
