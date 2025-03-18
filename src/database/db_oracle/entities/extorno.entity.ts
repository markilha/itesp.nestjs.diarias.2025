import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('S009_EXTORNO', { schema: 'FINANCEIRO' })
export class extornoEntity {
  @PrimaryColumn({ name: 'SQE_ID_CODIGO', type: 'number' })
  SQE_ID_CODIGO: number;

  @Column({ name: 'ITE_ID_CODIGO', type: 'number', nullable: false })
  ITE_ID_CODIGO: number;

  @Column({ name: 'RRE_ID_CODIGO', type: 'number', nullable: false })
  RRE_ID_CODIGO: number;

  @Column({ name: 'DIR_ID_CODIGO', type: 'number', nullable: false })
  DIR_ID_CODIGO: number;

  @PrimaryColumn({ name: 'PCO_ID_CODIGO', type: 'number' })
  PCO_ID_CODIGO: number;

  @Column({ name: 'FPA_ID_CODIGO', type: 'number', nullable: true })
  FPA_ID_CODIGO: number;

  @Column({ name: 'EXT_VALOR', type: 'number', precision: 10, scale: 2, nullable: true })
  EXT_VALOR: number;

  @Column({ name: 'EXT_DATA', type: 'varchar2', length: 30, nullable: true })
  EXT_DATA: string;

  @Column({ name: 'EXT_JUSTIFICA', type: 'varchar2', length: 1000, nullable: true })
  EXT_JUSTIFICA: string;

  constructor(item?: Partial<extornoEntity>) {
    if (item) {
      Object.assign(this, item);
    }
  }
}
