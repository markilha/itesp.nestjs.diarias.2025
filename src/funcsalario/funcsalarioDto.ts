export class FuncSalarioDto {
    chapa: string;
    codsecao: string;
    nome: string;
    funcao: string;
    codfuncao: string;
    cargo: string;
    salario: number;
    setor: string;
    regIdCodigo: string;
    regDescricao: string;
  }


  
export interface FindAllParams {
    chapa: string;
    nome: string;
    regIdCodigo: string;
    regDescricao: string;
    page: number;
    limit: number;
}
  