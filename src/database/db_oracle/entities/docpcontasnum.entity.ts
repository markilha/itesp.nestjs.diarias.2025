import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('V009_DOCPCONTASNUM', { schema: 'FINANCEIRO' })
export class docpcontasnumEntity {
  @PrimaryColumn({ name: 'NDO_ID_CODIGO', type: 'number', nullable: false })
  @ApiProperty()
  NDO_ID_CODIGO: number;

  @Column({ name: 'SQE_ID_CODIGO', type: 'number' })
  @ApiProperty()
  SQE_ID_CODIGO: number;

  @Column({ name: 'PCO_ID_CODIGO', type: 'number', nullable: false })
  @ApiProperty()
  PCO_ID_CODIGO: number;

  @Column({ name: 'PES_ID_CODIGO', type: 'number', nullable: true })
  @ApiProperty({ required: false })
  PES_ID_CODIGO?: number;

  @Column({ name: 'PES_PESSOA', type: 'char', length: 1, nullable: true })
  @ApiProperty({ required: false })
  PES_PESSOA?: string;

  @Column({ name: 'NDO_ID_NUMERO', type: 'varchar2', length: 20, nullable: false })
  @ApiProperty()
  NDO_ID_NUMERO: string;

  @Column({ name: 'NDO_DATA', type: 'date', nullable: false })
  @ApiProperty({ required: false })
  NDO_DATA: Date;

  @Column({ name: 'NDO_DTENTREGA', type: 'varchar2', length: 25, nullable: true })
  @ApiProperty({ required: false })
  NDO_DTENTREGA?: string;

  @Column({ name: 'NDO_OPERADOR', type: 'varchar2', length: 100, nullable: true })
  @ApiProperty({ required: false })
  NDO_OPERADOR?: string;

  @Column({ name: 'STS_ID_CODIGO', type: 'number', nullable: true })
  @ApiProperty({ required: false })
  STS_ID_CODIGO?: number;

  @Column({ name: 'NDO_SERIE', type: 'varchar2', length: 20, nullable: true })
  @ApiProperty({ required: false })
  NDO_SERIE?: string;

  @Column({ name: 'NDO_TITULO', type: 'varchar2', length: 30, nullable: true })
  @ApiProperty({ required: false })
  NDO_TITULO?: string;

  @Column({ name: 'PES_NOME', type: 'varchar2', length: 60, nullable: true })
  @ApiProperty({ required: false })
  PES_NOME?: string;

  @Column({ name: 'CHAPA', type: 'varchar2', length: 16, nullable: false })
  @ApiProperty()
  CHAPA: string;

  @Column({ name: 'NOME', type: 'varchar2', length: 120, nullable: true })
  @ApiProperty({ required: false })
  NOME?: string;

  @Column({ name: 'CODIGO', type: 'varchar2', length: 35, nullable: true })
  @ApiProperty({ required: false })
  CODIGO?: string;

  @Column({ name: 'DESCRICAO', type: 'varchar2', length: 60, nullable: true })
  @ApiProperty({ required: false })
  DESCRICAO?: string;

  @Column({ name: 'VALORTOTAL', type: 'number', nullable: true })
  @ApiProperty({ required: false })
  VALORTOTAL?: number;

  @Column({ name: 'SQE_DTPREST', type: 'varchar2', length: 30, nullable: true })
  @ApiProperty({ required: false })
  SQE_DTPREST?: string;

  @Column({ name: 'TDE_DESCRICAO', type: 'varchar2', length: 100, nullable: true })
  @ApiProperty({ required: false })
  TDE_DESCRICAO?: string;

  @Column({ name: 'TDE_ID_CODIGO', type: 'number', nullable: true })
  @ApiProperty({ required: false })
  TDE_ID_CODIGO?: number;

  @Column({ name: 'SQE_VLSAQUE', type: 'number', precision: 10, scale: 2, nullable: true })
  @ApiProperty({ required: false })
  SQE_VLSAQUE?: number;

