import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { PFuncEntity } from './pfunc.entity';

@Entity('ppessoa', { schema: 'dev_itesp_diarias' })
export class PPessoaEntity {
  @PrimaryColumn({ type: 'int', name: 'CODIGO' })
  codigo: number;

  @Column({ type: 'varchar', length: 20, name: 'CODUSUARIO', nullable: true })
  codusuario: string;

  @Column({ type: 'varchar', length: 120, name: 'NOME', nullable: true })
  nome: string;

  @Column({ type: 'varchar', length: 40, name: 'APELIDO', nullable: true })
  apelido: string;

  @Column({ type: 'date', name: 'DTNASCIMENTO', nullable: true })
  dtnascimento: Date;

  @Column({ type: 'varchar', length: 1, name: 'ESTADOCIVIL', nullable: true })
  estadocivil: string;

  @Column({ type: 'varchar', length: 1, name: 'SEXO', nullable: true })
  sexo: string;

  @Column({ type: 'varchar', length: 3, name: 'NACIONALIDADE', nullable: true })
  nacionalidade: string;

  @Column({ type: 'varchar', length: 3, name: 'GRAUINSTRUCAO', nullable: true })
  grauinstrucao: string;

  @Column({ type: 'varchar', length: 140, name: 'RUA', nullable: true })
  rua: string;

  @Column({ type: 'varchar', length: 8, name: 'NUMERO', nullable: true })
  numero: string;

  @Column({ type: 'varchar', length: 60, name: 'COMPLEMENTO', nullable: true })
  complemento: string;

  @Column({ type: 'varchar', length: 80, name: 'BAIRRO', nullable: true })
  bairro: string;

  @Column({ type: 'varchar', length: 2, name: 'ESTADO', nullable: true })
  estado: string;

  @Column({ type: 'varchar', length: 32, name: 'CIDADE', nullable: true })
  cidade: string;

  @Column({ type: 'varchar', length: 9, name: 'CEP', nullable: true })
  cep: string;

  @Column({ type: 'varchar', length: 60, name: 'PAIS', nullable: true })
  pais: string;

  @Column({ type: 'varchar', length: 15, name: 'REGPROFISSIONAL', nullable: true })
  regprofissional: string;

  @Column({ type: 'varchar', length: 11, name: 'CPF', nullable: true })
  cpf: string;

  @Column({ type: 'varchar', length: 15, name: 'CARTIDENTIDADE', nullable: true })
  cartidentidade: string;

  @Column({ type: 'varchar', length: 2, name: 'UFCARTIDENT', nullable: true })
  ufcartident: string;

  @Column({ type: 'varchar', length: 15, name: 'ORGEMISSORIDENT', nullable: true })
  orgemissorident: string;

  @Column({ type: 'int', name: 'NATURALIZADO', nullable: true })
  naturalizado: number;

  @Column({ type: 'date', name: 'DTEMISSAOIDENT', nullable: true })
  dtemissaoident: Date;

  @Column({ type: 'varchar', length: 32, name: 'NATURALIDADE', nullable: true })
  naturalidade: string;

  @Column({ type: 'varchar', length: 2, name: 'ESTADONATAL', nullable: true })
  estadonatal: string;

  @Column({ type: 'date', name: 'DATACHEGADA', nullable: true })
  datachegada: Date;

  @Column({ type: 'varchar', length: 60, name: 'EMAIL', nullable: true })
  email: string;

  @Column({ type: 'varchar', length: 60, name: 'EMAILPESSOAL', nullable: true })
  EMAILPESSOAL: string;

  @Column({ type: 'varchar', length: 15, name: 'TELEFONE1', nullable: true })
  telefone1: string;

  @Column({ type: 'varchar', length: 15, name: 'TELEFONE2', nullable: true })
  telefone2: string;

  @Column({ type: 'varchar', length: 15, name: 'TELEFONE3', nullable: true })
  telefone3: string;

  @Column({ type: 'varchar', length: 60, name: 'EMPRESA', nullable: true })
  empresa: string;

  @Column({ type: 'int', name: 'CODPROFISSAO', nullable: true })
  codprofissao: number;

  @Column({ type: 'varchar', length: 3, name: 'CODOCUPACAO', nullable: true })
  codocupacao: string;

  @Column({ type: 'varchar', length: 3, name: 'ANO1EMPREGO', nullable: true })
  ANO1EMPREGO: number;

  @OneToOne(() => PFuncEntity, (pfunc) => pfunc.pessoa)
  @JoinColumn({ name: 'CODUSUARIO', referencedColumnName: 'CHAPA' })
  pfunc?: PFuncEntity;
}
