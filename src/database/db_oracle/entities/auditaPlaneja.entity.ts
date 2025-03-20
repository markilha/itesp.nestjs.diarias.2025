import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('S009_AUDITAPLANEJA', { schema: 'FINANCEIRO' })
export class auditaPlanejaEntity {
  @PrimaryGeneratedColumn({ name: 'AUD_ID_CODIGO' })
  AUD_ID_CODIGO?: number;

  @Column({ name: 'ITE_ID_CODIGO', type: 'number', nullable: true })
  ITE_ID_CODIGO: number;

  @Column({ name: 'RRE_ID_CODIGO', type: 'number', nullable: true })
  RRE_ID_CODIGO: number;

  @Column({ name: 'DIR_ID_CODIGO', type: 'number', nullable: true })
  DIR_ID_CODIGO: number;

  @Column({ name: 'AUD_NOME', type: 'varchar2', length: 255 })
  AUD_NOME: string;

  @Column({ name: 'AUD_AUTORIZA', type: 'varchar2', length: 1 })
  AUD_AUTORIZA: string;

  @Column({ name: 'AUD_DATA', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  AUD_DATA: Date;
}
