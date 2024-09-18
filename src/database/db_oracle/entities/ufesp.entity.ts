import { Entity, PrimaryColumn, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('S009_UFERPSVALOR', { schema: 'FINANCEIRO' })
export class UferpsEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'UFE_ID_CODIGO' })
  ufeIdCodigo: number;

  @Column({ name: 'TDE_ID_CODIGO', type: 'number', nullable: true })
  tdeIdCodigo?: number;

  @Column({ name: 'UFE_VALOR', type: 'number', precision: 10, scale: 2, nullable: true })
  ufeValor?: number;

  @Column({ name: 'UFE_DTINICIO', type: 'date', nullable: true })
  ufeDtInicio?: Date;

  @Column({ name: 'UFE_DTFINAL', type: 'date', nullable: true })
  ufeDtFinal?: Date;
}
