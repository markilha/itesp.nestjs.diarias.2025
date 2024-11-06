import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('V009_EVENTOSDIARIAS', { schema: 'FINANCEIRO' })
export class EventosDiariasEntity {
  @PrimaryColumn({ name: 'CHAPA', type: 'varchar2', length: 50 })
  chapa: string;

  @Column({ name: 'TOTAL', type: 'number', precision: 10, scale: 2 })
  salario: number;
}
