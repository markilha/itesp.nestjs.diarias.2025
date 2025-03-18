import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('pcargo', { schema: 'dev_itesp_diarias' })
export class PcargoEntity {
  @PrimaryColumn({ type: 'varchar', name: 'CODIGO' })
  codigo: string;

  @Column({ name: 'NOME', type: 'varchar' })
  nome: string;

  @Column({ name: 'UFESP', type: 'int', nullable: true })
  ufesp?: number;
}
