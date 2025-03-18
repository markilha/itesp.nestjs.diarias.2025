import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity({ name: 'S009_AUTORIZA', schema: 'FINANCEIRO' })
export class autorizaEntity {
  @PrimaryColumn({ name: 'AUT_ID_CODIGO', type: 'number' })
  AUT_ID_CODIGO: number;

  @PrimaryColumn({ name: 'SQE_ID_CODIGO', type: 'number' })
  SQE_ID_CODIGO: number;

  @PrimaryColumn({ name: 'ITE_ID_CODIGO', type: 'number' })
  ITE_ID_CODIGO: number;

  @PrimaryColumn({ name: 'RRE_ID_CODIGO', type: 'number' })
  RRE_ID_CODIGO: number;

  @PrimaryColumn({ name: 'DIR_ID_CODIGO', type: 'number' })
  DIR_ID_CODIGO: number;

  @Column({ name: 'AUT_JUSTIFICATIVA', type: 'varchar2', length: 1000, nullable: true })
  AUT_JUSTIFICATIVA?: string;

  @Column({ name: 'STS_ID_CODIGO', type: 'number', nullable: true })
  STS_ID_CODIGO?: number;

  @Column({ name: 'CHAPA', type: 'varchar2', length: 100, nullable: true })
  CHAPA?: string;

  @Column({ name: 'AUT_DATA', type: 'varchar2', length: 30, nullable: true })
  AUT_DATA?: string;

  @Column({ name: 'AUT_SOLICITA', type: 'varchar2', length: 100, nullable: true })
  AUT_SOLICITA?: string;

  @Column({ name: 'AUT_DATASOL', type: 'date', nullable: true })
  AUT_DATASOL?: Date;

  @Column({ name: 'AUT_DOCUMENTO', type: 'number', nullable: true })
  AUT_DOCUMENTO?: number;
}
