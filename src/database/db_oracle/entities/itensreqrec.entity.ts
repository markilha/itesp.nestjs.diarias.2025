import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('V009_ITENSREQREC', { schema: 'FINANCEIRO' }) 
export class itensreqrecEntity {
  @PrimaryGeneratedColumn({ name: 'ITE_ID_CODIGO', type: 'number' })
  ITE_ID_CODIGO: number;

  @Column({ name: 'RRE_ID_CODIGO', type: 'number', nullable: false })
  RRE_ID_CODIGO: number;

  @Column({ name: 'DIR_ID_CODIGO', type: 'number', nullable: false })
  DIR_ID_CODIGO: number;

  @Column({ name: 'ORI_ID_CODIGO', type: 'number', nullable: true })
  ORI_ID_CODIGO: number | null;

  @Column({ name: 'FPA_ID_CODIGO', type: 'number', nullable: true })
  FPA_ID_CODIGO: number | null;

  @Column({ name: 'STS_ID_CODIGO', type: 'number', nullable: true })
  STS_ID_CODIGO: number | null;

  @Column({ name: 'TDE_ID_CODIGO', type: 'number', nullable: true })
  TDE_ID_CODIGO: number | null;

  @Column({ name: 'CHAPA', type: 'varchar2', length: 16, nullable: true })
  CHAPA: string | null;

  @Column({ name: 'CODCOLIGADA', type: 'number', precision: 5, nullable: true })
  CODCOLIGADA: number | null;

  @Column({ name: 'IRR_VALOR_SOL', type: 'number', precision: 10, scale: 2, nullable: true })
  IRR_VALOR_SOL: number | null;

  @Column({ name: 'IRR_DATA_SOL', type: 'varchar2', length: 25, nullable: true })
  IRR_DATA_SOL: string | null;

  @Column({ name: 'IRR_VALOR_CONC', type: 'number', precision: 10, scale: 2, nullable: true })
  IRR_VALOR_CONC: number | null;

  @Column({ name: 'IRR_DATA_CONC', type: 'varchar2', length: 25, nullable: true })
  IRR_DATA_CONC: string | null;

  @Column({ name: 'IRR_VALOR_PREST', type: 'number', precision: 10, scale: 2, nullable: true })
  IRR_VALOR_PREST: number | null;

  @Column({ name: 'IRR_DATA_PREST', type: 'varchar2', length: 25, nullable: true })
  IRR_DATA_PREST: string | null;

  @Column({ name: 'IRR_JUSTIFICA', type: 'varchar2', length: 1000, nullable: true })
  IRR_JUSTIFICA: string | null;

  @Column({ name: 'IRR_RECURSO', type: 'char', length: 1, nullable: true })
  IRR_RECURSO: string | null;

  @Column({ name: 'IRR_VALOR_AUT', type: 'number', precision: 10, scale: 2, nullable: true })
  IRR_VALOR_AUT: number | null;

  @Column({ name: 'IRR_VLRECEBIDO', type: 'number', precision: 10, scale: 2, nullable: true })
  IRR_VLRECEBIDO: number | null;

  @Column({ name: 'IRR_VLDEVOLUCAO', type: 'number', precision: 10, scale: 2, nullable: true })
  IRR_VLDEVOLUCAO: number | null;

  @Column({ name: 'IRR_VLSAQUE', type: 'number', precision: 10, scale: 2, nullable: true })
  IRR_VLSAQUE: number | null;

  @Column({ name: 'IRR_VLTRANSFERIDO', type: 'number', precision: 10, scale: 2, nullable: true })
  IRR_VLTRANSFERIDO: number | null;

  @Column({ name: 'IRR_SALDO', type: 'number', precision: 10, scale: 2, nullable: true })
  IRR_SALDO: number | null;

  @Column({ name: 'NOME', type: 'varchar2', length: 120, nullable: true })
  NOME: string | null;

  @Column({ name: 'CODSECAO', type: 'varchar2', length: 35, nullable: true })
  CODSECAO: string | null;

  @Column({ name: 'DESCRICAO', type: 'varchar2', length: 60, nullable: true })
  DESCRICAO: string | null;

  @Column({ name: 'TDE_DESCRICAO', type: 'varchar2', length: 100, nullable: true })
  TDE_DESCRICAO: string | null;

  @Column({ name: 'RRE_DATA', type: 'varchar2', length: 25, nullable: true })
  RRE_DATA: string | null;

  @Column({ name: 'RRE_DATAFIMPROC', type: 'varchar2', length: 25, nullable: true })
  RRE_DATAFIMPROC: string | null;

  @Column({ name: 'PRA_INICIO_RECURSO', type: 'date', nullable: true })
  PRA_INICIO_RECURSO: Date | null;

  @Column({ name: 'PRA_FIM_RECURSO', type: 'date', nullable: true })
  PRA_FIM_RECURSO: Date | null;

  @Column({ name: 'IRR_COMPLEMENTO', type: 'number', precision: 10, scale: 2, nullable: true })
  IRR_COMPLEMENTO: number | null;

  @Column({ name: 'PRA_ATIVO', type: 'varchar2', length: 1, nullable: true })
  PRA_ATIVO: string | null;

  @Column({ name: 'PRA_ID_CODIGO', type: 'number', nullable: true })
  PRA_ID_CODIGO: number | null;

  @Column({ name: 'STS_DESCRICAO', type: 'varchar2', length: 100, nullable: true })
  STS_DESCRICAO: string | null;

  @Column({ name: 'IRR_VLREGIONAL', type: 'number', precision: 10, scale: 2, nullable: true })
  IRR_VLREGIONAL: number | null;
}
