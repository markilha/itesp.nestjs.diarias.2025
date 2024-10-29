import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn } from 'typeorm';

@Entity('S001_REQUISICAO', { schema: 'TRANSPORTE' }) 
export class reqtransEntity {
  @PrimaryColumn({ name: 'REQ_ID_CODIGO' })
  @ApiProperty()
  REQ_ID_CODIGO: number;

  @Column({ name: 'REG_ID_CODIGO'})
  @ApiProperty()
  REG_ID_CODIGO: number;

  @Column({ name: 'COD_MUNICIP'})
  @ApiProperty()
  COD_MUNICIP: number;

  @Column({ name: 'TRA_ID_CODIGO'})
  @ApiProperty()
  TRA_ID_CODIGO: number;

  @Column({ name: 'REQ_DTREQ'})
  @ApiProperty()
  REQ_DTREQ: string;

  @Column({ name: 'REQ_DTSAIDA'})
  @ApiProperty()
  REQ_DTSAIDA: Date;

  @Column({ name: 'REQ_MOTORISTA' })
  @ApiProperty()
  REQ_MOTORISTA: string;

  @Column({ name: 'REQ_HSAIDA'})
  @ApiProperty()
  REQ_HSAIDA: string;

  @Column({ name: 'REQ_DTRET' })
  @ApiProperty()
  REQ_DTRET: Date;

  @Column({ name: 'REQ_MOTIVO' })
  @ApiProperty()
  REQ_MOTIVO: string;

  @Column({ name: 'REQ_HRET' })
  @ApiProperty()
  REQ_HRET: string;

  @Column({ name: 'REQ_KM'})
  @ApiProperty()
  REQ_KM: number;

  @Column({ name: 'REQ_STATUS'})
  @ApiProperty()
  REQ_STATUS: string;

  @Column({ name: 'REQ_DIARIA'})
  @ApiProperty()
  REQ_DIARIA: string;

  @Column({ name: 'REQ_INTEGRAL'})
  @ApiProperty()
  REQ_INTEGRAL: number;

  @Column({ name: 'REQ_PARCIAL'})
  @ApiProperty()
  REQ_PARCIAL: number;

  @Column({ name: 'REQ_ESPECIAL'})
  @ApiProperty()
  REQ_ESPECIAL: number;

  @Column({ name: 'REQ_PACOTE' })
  @ApiProperty()
  REQ_PACOTE: string;

  @Column({ name: 'REQ_GOVERNADOR'})
  @ApiProperty()
  REQ_GOVERNADOR: string;
}
