import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('S009_PRAZOS', { schema: 'FINANCEIRO' })
export class PrazosEntity {
  @PrimaryGeneratedColumn({ name: 'PRA_ID_CODIGO', type: 'number' })
  PRA_ID_CODIGO: number;

  @Column({ name: 'PRA_PREVISAO', type: 'varchar2', length: 1, nullable: true })
  PRA_PREVISAO: string;

  @Column({ name: 'PRA_INICIO_RECURSO', type: 'date', nullable: true })
  PRA_INICIO_RECURSO: Date;

  @Column({ name: 'PRA_FIM_RECURSO', type: 'date', nullable: true })
  PRA_FIM_RECURSO: Date;

  @Column({ name: 'PRA_ATIVO', type: 'varchar2', length: 1, nullable: true })
  PRA_ATIVO: string;

  @Column({ name: 'PRA_INICIO_APLICA', type: 'date', nullable: true })
  PRA_INICIO_APLICA: Date;

  @Column({ name: 'PRA_FIM_APLICA', type: 'date', nullable: true })
  PRA_FIM_APLICA: Date;

  @Column({ name: 'REG_ID_CODIGO', type: 'number', nullable: true })
  REG_ID_CODIGO: number;

  @Column({ name: 'ORR_ID_CODIGO', type: 'number', nullable: true })
  ORR_ID_CODIGO: number;

  constructor(prazos?: Partial<PrazosEntity>) {
    this.PRA_ID_CODIGO = prazos?.PRA_ID_CODIGO;
    this.PRA_PREVISAO = prazos?.PRA_PREVISAO;
    this.PRA_INICIO_RECURSO = prazos?.PRA_INICIO_RECURSO;
    this.PRA_FIM_RECURSO = prazos?.PRA_FIM_RECURSO;
    this.PRA_ATIVO = prazos?.PRA_ATIVO;
    this.PRA_INICIO_APLICA = prazos?.PRA_INICIO_APLICA;
    this.PRA_FIM_APLICA = prazos?.PRA_FIM_APLICA;
    this.REG_ID_CODIGO = prazos?.REG_ID_CODIGO;
    this.ORR_ID_CODIGO = prazos?.ORR_ID_CODIGO;
  }
}
