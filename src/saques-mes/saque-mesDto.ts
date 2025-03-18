import { ApiProperty } from '@nestjs/swagger';

export class SaqueMesDto {
  @ApiProperty()
  nome: string;
  @ApiProperty()
  CHAPA: string;
  @ApiProperty()
  descricao: string;
  @ApiProperty()
  funcao: string;
  @ApiProperty()
  totSaqueEstCanc: number;
  @ApiProperty()
  totsaque: number;
  @ApiProperty()
  totalrealmes: number;
  @ApiProperty()
  mesdev: string;
  @ApiProperty()
  salario: number;
  @ApiProperty()
  metadesalario: number;
  @ApiProperty()
  codbancopagto: number;
  @ApiProperty()
  codagenciapagto: number;
  @ApiProperty()
  contapagamento: number;
  @ApiProperty()
  vldevolucao: number;
  @ApiProperty()
  messaque: string;
  @ApiProperty()
  totSaque: number;

  constructor(entity: Partial<SaqueMesDto>) {
    this.CHAPA = entity.CHAPA;
    this.nome = entity.nome;
    this.descricao = entity.descricao;
    this.funcao = entity.funcao;
    this.totSaqueEstCanc = entity.totSaqueEstCanc;
    this.mesdev = entity.mesdev;
    this.salario = entity.salario;
    this.metadesalario = entity.metadesalario;
    this.codbancopagto = entity.codbancopagto;
    this.codagenciapagto = entity.codagenciapagto;
    this.contapagamento = entity.contapagamento;
    this.messaque = entity.messaque;
    this.vldevolucao = entity.vldevolucao;
    this.totSaque = entity.totSaque;
    this.totalrealmes = entity.totalrealmes;
  }
}

export class infoPagamentoDto {
  @ApiProperty()
  totSaqueEstCanc: number;
  @ApiProperty()
  totalrealmes: number;
  @ApiProperty()
  salario: number;
  @ApiProperty()
  metadesalario: number;
  @ApiProperty()
  saldodisponivel: number;
  @ApiProperty()
  codbancopagto: number;
  @ApiProperty()
  codagenciapagto: number;
  @ApiProperty()
  contapagamento: number;
  @ApiProperty()
  vldevolucao: number;
  @ApiProperty()
  totalaguardando: number;

  constructor(entity: Partial<infoPagamentoDto>) {
    this.codagenciapagto = entity.codagenciapagto;
    this.codbancopagto = entity.codbancopagto;
    this.contapagamento = entity.contapagamento;
    this.salario = entity.salario;
    this.metadesalario = entity.metadesalario;
    this.totalrealmes = entity.totalrealmes;
    this.vldevolucao = entity.vldevolucao;
    this.totalaguardando = entity.totalaguardando;
    this.saldodisponivel = entity.saldodisponivel;
  }
}

export class returnDevolucaoDto {
  CHAPA: string;
  TDE_ID_CODIGO: number;
  MESDEV: string;
  VLDEVOLUCAO: number;
}

export class returnTransferenciaDto {
  @ApiProperty()
  MESPED: string;
  @ApiProperty()
  CHAPA: string;
  @ApiProperty()
  VLTOTAL: number;
}

// SaqueEfetMes.dto.ts
export class SaqueEfetMesDto {
  CHAPA: string; // Chapa do funcionário
  NOME: string; // Nome do funcionário
  DESCRICAO: string; // Descrição da seção
  FUNCAO: string; // Função do funcionário
  MESSAQUE: string; // Mês do saque
  totSaque: number; // Total de saques
  totSaqueEstCanc: number; // Total de saques cancelados
  mesDev: string; // Mês de devolução
  vlDevolucao: number; // Valor da devolução
  salario: number; // Salário do funcionário
}

export class FindAllParams {
  @ApiProperty({ required: false })
  chapa?: string;
  @ApiProperty({ required: false })
  messaque?: string;
  @ApiProperty({ required: false })
  page?: number;
  @ApiProperty({ required: false })
  limit?: number;
  @ApiProperty({ required: false })
  orderBy?: string;
  @ApiProperty({ required: false })
  orderDirection?: string;
}

export class FindPgParams {
  @ApiProperty({ required: false })
  chapa?: string;
  @ApiProperty({ required: false })
  dataAtual?: string;
}
export class FindParamsExtrato {
  @ApiProperty({ required: false })
  chapa?: string;
  @ApiProperty({ required: false })
  dataInicio?: string;
  @ApiProperty({ required: false })
  dataFim?: string;
  @ApiProperty({ required: false })
  page?: number;
  @ApiProperty({ required: false })
  limit?: number;
}

// export class returnaTotal {
//   @ApiProperty({
//     description: 'Array de objetos do tipo returnSaqueDto',
//     type: [returnSaqueDto],
//   })
//   data: returnSaqueDto[];

//   @ApiProperty({
//     description: 'Valor total calculado',
//     type: Number,
//     example: 0,
//   })
//   total: number;
// }

export class ExtratoDto {
  @ApiProperty()
  ITE_ID_CODIGO: number;
  @ApiProperty()
  DT_CONCEDIDO: string;
  @ApiProperty()
  SQE_MES: number;
  @ApiProperty()
  VL_CONCEDIDO: number;
  @ApiProperty()
  VL_PRESTADO: number;
  @ApiProperty()
  VL_COMPREMENTO: number;
  @ApiProperty()
  VL_DEVOLUCAO: number;
  @ApiProperty()
  SQE_RESTANTE?: number;
  @ApiProperty()
  SQE_EFET_MES: number;

  constructor(item: any) {
    this.ITE_ID_CODIGO = item.ITE_ID_CODIGO;
    this.DT_CONCEDIDO = item.DT_CONCEDIDO;
    this.SQE_MES = item.SQE_MES;
    this.VL_CONCEDIDO = item.VL_CONCEDIDO;
    this.VL_PRESTADO = item.VL_PRESTADO;
    this.VL_COMPREMENTO = item.VL_COMPREMENTO;
    this.VL_DEVOLUCAO = item.VL_DEVOLUCAO;
    this.SQE_RESTANTE = item.SQE_RESTANTE;
    this.SQE_EFET_MES = item.SQE_EFET_MES;
  }
}

export class ReturnExtrato {
  @ApiProperty({
    type: [ExtratoDto],
  })
  data: ExtratoDto[];
  @ApiProperty()
  total: number;
}