  @Column({ name: 'SQE_VLPREST', type: 'number', precision: 10, scale: 2, nullable: true })
  @ApiProperty({ required: false })
  SQE_VLPREST?: number;

  @Column({ name: 'SQE_DTSAQUE', type: 'varchar2', length: 30, nullable: true })
  @ApiProperty({ required: false })
  SQE_DTSAQUE?: string;

  @Column({ name: 'PCO_TIPO', type: 'char', length: 1, nullable: true })
  PCO_TIPO?: string;

  @Column({ name: 'PCO_TOTDOC', type: 'number', nullable: true })
  @ApiProperty({ required: false })
  PCO_TOTDOC?: number;

  @Column({ name: 'PRA_ID_CODIGO', type: 'number', nullable: true })
  @ApiProperty({ required: false })
  PRA_ID_CODIGO?: number;

  @Column({ name: 'REQ_ID_CODIGO', type: 'number', nullable: true })
  @ApiProperty({ required: false })
  REQ_ID_CODIGO?: number;

  @Column({ name: 'SQE_EFETIVO', type: 'char', length: 1, nullable: true })
  @ApiProperty({ required: false })
  SQE_EFETIVO?: string;

  @Column({ name: 'REG_ID_CODIGO', type: 'number', nullable: true })
  @ApiProperty({ required: false })
  REG_ID_CODIGO?: number;

  constructor(docpcontasnum?: Partial<docpcontasnumEntity>) {
    this.NDO_ID_CODIGO = docpcontasnum?.NDO_ID_CODIGO;
    this.SQE_ID_CODIGO = docpcontasnum?.SQE_ID_CODIGO;
    this.PCO_ID_CODIGO = docpcontasnum?.PCO_ID_CODIGO;
    this.PES_ID_CODIGO = docpcontasnum?.PES_ID_CODIGO;
    this.PES_PESSOA = docpcontasnum?.PES_PESSOA;
    this.NDO_ID_NUMERO = docpcontasnum?.NDO_ID_NUMERO;
    this.NDO_DATA = docpcontasnum?.NDO_DATA;
    this.NDO_DTENTREGA = docpcontasnum?.NDO_DTENTREGA;
    this.NDO_OPERADOR = docpcontasnum?.NDO_OPERADOR;
    this.STS_ID_CODIGO = docpcontasnum?.STS_ID_CODIGO;
    this.NDO_SERIE = docpcontasnum?.NDO_SERIE;
    this.NDO_TITULO = docpcontasnum?.NDO_TITULO;
    this.PES_NOME = docpcontasnum?.PES_NOME;
    this.CHAPA = docpcontasnum?.CHAPA;
    this.NOME = docpcontasnum?.NOME;
    this.CODIGO = docpcontasnum?.CODIGO;
    this.DESCRICAO = docpcontasnum?.DESCRICAO;
    this.VALORTOTAL = docpcontasnum?.VALORTOTAL;
    this.SQE_DTPREST = docpcontasnum?.SQE_DTPREST;
    this.TDE_DESCRICAO = docpcontasnum?.TDE_DESCRICAO;
    this.TDE_ID_CODIGO = docpcontasnum?.TDE_ID_CODIGO;
    this.SQE_VLSAQUE = docpcontasnum?.SQE_VLSAQUE;
    this.SQE_VLPREST = docpcontasnum?.SQE_VLPREST;
    this.SQE_DTSAQUE = docpcontasnum?.SQE_DTSAQUE;
    this.PCO_TIPO = docpcontasnum?.PCO_TIPO;
    this.PCO_TOTDOC = docpcontasnum?.PCO_TOTDOC;
    this.PRA_ID_CODIGO = docpcontasnum?.PRA_ID_CODIGO;
    this.REQ_ID_CODIGO = docpcontasnum?.REQ_ID_CODIGO;
    this.SQE_EFETIVO = docpcontasnum?.SQE_EFETIVO;
    this.REG_ID_CODIGO = docpcontasnum?.REG_ID_CODIGO;
  }
}
