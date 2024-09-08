import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { UsuReqEntity } from './usureq.entity';
import { PFuncEntity } from './pfunc.entity';

@Entity('PPESSOA', { schema: 'RM' })
export class PPessoaEntity {
  @PrimaryColumn({ type: 'number', name: 'CODIGO' })
  codigo: number;

  @Column({ type: 'varchar2', length: 20, name: 'CODUSUARIO', nullable: true })
  codusuario: string;

  @Column({ type: 'varchar2', length: 120, name: 'NOME', nullable: true })
  nome: string;

  @Column({ type: 'varchar2', length: 40, name: 'APELIDO', nullable: true })
  apelido: string;

  @Column({ type: 'date', name: 'DTNASCIMENTO', nullable: true })
  dtnascimento: Date;

  @Column({ type: 'varchar2', length: 1, name: 'ESTADOCIVIL', nullable: true })
  estadocivil: string;

  @Column({ type: 'varchar2', length: 1, name: 'SEXO', nullable: true })
  sexo: string;

  @Column({ type: 'varchar2', length: 3, name: 'NACIONALIDADE', nullable: true })
  nacionalidade: string;

  @Column({ type: 'varchar2', length: 3, name: 'GRAUINSTRUCAO', nullable: true })
  grauinstrucao: string;

  @Column({ type: 'varchar2', length: 140, name: 'RUA', nullable: true })
  rua: string;

  @Column({ type: 'varchar2', length: 8, name: 'NUMERO', nullable: true })
  numero: string;

  @Column({ type: 'varchar2', length: 60, name: 'COMPLEMENTO', nullable: true })
  complemento: string;

  @Column({ type: 'varchar2', length: 80, name: 'BAIRRO', nullable: true })
  bairro: string;

  @Column({ type: 'varchar2', length: 2, name: 'ESTADO', nullable: true })
  estado: string;

  @Column({ type: 'varchar2', length: 32, name: 'CIDADE', nullable: true })
  cidade: string;

  @Column({ type: 'varchar2', length: 9, name: 'CEP', nullable: true })
  cep: string;

  @Column({ type: 'varchar2', length: 60, name: 'PAIS', nullable: true })
  pais: string;

  @Column({ type: 'varchar2', length: 15, name: 'REGPROFISSIONAL', nullable: true })
  regprofissional: string;

  @Column({ type: 'varchar2', length: 11, name: 'CPF', nullable: true })
  cpf: string;

  @Column({ type: 'varchar2', length: 15, name: 'CARTIDENTIDADE', nullable: true })
  cartidentidade: string;

  @Column({ type: 'varchar2', length: 2, name: 'UFCARTIDENT', nullable: true })
  ufcartident: string;

  @Column({ type: 'varchar2', length: 15, name: 'ORGEMISSORIDENT', nullable: true })
  orgemissorident: string;

  @Column({ type: 'number', name: 'NATURALIZADO', nullable: true })
  naturalizado: number;

  @Column({ type: 'date', name: 'DTEMISSAOIDENT', nullable: true })
  dtemissaoident: Date;

  @Column({ type: 'varchar2', length: 32, name: 'NATURALIDADE', nullable: true })
  naturalidade: string;

  @Column({ type: 'varchar2', length: 2, name: 'ESTADONATAL', nullable: true })
  estadonatal: string;

  @Column({ type: 'date', name: 'DATACHEGADA', nullable: true })
  datachegada: Date;

  @Column({ type: 'varchar2', length: 60, name: 'EMAIL', nullable: true })
  email: string;

  @Column({ type: 'varchar2', length: 60, name: 'EMAILPESSOAL', nullable: true })
  EMAILPESSOAL: string;

  @Column({ type: 'varchar2', length: 15, name: 'TELEFONE1', nullable: true })
  telefone1: string;

  @Column({ type: 'varchar2', length: 15, name: 'TELEFONE2', nullable: true })
  telefone2: string;
  
  @Column({ type: 'varchar2', length: 15, name: 'TELEFONE3', nullable: true })
  telefone3: string;

  @Column({ type: 'varchar2', length: 60, name: 'EMPRESA', nullable: true })
  empresa: string;

  @Column({ type: 'number', name: 'CODPROFISSAO', nullable: true })
  codprofissao: number;

  @Column({ type: 'varchar2', length: 3, name: 'CODOCUPACAO', nullable: true })
  codocupacao: string;

  @Column({ type: 'varchar2', length: 3, name: 'ANO1EMPREGO', nullable: true })
  ANO1EMPREGO: number;

  @OneToOne(() => UsuReqEntity, (pessoa) => pessoa.pessoa)
  usereq?: UsuReqEntity;

