import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('S001_DESTINO',{schema:'TRANSPORTE'})
export class destinoEntity {
  @PrimaryGeneratedColumn({ name: 'DES_ID_CODIGO' })
  DES_ID_CODIGO: number;

  @Column({ name: 'REQ_ID_CODIGO', nullable: false, type: 'number' })
  REQ_ID_CODIGO: number;

  @Column({ name: 'MUN_ID_CODIGO', nullable: true, type: 'number' })
  MUN_ID_CODIGO?: number;

  @Column({ name: 'DES_LOCAL', nullable: true, type: 'varchar2'})
  DES_LOCAL?: string;

  @Column({ name: 'DES_OBSERVA', nullable: true, type: 'varchar2'})
  DES_OBSERVA?: string;
}
