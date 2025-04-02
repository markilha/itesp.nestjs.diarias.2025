import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('S009_UFERPSVALOR', { schema: 'FINANCEIRO' })
export class UfespEntity {

  constructor(
    partial: Partial<UfespEntity> | UfespEntity,
  ) {
    Object.assign(this, { ...partial });
  }

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
