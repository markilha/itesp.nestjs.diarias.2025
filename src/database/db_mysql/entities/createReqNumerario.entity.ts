import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('s009_reqnumerario', { schema: 'dev_itesp_diarias' })
export class CreateReqNumerarioEntity {
  @PrimaryColumn({ type: 'int', name: 'RNU_ID_CODIGO' })
  rnuIdCodigo: number;
  @Column({ type: 'varchar', name: 'chapa', nullable: true })
  chapa: string;

  @Column({ type: 'int', name: 'SQE_ID_CODIGO', nullable: true })
  sqeIdCodigo: number;

  @Column({ type: 'int', name: 'REQ_ID_CODIGO', nullable: true })
  reqIdCodigo: number;

  @Column({ type: 'int', name: 'ITE_ID_CODIGO', nullable: true })
  iteIdCodigo: number;

  @Column({ type: 'int', name: 'RRE_ID_CODIGO', nullable: true })
  rreIdCodigo: number;

  @Column({ type: 'int', name: 'DIR_ID_CODIGO', nullable: true })
  dirIdCodigo: number;

  @Column({ type: 'date', name: 'RNU_DTINICIO', nullable: true })
  rnuDtInicio: Date;

  @Column({
    type: 'varchar',
    length: 10,
    name: 'RNU_HORAINICIO',
    nullable: true,
  })
  rnuHoraInicio: string;

  @Column({ type: 'date', name: 'RNU_DTFIM', nullable: true })
  rnuDtFim: Date;

  @Column({ type: 'varchar', length: 10, name: 'RNU_HORAFIM', nullable: true })
  rnuHoraFim: string;

  @Column({ type: 'varchar', length: 5, name: 'RNU_INTPREV', nullable: true })
  rnuIntPrev: string;

  @Column({ type: 'varchar', length: 5, name: 'RNU_PARPREV', nullable: true })
  rnuParPrev: string;

  @Column({ type: 'varchar', length: 5, name: 'RNU_INTREAL', nullable: true })
  rnuIntReal: string;

  @Column({ type: 'varchar', length: 5, name: 'RNU_PARREAL', nullable: true })
  rnuParReal: string;

  @Column({ type: 'varchar', length: 1000, name: 'RNU_MOTIVO', nullable: true })
  rnuMotivo: string;

  @Column({ type: 'varchar', length: 1, name: 'RNU_PACOTE', nullable: true })
  rnuPacote: string;

  @Column({
    type: 'varchar',
    length: 1,
    name: 'RNU_GOVERNADOR',
    nullable: true,
  })
  rnuGovernador: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'RNU_VLINTEGRAL',
    nullable: true,
  })
  rnuVlIntegral: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'RNU_VLPARCIAL',
    nullable: true,
  })
  rnuVlParcial: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'RNU_VLBASE',
    nullable: true,
  })
  rnuVlBase: number;
}
