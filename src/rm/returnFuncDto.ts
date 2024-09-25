import { PFuncEntity } from 'src/database/db_oracle/entities/pfunc.entity';

export class returnFuncDto {
  CHAPA: string;
  NOME: string;
  CODSECAO: string;
  CODFUNCAO: string;
  JORNADA: number;
  SALARIO: number;
  DATAADMISSAO: Date;
  PISPARAFGTS: string;
  GRUPOSALARIAL: string;

  constructor(func: PFuncEntity) {
    this.CHAPA = func.CHAPA;
    this.NOME = func.NOME;
    this.CODSECAO = func.CODSECAO;
    this.CODFUNCAO = func.CODFUNCAO;
    this.JORNADA = func.JORNADA;
    this.SALARIO = func.SALARIO;
    this.DATAADMISSAO = func.DATAADMISSAO;
    this.PISPARAFGTS = func.PISPARAFGTS;
    this.GRUPOSALARIAL = func.GRUPOSALARIAL;
  }
}

export interface FuncParams{
    NOME: string;
    CHAPA: string;
    page: number;
    limit: number;
}
