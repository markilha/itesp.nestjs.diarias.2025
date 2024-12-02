import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('S009_ITENSREQREC',{schema:'FINANCEIRO'}) // Substitua pelo nome correto da tabela
export class itensreqEntity {
  @PrimaryGeneratedColumn({ name: 'ITE_ID_CODIGO' })
  ITE_ID_CODIGO: number;

  @Column({ name: 'RRE_ID_CODIGO', type: 'number', nullable: false })
  RRE_ID_CODIGO: number;

  @Column({ name: 'DIR_ID_CODIGO', type: 'number', nullable: false })
  DIR_ID_CODIGO: number;

  @Column({ name: 'ORI_ID_CODIGO', type: 'number', nullable: true })
  ORI_ID_CODIGO: number;

  @Column({ name: 'FPA_ID_CODIGO', type: 'number', nullable: true })
  FPA_ID_CODIGO: number;

  @Column({ name: 'STS_ID_CODIGO', type: 'number', nullable: true })
  STS_ID_CODIGO: number;

  @Column({ name: 'CHAPA', type: 'varchar2', length: 16, nullable: true })
  CHAPA: string;

  @Column({ name: 'CODCOLIGADA', type: 'number', precision: 5, scale: 0, nullable: true })
  CODCOLIGADA: number;

  @Column({ name: 'IRR_VALOR_SOL', type: 'number', precision: 10, scale: 2, nullable: true })
  IRR_VALOR_SOL: number;

  @Column({ name: 'IRR_DATA_SOL', type: 'varchar2', length: 25, nullable: true })
  IRR_DATA_SOL: string;

  @Column({ name: 'IRR_VALOR_CONC', type: 'number', precision: 10, scale: 2, nullable: true })
  IRR_VALOR_CONC: number;

  @Column({ name: 'IRR_DATA_CONC', type: 'varchar2', length: 25, nullable: true })
  IRR_DATA_CONC: string;

  @Column({ name: 'IRR_VALOR_PREST', type: 'number', precision: 10, scale: 2, nullable: true })
  IRR_VALOR_PREST: number;

  @Column({ name: 'IRR_DATA_PREST', type: 'varchar2', length: 25, nullable: true })
  IRR_DATA_PREST: string;

  @Column({ name: 'IRR_JUSTIFICA', type: 'varchar2', length: 1000, nullable: true })
  IRR_JUSTIFICA: string;

  @Column({ name: 'IRR_RECURSO', type: 'char', length: 1, nullable: true })
  IRR_RECURSO: string;

  @Column({ name: 'IRR_VALOR_AUT', type: 'number', precision: 10, scale: 2, nullable: true })
  IRR_VALOR_AUT: number;

  @Column({ name: 'IRR_VLRECEBIDO', type: 'number', precision: 10, scale: 2, nullable: true })
  IRR_VLRECEBIDO: number;

  @Column({ name: 'IRR_VLDEVOLUCAO', type: 'number', precision: 10, scale: 2, nullable: true })
  IRR_VLDEVOLUCAO: number;

  @Column({ name: 'IRR_VLSAQUE', type: 'number', precision: 10, scale: 2, nullable: true })
  IRR_VLSAQUE: number;

  @Column({ name: 'IRR_VLTRANSFERIDO', type: 'number', precision: 10, scale: 2, nullable: true })
  IRR_VLTRANSFERIDO: number;

  @Column({ name: 'IRR_SALDO', type: 'number', precision: 10, scale: 2, nullable: true })
  IRR_SALDO: number;

  @Column({ name: 'IRR_COMPLEMENTO', type: 'number', precision: 10, scale: 2, nullable: true })
  IRR_COMPLEMENTO: number;

  @Column({ name: 'IRR_VLREGIONAL', type: 'number', precision: 10, scale: 2, nullable: true })
  IRR_VLREGIONAL: number;

  @Column({ name: 'TDE_ID_CODIGO', type: 'number', nullable: true })
  TDE_ID_CODIGO: number;
}
