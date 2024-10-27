import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn } from 'typeorm';

@Entity('S001_REQUISICAO', { schema: 'TRANSPORTE' }) 
export class reqtransEntity {
  @PrimaryColumn({ name: 'REQ_ID_CODIGO' })
  REQ_ID_CODIGO: number;

  @Column({ name: 'REG_ID_CODIGO'})
  REG_ID_CODIGO: number;

  @Column({ name: 'COD_MUNICIP'})
  COD_MUNICIP: number;

  @Column({ name: 'TRA_ID_CODIGO'})
  TRA_ID_CODIGO: number;

  @Column({ name: 'REQ_DTREQ'})
  REQ_DTREQ: string;

  @Column({ name: 'REQ_DTSAIDA'})
  REQ_DTSAIDA: Date;

  @Column({ name: 'REQ_MOTORISTA' })
  REQ_MOTORISTA: string;

  @Column({ name: 'REQ_HSAIDA'})
  REQ_HSAIDA: string;

  @Column({ name: 'REQ_DTRET' })
  REQ_DTRET: Date;

  @Column({ name: 'REQ_MOTIVO' })
  REQ_MOTIVO: string;

  @Column({ name: 'REQ_HRET' })
  REQ_HRET: string;

  @Column({ name: 'REQ_KM'})
  REQ_KM: number;

  @Column({ name: 'REQ_STATUS'})
  REQ_STATUS: string;

  @Column({ name: 'REQ_DIARIA'})
  REQ_DIARIA: string;

  @Column({ name: 'REQ_INTEGRAL'})
  REQ_INTEGRAL: number;

  @Column({ name: 'REQ_PARCIAL'})
  REQ_PARCIAL: number;

  @Column({ name: 'REQ_ESPECIAL'})
  REQ_ESPECIAL: number;

  @Column({ name: 'REQ_PACOTE' })
  REQ_PACOTE: string;

  @Column({ name: 'REQ_GOVERNADOR'})
  REQ_GOVERNADOR: string;
}
