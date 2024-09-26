import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('S009_SAQUE', { schema: 'FINANCEIRO' })
export class SaqueEntity {
  @PrimaryColumn({ type: 'number', name: 'SQE_ID_CODIGO' })
  sqeIdCodigo: number;

  @PrimaryColumn({ type: 'number', name: 'ITE_ID_CODIGO' })
  iteIdCodigo: number;

  @PrimaryColumn({ type: 'number', name: 'RRE_ID_CODIGO' })
  rreIdCodigo: number;

  @PrimaryColumn({ type: 'number', name: 'DIR_ID_CODIGO' })
  dirIdCodigo: number;

  @Column({ type: 'number', name: 'FPA_ID_CODIGO', nullable: true })
  fpaIdCodigo: number;

  @Column({ type: 'varchar2', length: 30, name: 'SQE_DTSAQUE', nullable: true })
  sqeDtSaque: string;

  @Column({ type: 'number', precision: 10, scale: 2, name: 'SQE_VLPREST', nullable: true })
  sqeVlPrest: number;

  @Column({ type: 'varchar2', length: 30, name: 'SQE_DTPREST', nullable: true })
  sqeDtPrest: string;

  @Column({ type: 'number', precision: 10, scale: 2, name: 'SQE_VLSAQUE', nullable: true })
  sqeVlSaque: number;

  @Column({ type: 'char', length: 1, name: 'SQE_TIPOSAQUE', nullable: true })
  sqeTipoSaque: string;

  @Column({ type: 'char', length: 1, name: 'SQE_EFETIVO', nullable: true })
  sqeEfetivo: string;

  @Column({ type: 'varchar2', length: 30, name: 'SQE_DTPEDIDO', nullable: true })
  sqeDtPedido: string;

  @Column({ type: 'number', name: 'SQE_LOTE', nullable: true })
  sqeLote: number;

  @Column({ type: 'number', name: 'SQE_ANOLOTE', nullable: true })
  sqeAnoLote: number;

  @Column({ type: 'number', name: 'STS_ID_CODIGO', nullable: true })
  stsIdCodigo: number;

  @Column({ type: 'char', length: 1, name: 'SQE_TERCEIRO', nullable: true })
  sqeTerceiro: string;

  @Column({ type: 'number', name: 'PES_ID_CODIGO', nullable: true })
  pesIdCodigo: number;

  @Column({ type: 'char', length: 1, name: 'PES_PESSOA', nullable: true })
  pesPessoa: string;

  @Column({ type: 'varchar2', length: 300, name: 'SQE_USUARIO', nullable: true })
  sqeUsuario: string;

  @Column({ type: 'varchar2', length: 30, name: 'SQE_EMPENHO', nullable: true })
  sqeEmpenho: string;

  @Column({ type: 'varchar2', length: 15, name: 'SQE_LISTASIAFEM', nullable: true })
  sqeListaSiafem: string;
}
