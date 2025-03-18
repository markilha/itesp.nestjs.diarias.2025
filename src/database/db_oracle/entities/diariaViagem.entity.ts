import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('V009_DIARIAVIAGEM', { schema: 'FINANCEIRO' })
export class DiariaViagemEntity {
  @PrimaryGeneratedColumn({ name: 'MDI_ID_CODIGO', type: 'number' })
  MDI_ID_CODIGO: number;

  @Column({ name: 'ITE_ID_CODIGO', type: 'number', nullable: true })
  ITE_ID_CODIGO: number;

  @Column({ name: 'RRE_ID_CODIGO', type: 'number', nullable: true })
  RRE_ID_CODIGO: number;

  @Column({ name: 'DIR_ID_CODIGO', type: 'number', nullable: true })
  DIR_ID_CODIGO: number;

  @Column({ name: 'MDI_TIPO', type: 'varchar2', length: 50, nullable: true })
  MDI_TIPO: string;

  @Column({ name: 'MDI_VALOR', type: 'number', precision: 10, scale: 2, nullable: true })
  MDI_VALOR: number;

  @Column({ name: 'MDI_CHEFE', type: 'varchar2', length: 50, nullable: true })
  MDI_CHEFE: string;

  @Column({ name: 'MDI_GERENTE', type: 'varchar2', length: 50, nullable: true })
  MDI_GERENTE: string;

  @Column({ name: 'MDI_DIRETOR', type: 'varchar2', length: 50, nullable: true })
  MDI_DIRETOR: string;

  @Column({ name: 'MDI_DIREXECUTIVO', type: 'varchar2', length: 50, nullable: true })
  MDI_DIREXECUTIVO: string;

  @Column({ name: 'MDI_DTAUTORIZA', type: 'date', nullable: true })
  MDI_DTAUTORIZA: Date;

  @Column({ name: 'MDI_JUSTIFICATIVA', type: 'varchar2', length: 255, nullable: true })
  MDI_JUSTIFICATIVA: string;

  @Column({ name: 'CHAPA', type: 'varchar2', length: 20, nullable: true })
  CHAPA: string;

  @Column({ name: 'NOME', type: 'varchar2', length: 100, nullable: true })
  NOME: string;

  @Column({ name: 'CODSECAO', type: 'varchar2', length: 50, nullable: true })
  CODSECAO: string;

  @Column({ name: 'DESCRICAO', type: 'varchar2', length: 255, nullable: true })
  DESCRICAO: string;

  @Column({ name: 'PRA_ID_CODIGO', type: 'number', nullable: true })
  PRA_ID_CODIGO: number;

  @Column({ name: 'TDE_ID_CODIGO', type: 'number', nullable: true })
  TDE_ID_CODIGO: number;

  @Column({ name: 'TDE_DESCRICAO', type: 'varchar2', length: 100, nullable: true })
  TDE_DESCRICAO: string;

  @Column({ name: 'REQ_ID_CODIGO', type: 'number', nullable: true })
  REQ_ID_CODIGO: number;

  @Column({ name: 'REQ_DTSAIDA', type: 'date', nullable: true })
  REQ_DTSAIDA: Date;

  @Column({ name: 'REQ_HSAIDA', type: 'varchar2', length: 8, nullable: true })
  REQ_HSAIDA: string;

  @Column({ name: 'REQ_DTRET', type: 'date', nullable: true })
  REQ_DTRET: Date;

  @Column({ name: 'REQ_HRET', type: 'varchar2', length: 8, nullable: true })
  REQ_HRET: string;

  @Column({ name: 'REQ_KM', type: 'number', precision: 10, scale: 2, nullable: true })
  REQ_KM: number;

  @Column({ name: 'REQ_INTEGRAL', type: 'number', nullable: true })
  REQ_INTEGRAL: number;

  @Column({ name: 'REQ_PARCIAL', type: 'number', nullable: true })
  REQ_PARCIAL: number;

  @Column({ name: 'REQ_ESPECIAL', type: 'number', nullable: true })
  REQ_ESPECIAL: number;

  @Column({ name: 'TRA_DESCRICAO', type: 'varchar2', length: 100, nullable: true })
  TRA_DESCRICAO: string;

  @Column({ name: 'REQ_MOTIVO', type: 'varchar2', length: 255, nullable: true })
  REQ_MOTIVO: string;

  @Column({ name: 'REQ_GOVERNADOR', type: 'varchar2', length: 50, nullable: true })
  REQ_GOVERNADOR: string;
}
