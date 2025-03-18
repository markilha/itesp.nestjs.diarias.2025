import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('V009_SAQUEEFET_MES', { schema: 'FINANCEIRO' })
export class SaqueMesEntity {
  @PrimaryColumn({ name: 'CHAPA', type: 'varchar2', length: 16 })
  CHAPA: string;

  @PrimaryColumn({ name: 'TDE_ID_CODIGO', type: 'number' })
  TDE_ID_CODIGO: number;

  @PrimaryColumn({ name: 'SQE_TIPOSAQUE', type: 'char', length: 1 })
  SQE_TIPOSAQUE: string;

  @PrimaryColumn({ name: 'MESSAQUE', type: 'varchar2', length: 5 })
  MESSAQUE: string;

  @Column({ name: 'TOTSAQUE', type: 'number' })
  TOTSAQUE: number;
}
