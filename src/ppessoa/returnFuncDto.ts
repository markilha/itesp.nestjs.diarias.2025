import { PFuncEntity } from 'src/database/db_mysql/entities/pfunc.entity';

export class returnFuncDto {
  NOME: string;
  DTNASCIMENTO: Date;
  CHAPA: string;
  CODSECAO: string;
  CODFUNCAO: string;
  JORNADA: number;
  SALARIO: number;
  DATAADMISSAO: Date;
  PISPARAFGTS: string;
  GRUPOSALARIAL: string;

  constructor(func: Partial<PFuncEntity>) {
    this.NOME = func.NOME;
    this.DTNASCIMENTO = func.DTNASCIMENTO;
    this.CHAPA = func.CHAPA;
    this.CODSECAO = func.CODSECAO;
    this.CODFUNCAO = func.CODFUNCAO;
    this.JORNADA = func.JORNADA;
    this.SALARIO = func.SALARIO;
    this.DATAADMISSAO = func.DATAADMISSAO;
    this.PISPARAFGTS = func.PISPARAFGTS;
    this.GRUPOSALARIAL = func.GRUPOSALARIAL;
  }
}

export interface FuncParams {
  NOME: string;
  CHAPA: string;
  page: number;
  limit: number;
}
