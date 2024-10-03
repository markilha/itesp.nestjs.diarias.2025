import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('v009_eventosdiarias2', { schema: 'dev_itesp_diarias' })

export class EventosDiariasEntity {
  @PrimaryColumn({ name: 'CHAPA', type: 'varchar', length: 50 })
  chapa: string;

  @Column({ name: 'TOTAL', type: 'decimal', precision: 10, scale: 2 })
  salario: number;
}
