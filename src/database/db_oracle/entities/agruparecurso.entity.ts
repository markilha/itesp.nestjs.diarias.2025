import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('S009_AGRUPARECURSO',{ schema: 'FINANCEIRO' }) 
export class agruparecursoEntity {
  @PrimaryGeneratedColumn({ name: 'AGS_ID_CODIGO' })
  AGS_ID_CODIGO: number;

  @Column({ name: 'DIR_ID_CODIGO', type: 'number', nullable: false })
  DIR_ID_CODIGO: number;

  @Column({ name: 'TDE_ID_CODIGO', type: 'number', nullable: true })
  TDE_ID_CODIGO?: number;

  @Column({ name: 'STS_ID_CODIGO', type: 'number', nullable: true })
  STS_ID_CODIGO?: number;

  @Column({ name: 'AGS_VALOR_SOLIC', type: 'number', precision: 10, scale: 2, nullable: true })
  AGS_VALOR_SOLIC?: number;

  @Column({ name: 'AGS_VALOR_CONC', type: 'number', precision: 10, scale: 2, nullable: true })
  AGS_VALOR_CONC?: number;

  @Column({ name: 'AGS_VALOR_PREST', type: 'number', precision: 10, scale: 2, nullable: true })
  AGS_VALOR_PREST?: number;

  @Column({ name: 'AGS_OBSERVA', type: 'varchar2', length: 1000, nullable: true })
  AGS_OBSERVA?: string;

  @Column({ name: 'AGS_RECURSO', type: 'char', length: 1, nullable: true })
  AGS_RECURSO?: string;
}
