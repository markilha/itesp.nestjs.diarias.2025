import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn } from 'typeorm';

@Entity('S009_PCONTASNUM',{schema: 'FINANCEIRO'}) 
export class pcontasnumEntity {
  
  @PrimaryColumn({ name: 'PCO_ID_CODIGO', type: 'number' })
  PCO_ID_CODIGO: number;
  @Column({ name: 'RNU_ID_CODIGO', type: 'number', nullable: false })
  RNU_ID_CODIGO: number;
}
