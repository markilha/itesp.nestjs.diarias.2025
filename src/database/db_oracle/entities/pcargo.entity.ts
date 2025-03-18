import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('PCARGO', { schema: 'RM' })
export class PcargoEntity {
  @PrimaryColumn({ type: 'number', name: 'CODCOLIGADA', precision: 5, scale: 0 })
  codColigada: number;

  @Column({ type: 'varchar2', name: 'CODIGO', length: 16, nullable: false })
  codigo: string;

  @Column({ type: 'varchar2', name: 'NOME', length: 40, nullable: true })
  nome: string;

  @Column({ type: 'number', name: 'JORNADATRABALHO', precision: 10, scale: 0, nullable: true })
  jornadaTrabalho: number;

  @Column({ type: 'varchar2', name: 'CODGRUPOOCUP', length: 10, nullable: true })
  codGrupoOcup: string;

  @Column({ type: 'long', name: 'DESCRICAO', nullable: true })
  descricao: string;

  @Column({ type: 'number', name: 'INATIVO', precision: 5, scale: 0, nullable: false, default: 0 })
  inativo: number;

  @Column({ type: 'number', name: 'BENEFPONTOS', precision: 10, scale: 0, nullable: true })
  benefPontos: number;

  @Column({ type: 'varchar2', name: 'RECCREATEDBY', length: 50, nullable: true })
  recCreatedBy: string;

  @Column({ type: 'date', name: 'RECCREATEDON', nullable: true })
  recCreatedOn: Date;

  @Column({ type: 'varchar2', name: 'RECMODIFIEDBY', length: 50, nullable: true })
  recModifiedBy: string;

  @Column({ type: 'date', name: 'RECMODIFIEDON', nullable: true })
  recModifiedOn: Date;

  @Column({ type: 'char', name: 'CODCLASSCARGO', length: 3, nullable: true })
  codClassCargo: string;

  @Column({ type: 'varchar2', name: 'SIGLA', length: 30, nullable: true })
  sigla: string;
}
