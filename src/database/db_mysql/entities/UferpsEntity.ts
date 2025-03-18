import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('s009_uferpsvalor', { schema: 'dev_itesp_diarias' })
export class UferpsEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'UFE_ID_CODIGO' })
  ufeIdCodigo: number;

  @Column({ name: 'TDE_ID_CODIGO', type: 'int', nullable: true })
  tdeIdCodigo?: number;

  @Column({ name: 'UFE_VALOR', type: 'int', precision: 10, scale: 2, nullable: true })
  ufeValor?: number;

  @Column({ name: 'UFE_DTINICIO', type: 'date', nullable: true })
  ufeDtInicio?: Date;

  @Column({ name: 'UFE_DTFINAL', type: 'date', nullable: true })
  ufeDtFinal?: Date;
}
