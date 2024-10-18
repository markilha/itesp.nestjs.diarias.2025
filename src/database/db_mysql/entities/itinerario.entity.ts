import { Entity, Column, PrimaryColumn, OneToOne } from 'typeorm';


@Entity('s001_itinerario', { schema: 'dev_itesp_diarias' })
export class ItinerarioEntity {
  
  @PrimaryColumn({ name: 'ITI_ID_CODIGO', type: 'int' })
  ITI_ID_CODIGO: number;

  @PrimaryColumn({ name: 'REQ_ID_CODIGO', type: 'int' })
  REQ_ID_CODIGO: number;

  @Column({ name: 'ITI_HCHEGADA', type: 'varchar', length: 10, nullable: true })
  ITI_HCHEGADA: string;

  @Column({ name: 'MUN_ID_CODIGO', type: 'int', nullable: true })
  MUN_ID_CODIGO: number;

  @Column({ name: 'ITI_LOCAL', type: 'varchar', length: 50, nullable: true })
  ITI_LOCAL: string;

  @Column({ name: 'ITI_DTSAIDA', type: 'date', nullable: true })
  ITI_DTSAIDA: Date;

  @Column({ name: 'ITI_HSAIDA', type: 'varchar', length: 10, nullable: true })
  ITI_HSAIDA: string;

  @Column({ name: 'ITI_KM', type: 'decimal', precision: 10, scale: 2, nullable: true })
  ITI_KM: number;

  @Column({ name: 'ITI_DTCHEGADA', type: 'date', nullable: true })
  ITI_DTCHEGADA: Date;
}
