import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('S009_REEMBOLSO', { schema: 'FINANCEIRO' })
export class reembolsoEntity {
  @PrimaryGeneratedColumn({ name: 'RRE_ID_CODIGO' })
  RRE_ID_CODIGO: number;

  @Column({ name: 'DIR_ID_CODIGO' })
  DIR_ID_CODIGO: number;

  @Column({ name: 'ITE_ID_CODIGO' })
  ITE_ID_CODIGO: number;

  @Column({ name: 'SQE_ID_CODIGO' })
  SQE_ID_CODIGO: number;

  @Column({ name: 'REE_DATA' })
  REE_DATA: string;

  @Column({ name: 'REE_AUTORIZADO' })
  REE_AUTORIZADO: string;

  @Column({ name: 'RRE_JUSTIFICATIVA' })
  RRE_JUSTIFICATIVA: string;

  @Column({ name: 'RRE_SAQUE' })
  RRE_SAQUE: number;
  constructor(item?: Partial<reembolsoEntity>) {
    Object.assign(this, item);
  }
}