  @OneToOne(() => PFuncEntity, (pfunc) => pfunc.pessoa)
  @JoinColumn({ name: 'CODUSUARIO', referencedColumnName: 'CHAPA' })
  pfunc?: PFuncEntity;

 


    // @Column({ type: 'number', name: 'IDIMAGEM', nullable: true })
  // idimagem: number;

  // @Column({ type: 'varchar2', length: 14, name: 'TITULOELEITOR', nullable: true })
  // tituloeleitor: string;

  // @Column({ type: 'varchar2', length: 6, name: 'ZONATITELEITOR', nullable: true })
  // zonatiteleitor: string;

  // @Column({ type: 'varchar2', length: 6, name: 'SECAOTITELEITOR', nullable: true })
  // secaotiteleitor: string;

  // @Column({ type: 'varchar2', length: 10, name: 'CARTEIRATRAB', nullable: true })
  // carteiratrab: string;

  // @Column({ type: 'varchar2', length: 5, name: 'SERIECARTTRAB', nullable: true })
  // seriecarttrab: string;

  // @Column({ type: 'varchar2', length: 2, name: 'UFCARTTRAB', nullable: true })
  // ufcarttrab: string;

  // @Column({ type: 'date', name: 'DTCARTTRAB', nullable: true })
  // dtcarttrab: Date;

  // @Column({ type: 'number', name: 'NIT', nullable: true })
  // nit: number;

  // @Column({ type: 'varchar2', length: 15, name: 'CARTMOTORISTA', nullable: true })
  // cartmotorista: string;

  // @Column({ type: 'varchar2', length: 5, name: 'TIPOCARTHABILIT', nullable: true })
  // tipocarthabilit: string;

  // @Column({ type: 'date', name: 'DTVENCHABILIT', nullable: true })
  // dtvenchabilit: Date;

  // @Column({ type: 'varchar2', length: 40, name: 'CERTIFRESERV', nullable: true })
  // certifreserv: string;

  // @Column({ type: 'varchar2', length: 10, name: 'CATEGMILITAR', nullable: true })
  // categmilitar: string;



  // @Column({ type: 'varchar2', length: 15, name: 'CARTMODELO19', nullable: true })
  // cartmodelo19: string;

  // @Column({ type: 'number', name: 'CONJUGEBRASIL', nullable: true })
  // conjuguebrasil: number;


  // @Column({ type: 'number', name: 'FILHOSBRASIL', nullable: true })
  // filhosbrasil: number;

  // @Column({ type: 'number', name: 'NROFILHOSBRASIL', nullable: true })
  // nrofilhosbrasil: number;

  // @Column({ type: 'varchar2', length: 15, name: 'NROREGGERAL', nullable: true })
  // nroreggeral: string;

  // @Column({ type: 'varchar2', length: 15, name: 'NRODECRETO', nullable: true })
  // nrodecreto: string;

  // @Column({ type: 'date', name: 'DTVENCIDENT', nullable: true })
  // dtvencident: Date;

  // @Column({ type: 'date', name: 'DTVENCCARTTRAB', nullable: true })
  // dtvenccarttrab: Date;

  // @Column({ type: 'varchar2', length: 10, name: 'TIPOVISTO', nullable: true })
  // tipovisto: string;


  // @Column({ type: 'number', precision: 15, scale: 2, name: 'INVESTTREINANT', nullable: true })
  // investtreinant: number;

  // @Column({ type: 'number', name: 'CORRACA', nullable: true })
  // corraca: number;

  // @Column({ type: 'number', name: 'DEFICIENTEFISICO', nullable: true, default: 0 })
  // deficientefisico: number;




  // @Column({ type: 'varchar2', length: 15, name: 'FAX', nullable: true })
  // fax: string;

  



  // @Column({ type: 'number', name: 'DEFVISUAL', nullable: true })
  // defvisual: number;

  // @Column({ type: 'number', name: 'DEFAUDITIVO', nullable: true })
  // defauditivo: number;

  // @Column({ type: 'number', name: 'DEFMENTAL', nullable: true })
  // defmental: number;

  // @Column({ type: 'number', name: 'DEFREABILITADO', nullable: true })
  // defreabilitado: number;

  // @Column({ type: 'number', name: 'FUNCIONARIOPR', nullable: true })
  // funcionariopr: number;

  // @Column({ type: 'number', name: 'FUNCIONARIOPUB', nullable: true })
  // funcionariopub: number;

  // @Column({ type: 'number', name: 'DEFINTELECTUAL', nullable: true })
  // defintelectual: number;
}
