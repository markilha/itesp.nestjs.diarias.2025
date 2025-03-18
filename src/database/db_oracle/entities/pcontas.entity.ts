import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('S009_PCONTAS', { schema: 'FINANCEIRO' })
export class pcontasEntity {
  @PrimaryGeneratedColumn({ name: 'PCO_ID_CODIGO', type: 'number' })
  PCO_ID_CODIGO: number;

  @Column({ name: 'PCO_TIPO', type: 'char', length: 1, nullable: false })
  PCO_TIPO: string;

  @Column({ name: 'PCO_TOTDOC', type: 'number', nullable: false })
  PCO_TOTDOC: number;
}

export interface createPcontasDto {
  PCO_TIPO: string;
  PCO_TOTDOC: number;
  SQE_ID_CODIGO: number;
  RNU_ID_CODIGO: number;
}
