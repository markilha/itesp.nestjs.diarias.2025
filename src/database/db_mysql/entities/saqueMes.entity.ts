

import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('v009_saqueefet_mes', { schema: 'dev_itesp_diarias' })
export class SaqueMesEntity {
  
  @PrimaryColumn({ name: 'CHAPA', type: 'varchar', length: 10 })
  CHAPA: string;

  @PrimaryColumn({ name: 'TDE_ID_CODIGO', type: 'int'})
  TDE_ID_CODIGO: number;

  @PrimaryColumn({ name: 'SQE_TIPOSAQUE', type: 'varchar' })
  SQE_TIPOSAQUE: string;

  @PrimaryColumn({ name: 'MESSAQUE', type: 'varchar' })
  messaque: string;

  @Column({ name: 'TotSaque', type: 'decimal', precision: 10, scale: 2 })
  TotSaque: number;
}

