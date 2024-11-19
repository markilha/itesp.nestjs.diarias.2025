import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('S001_ITINERARIO', { schema: 'TRANSPORTE' })
export class ItinerarioEntity {

  @PrimaryColumn({ name: 'ITI_ID_CODIGO', type: 'number', precision: 10, scale: 0 })
  ITI_ID_CODIGO: number;

  @PrimaryColumn({ name: 'REQ_ID_CODIGO', type: 'number', precision: 10, scale: 0 })
  REQ_ID_CODIGO: number;

  @Column({ name: 'ITI_HCHEGADA', type: 'varchar2', length: 10, nullable: true })
  ITI_HCHEGADA: string;

  @Column({ name: 'MUN_ID_CODIGO', type: 'number', precision: 10, scale: 0, nullable: true })
  MUN_ID_CODIGO: number;

  @Column({ name: 'ITI_LOCAL', type: 'varchar2', length: 50, nullable: true })
  ITI_LOCAL: string;

  @Column({ name: 'ITI_DTSAIDA', type: 'date', nullable: true })
  ITI_DTSAIDA: Date;

  @Column({ name: 'ITI_HSAIDA', type: 'varchar2', length: 10, nullable: true })
  ITI_HSAIDA: string;

  @Column({ name: 'ITI_KM', type: 'number', precision: 10, scale: 2, nullable: true })
  ITI_KM: number;

  @Column({ name: 'ITI_DTCHEGADA', type: 'date', nullable: true })
  ITI_DTCHEGADA: Date;
}
