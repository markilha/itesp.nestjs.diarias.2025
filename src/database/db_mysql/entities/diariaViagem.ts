import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('v009_diariaviagem', { schema: 'dev_itesp_diarias' })
export class DiariaViagemEntity {
  @PrimaryGeneratedColumn()
  MDI_ID_CODIGO: number;

  @Column({ nullable: true })
  ITE_ID_CODIGO: number;

  @Column({ nullable: true })
  RRE_ID_CODIGO: number;

  @Column({ nullable: true })
  DIR_ID_CODIGO: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  MDI_TIPO: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  MDI_VALOR: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  MDI_CHEFE: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  MDI_GERENTE: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  MDI_DIRETOR: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  MDI_DIREXECUTIVO: string;

  @Column({ type: 'date', nullable: true })
  MDI_DTAUTORIZA: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  MDI_JUSTIFICATIVA: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  CHAPA: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  NOME: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  CODSECAO: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  DESCRICAO: string;

  @Column({ nullable: true })
  PRA_ID_CODIGO: number;

  @Column({ nullable: true })
  TDE_ID_CODIGO: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  TDE_DESCRICAO: string;

  @Column({ nullable: true })
  REQ_ID_CODIGO: number;

  @Column({ type: 'date', nullable: true })
  REQ_DTSAIDA: Date;

  @Column({ type: 'time', nullable: true })
  REQ_HSAIDA: string;

  @Column({ type: 'date', nullable: true })
  REQ_DTRET: Date;

  @Column({ type: 'time', nullable: true })
  REQ_HRET: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  REQ_KM: number;

  @Column({ type: 'int', nullable: true })
  REQ_INTEGRAL: number;

  @Column({ type: 'int', nullable: true })
  REQ_PARCIAL: number;

  @Column({ type: 'int', nullable: true })
  REQ_ESPECIAL: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  TRA_DESCRICAO: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  REQ_MOTIVO: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  REQ_GOVERNADOR: string;
}
