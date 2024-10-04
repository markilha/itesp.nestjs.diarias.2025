

import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('v009_saqueefet_mes', { schema: 'dev_itesp_diarias' })
export class SaqueMesEntity {
  
  @PrimaryColumn({ name: 'CHAPA', type: 'varchar', length: 10 })
  chapa: string;

  @PrimaryColumn({ name: 'TDE_ID_CODIGO', type: 'int'})
  tdeidcodigo: number;

  @PrimaryColumn({ name: 'SQE_TIPOSAQUE', type: 'varchar' })
  sqetiposaque: string;

  @PrimaryColumn({ name: 'MESSAQUE', type: 'varchar' })
  messaque: string;

  @Column({ name: 'TotSaque', type: 'decimal', precision: 10, scale: 2 })
  totsaque: number;
}

