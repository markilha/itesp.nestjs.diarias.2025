import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('S009_NDOCUMENTO', { schema: 'FINANCEIRO' })
export class ndocumentoEntity {
  @PrimaryGeneratedColumn({ name: 'NDO_ID_CODIGO', type: 'number' }) // Chave primária
  NDO_ID_CODIGO: number;

  @Column({ name: 'PCO_ID_CODIGO', type: 'number', nullable: false })
  PCO_ID_CODIGO: number;

  @Column({ name: 'PES_ID_CODIGO', type: 'number', nullable: true })
  PES_ID_CODIGO?: number;

  @Column({ name: 'PES_PESSOA', type: 'char', length: 1, nullable: true })
  PES_PESSOA?: string;

  @Column({ name: 'NDO_ID_NUMERO', type: 'varchar2', length: 20, nullable: false })
  NDO_ID_NUMERO: string;

  @Column({ name: 'NDO_DATA', type: 'date', nullable: true })
  NDO_DATA?: Date;

  @Column({ name: 'NDO_DTENTREGA', type: 'varchar2', length: 25, nullable: true })
  NDO_DTENTREGA?: string;

  @Column({ name: 'NDO_OPERADOR', type: 'varchar2', length: 100, nullable: true })
  NDO_OPERADOR?: string;

  @Column({ name: 'STS_ID_CODIGO', type: 'number', nullable: true })
  STS_ID_CODIGO?: number;

  @Column({ name: 'NDO_SERIE', type: 'varchar2', length: 20, nullable: true })
  NDO_SERIE?: string;

  @Column({ name: 'NDO_TITULO', type: 'varchar2', length: 30, nullable: true })
  NDO_TITULO?: string;
}
