import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('s009_motivodiaria')
export class MotivodiariaEntity {
  
  @PrimaryColumn({ name: 'MDI_ID_CODIGO', type: 'int' })
  MDI_ID_CODIGO: number;

  @PrimaryColumn({ name: 'ITE_ID_CODIGO', type: 'int' })
  ITE_ID_CODIGO: number;

  @PrimaryColumn({ name: 'RRE_ID_CODIGO', type: 'int' })
  RRE_ID_CODIGO: number;

  @PrimaryColumn({ name: 'DIR_ID_CODIGO', type: 'int' })
  DIR_ID_CODIGO: number;

  @Column({ name: 'REQ_ID_CODIGO', type: 'int', nullable: true })
  REQ_ID_CODIGO: number | null;

  @Column({ name: 'MDI_TIPO', type: 'varchar', length: 10, nullable: true })
  MDI_TIPO: string | null;

  @Column({ name: 'MDI_VALOR', type: 'decimal', precision: 10, scale: 2, nullable: true })
  MDI_VALOR: number | null;

  @Column({ name: 'MDI_CHEFE', type: 'char', length: 1, nullable: true })
  MDI_CHEFE: string | null;

  @Column({ name: 'MDI_GERENTE', type: 'char', length: 1, nullable: true })
  MDI_GERENTE: string | null;

  @Column({ name: 'MDI_DIRETOR', type: 'char', length: 1, nullable: true })
  MDI_DIRETOR: string | null;

  @Column({ name: 'MDI_DIREXECUTIVO', type: 'char', length: 1, nullable: true })
  MDI_DIREXECUTIVO: string | null;

  @Column({ name: 'MDI_DTAUTORIZA', type: 'date', nullable: true })
  MDI_DTAUTORIZA: Date | null;

  @Column({ name: 'MDI_JUSTIFICATIVA', type: 'varchar', length: 1000, nullable: true })
  MDI_JUSTIFICATIVA: string | null;
}
