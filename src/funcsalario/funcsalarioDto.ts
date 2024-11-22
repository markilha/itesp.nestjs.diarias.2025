import { ApiProperty } from "@nestjs/swagger";

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

export class FindParamsDadosPagamentoDto {
  @ApiProperty({required: false})
    chapa: string;
    @ApiProperty({required: false})
    dataAtual: string;
}



export class returnFunPagDto {
  @ApiProperty()
  CHAPA: string;
  @ApiProperty()
  CODBANCOPAGTO: string;
  @ApiProperty()
  CODAGENCIAPAGTO: string;
  @ApiProperty()
  CONTAPAGAMENTO: string;
  @ApiProperty()
  SALARIO: number; 
  @ApiProperty()
  SALARIO_50: number;
  @ApiProperty()
  SAQUE_MES: number;
  @ApiProperty()
  SALDO_DISPONIVEL: number;
  @ApiProperty()
  TOTAL_DEVOLUCAO: number;
  @ApiProperty()
  TOTAL_TRANSFERENCIA: number;
  constructor(item?: returnFunPagDto) {
    this.CHAPA = item?.CHAPA;
    this.CODBANCOPAGTO = item?.CODBANCOPAGTO;
    this.CODAGENCIAPAGTO = item?.CODAGENCIAPAGTO;
    this.CONTAPAGAMENTO = item?.CONTAPAGAMENTO;
    this.SALARIO = item?.SALARIO;  
    this.SALARIO_50 = item?.SALARIO_50;
    this.SAQUE_MES = item?.SAQUE_MES;
    this.SALDO_DISPONIVEL = item?.SALDO_DISPONIVEL;
    this.TOTAL_DEVOLUCAO = item?.TOTAL_DEVOLUCAO;
    this.TOTAL_TRANSFERENCIA = item?.TOTAL_TRANSFERENCIA;
  }
}
export class FindPagamento {
  @ApiProperty()
  chapa: string;
  
}
  