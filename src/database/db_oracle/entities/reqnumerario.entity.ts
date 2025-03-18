import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('S009_REQNUMERARIO', { schema: 'FINANCEIRO' })
export class ReqNumerarioEntity {
  @PrimaryColumn({ name: 'RNU_ID_CODIGO' })
  RNU_ID_CODIGO: number;

  @Column({ name: 'SQE_ID_CODIGO' })
  SQE_ID_CODIGO: number;

  @Column({ name: 'REQ_ID_CODIGO' })
  REQ_ID_CODIGO: number;

  @Column({ name: 'ITE_ID_CODIGO' })
  ITE_ID_CODIGO: number;

  @Column({ name: 'RRE_ID_CODIGO' })
  RRE_ID_CODIGO: number;

  @Column({ name: 'DIR_ID_CODIGO' })
  DIR_ID_CODIGO: number;

  @Column({ name: 'RNU_DTINICIO' })
  RNU_DTINICIO: Date;

  @Column({ name: 'RNU_HORAINICIO' })
  RNU_HORAINICIO: string;

  @Column({ name: 'RNU_DTFIM' })
  RNU_DTFIM: Date;

  @Column({ name: 'RNU_HORAFIM' })
  RNU_HORAFIM: string;

  @Column({ name: 'RNU_INTPREV' })
  RNU_INTPREV: string;

  @Column({ name: 'RNU_PARPREV' })
  RNU_PARPREV: string;

  @Column({ name: 'RNU_INTREAL' })
  RNU_INTREAL: string;

  @Column({ name: 'RNU_PARREAL' })
  RNU_PARREAL: string;

  @Column({ name: 'RNU_MOTIVO' })
  RNU_MOTIVO: string;

  @Column({ name: 'RNU_PACOTE' })
  RNU_PACOTE: string;

  @Column({ length: 1, name: 'RNU_GOVERNADOR' })
  RNU_GOVERNADOR: string;

  @Column({ name: 'RNU_VLINTEGRAL' })
  RNU_VLINTEGRAL: number;

  @Column({ name: 'RNU_VLPARCIAL' })
  RNU_VLPARCIAL: number;

  @Column({ name: 'RNU_VLBASE' })
  RNU_VLBASE: number;
}
