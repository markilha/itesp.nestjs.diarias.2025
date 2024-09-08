import { Entity, Column, PrimaryColumn, Double, OneToOne } from 'typeorm';
import { PPessoaEntity } from './ppessoa.entity';

@Entity('PFUNC', { schema: 'RM' })
export class PFuncEntity {
  @Column({ type: 'varchar2', length: 120, name: 'NOME', nullable: true })
  NOME: string;

  @PrimaryColumn({ type: 'varchar2', length: 120, name: 'CHAPA' })
  CHAPA: string;
 

  @Column({ type: 'varchar2', length: 120, name: 'CODSECAO', nullable: true })
  CODSECAO: string;

  @Column({ type: 'varchar2', length: 120, name: 'CODFUNCAO', nullable: true })
  CODFUNCAO: string;

  @Column({ type: 'number',  name: 'JORNADA', nullable: true })
  JORNADA: number;

  @Column({ type: 'double precision', name: 'SALARIO', nullable: true })
  SALARIO: number;
  
  @Column({ type: 'date', name: 'DATAADMISSAO', nullable: true })
  DATAADMISSAO: Date;

  @Column({ type: 'varchar2', length: 120, name: 'PISPARAFGTS', nullable: true })
  PISPARAFGTS: string;

  @Column({ type: 'varchar2', length: 120, name: 'GRUPOSALARIAL', nullable: true })
  GRUPOSALARIAL: string;

  @OneToOne(() => PPessoaEntity, (ppessoa) => ppessoa.pfunc)  
  pessoa?: PPessoaEntity;
}
