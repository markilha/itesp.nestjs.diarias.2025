
import { PfuncaoEntity } from 'src/database/db_oracle/entities/pfuncao.entity';


export class returnPfuncaDto {
  CODIGO: string;
  NOME: string;
  CBO: string;
  CARGO: string;
  FAIXASALARIAL: string;
  CBO2002: string;
  CODFUNCAOCHEFIA: string;
  NIVEL: string;

  constructor(pfuncao: PfuncaoEntity, nivel: string) {
    this.CODIGO = pfuncao.CODIGO;
    this.NOME = pfuncao.NOME;
    this.CBO = pfuncao.CBO;
    this.CARGO = pfuncao.CARGO;
    this.FAIXASALARIAL = pfuncao.FAIXASALARIAL;
    this.CBO2002 = pfuncao.CBO2002;
    this.CODFUNCAOCHEFIA = pfuncao.CODFUNCAOCHEFIA;
    this.NIVEL = nivel; // Recebe o nível como parâmetro e define aqui
  }
}
