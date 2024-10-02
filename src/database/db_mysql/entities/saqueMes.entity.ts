import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('v009_saquemes',{ schema: 'dev_itesp_diarias' })
export class SaqueMesEntity {
  @PrimaryColumn()
  ITE_ID_CODIGO: number;

  @PrimaryColumn()
  RRE_ID_CODIGO: number;

  @Column({ type: 'int', nullable: true })
  DIR_ID_CODIGO: number;

  @Column({ name:'CHAPA', type: 'varchar', length: 20 })
  chapa: string;

  @Column({ type: 'datetime', nullable: true })
  SQE_DTSAQUE: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  SQE_VLSAQUE: number;

  @Column({ type: 'datetime', nullable: true })
  SQE_DTPREST: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  SQE_VLPREST: number;

  @Column({ type: 'varchar', length: 10 })
  TDE_ID_CODIGO: string;

  @Column({ type: 'varchar', length: 1 })
  SQE_TIPOSAQUE: string;

  @Column({ type: 'varchar', length: 1 })
  SQE_EFETIVO: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  SQE_LOTE: string;

  @Column({ type: 'int', nullable: true })
  SQE_ANOLOTE: number;

  @Column({ type: 'varchar', length: 5, nullable: true })
  MesPed: string;

  @Column({ type: 'varchar', length: 5, nullable: true })
  MesSaque: string;

  @Column({ type: 'varchar', length: 5, nullable: true })
  MesPrest: string;
}
