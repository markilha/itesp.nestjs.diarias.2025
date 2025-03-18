import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'PFUNCAO', schema: 'RM' })
export class PfuncaoEntity {
  @PrimaryColumn({ type: 'varchar2', name: 'CODIGO' })
  CODIGO: string;

  @Column({ type: 'varchar2', length: 100, nullable: true })
  NOME: string;

  @Column({ type: 'varchar2', length: 8, nullable: true })
  CBO: string;

  @Column({ type: 'varchar2', length: 16, nullable: true })
  CARGO: string;

  @Column({ type: 'varchar2', length: 16, nullable: true })
  FAIXASALARIAL: string;

  @Column({ type: 'varchar2', length: 10, nullable: true })
  CBO2002: string;

  @Column({ type: 'varchar2', length: 10, nullable: true })
  CODFUNCAOCHEFIA: string;

  @Column({ type: 'varchar2', nullable: true })
  DESCRICAO: string;
}
