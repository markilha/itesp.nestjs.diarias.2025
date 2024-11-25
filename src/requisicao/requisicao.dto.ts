import { ApiProperty } from '@nestjs/swagger';
import { RequisicaoEntity } from 'src/database/db_oracle/entities/requisicao.entity';

export class RequisicaoDto {
  reqIdCodigo?: number;
  regIdCodigo?: number;
  codMunicipio?: number;
  reqDtReq?: string;
  reqDtSaida?: string;
  reqMotorista?: string;
  reqHSaida?: string;
  reqDtRetorno?: string;
  reqMotivo?: string;
  reqHRetorno?: string;
  reqKm?: number;
  reqStatus?: string;
  reqDiaria?: number;
  reqIntegral?: number;
  reqParcial?: number;
  reqEspecial?: number;
  traIdCodigo?: number;
  nmeMunic?: string;
  regDescricao?: string;
  traDescricao?: string;
  chapa?: string;
  reqPacote?: number;
  reqGovernador?: string;
}

export class ReturnRequisicaoDto {
  @ApiProperty()
  reqIdCodigo: number;
  @ApiProperty({ required: false })
  chapa: string;
  @ApiProperty({ required: false })
  codMunicipio: number;
  @ApiProperty({ required: false })
  oriMunicipio: string;
  @ApiProperty({ required: false })
  reqDtReq: string;
  @ApiProperty({ required: false })
  reqDtSaida: string;
  @ApiProperty({ required: false })
  reqHSaida: string;
  @ApiProperty({ required: false })
  reqDtRetorno: string;
  @ApiProperty({ required: false })
  reqMotivo: string;
  @ApiProperty({ required: false })
  reqHRet: string;
  @ApiProperty({ required: false })
  reqKm: number;
  @ApiProperty({ required: false })
  reqStatus: string;
  @ApiProperty({ required: false })
  reqDiaria: number;
  @ApiProperty({ required: false })
  reqIntegral: number;
  @ApiProperty({ required: false })
  reqParcial: number;
  @ApiProperty({ required: false })
  reqEspecial: number;
  @ApiProperty({ required: false })
  reqPacote: string;
  @ApiProperty({ required: false })
  reqGovernador: string | null;
  @ApiProperty({ required: false })
  transmeio: number;
  @ApiProperty({ required: false })
  municipio: number;
  @ApiProperty({ required: false })
  desLocal?: string;
  @ApiProperty({ required: false })
  desMunIdCodigo: number;
  @ApiProperty({ required: false })
  desMunNme: string;
  @ApiProperty({ required: false })
  diariaIntegral: number;
  @ApiProperty({ required: false })
  diariaParcial: number;
  @ApiProperty({ required: false })
  diariaBase: number;
  @ApiProperty({ required: false })
  salario50Porcento: number;
  @ApiProperty({ required: false })
  saldoDisponivel: number;
  @ApiProperty({ required: false })
  meioTransporte: string;
  @ApiProperty({ required: false })
  regDescricao: string;
  @ApiProperty({ required: false })
  traDescricao: string;
  @ApiProperty({ required: false })
  saqueMes: number;
  @ApiProperty({ required: false })
  valorSolicitado: number;
  @ApiProperty({ required: false })
  diariaParcPorc: number;
  @ApiProperty({ required: false })
  vlDiaria: number;
  @ApiProperty({ required: false })
  usuMov: string;
  @ApiProperty({ required: false })
  ITI_DTSAIDA: Date | null;
  @ApiProperty({ required: false })
  ITI_HSAIDA: string | null;
  @ApiProperty({ required: false })
  ITI_DTCHEGADA: Date | null;
  @ApiProperty({ required: false })
  ITI_HCHEGADA: string | null;
  @ApiProperty({ required: false })
  diariaIntegralChegada: number;
  @ApiProperty({ required: false })
  diairaParcialChegada: number;

  constructor(params: any) {
    this.reqIdCodigo = params.reqIdCodigo;
    this.chapa = params.chapa;
    this.oriMunicipio = params.nmeMunic;
    this.reqDtReq = params.reqDtReq;
    this.reqDtSaida = params.reqDtSaida;
    this.reqHSaida = params.reqHSaida;
    this.reqDtRetorno = params.reqDtReq;
    this.reqMotivo = params.reqMotivo;
    this.reqHRet = params.reqHRet;
    this.reqKm = params.reqKm;
    this.reqStatus = params.reqStatus;
    this.reqIntegral = Number(params.reqIntegral) || 0;
    this.reqParcial = params.reqParcial > 0 ? 1 : 0;
    this.reqEspecial = Number(params.reqEspecial) || 0;
    this.reqPacote = params.reqPacote === 1 ? 'N' : 'S';
    this.reqGovernador = params.reqGovernador;
    this.desLocal = params.desLocal;
    this.desMunIdCodigo = params.desMunIdCodigo;
    this.desMunNme = params.desMunNme;
    this.diariaIntegral = params.diariaIntegral;
    this.diariaParcial = params.diariaParcial;
    this.diariaBase = params.diariaBase;
    this.saqueMes = params.saqueMes;
    this.valorSolicitado = params.valorSolicitado;
    this.salario50Porcento = params.salario50Porcento;
    this.saldoDisponivel = params.saldoDisponivel;
    this.regDescricao = params.regDescricao;
    this.traDescricao = params.traDescricao;
    this.diariaParcPorc = params.diariaParcPorc;
    this.vlDiaria = params.vlDiaria;
    this.ITI_DTSAIDA = params.ITI_DTSAIDA;
    this.ITI_HSAIDA = params.ITI_HSAIDA;
    this.ITI_DTCHEGADA = params.ITI_DTCHEGADA;
    this.ITI_HCHEGADA = params.ITI_HCHEGADA;
    this.diariaIntegralChegada = params.diariaIntegralChegada;
    this.diairaParcialChegada = params.diariaParcialChegada;
  }
}

export enum RequisicaoStatus {
  FINALIZADA = 'FINALIZADA',
  CANCELADA = 'CANCELADA',
}

export class FindAllParams {
  @ApiProperty()
  chapa: string;
  @ApiProperty({ required: false })
  reqIdCodigo: number;
  @ApiProperty({ required: false })
  codMunicipio: number;
  @ApiProperty({ required: false })
  reqStatus: RequisicaoStatus;
  @ApiProperty({ required: false })
  page?: number;
  @ApiProperty({ required: false })
  limit?: number;
  @ApiProperty({ required: false })
  orderBy?: string;
  @ApiProperty({ required: false })
  orderDirection?: 'ASC' | 'DESC';
}

export class FindAllAutorizadasParams {
  @ApiProperty({ required: false })
  chapa: string;
  @ApiProperty({ required: false })
  reqIdCodigo?: number;
  @ApiProperty({ required: false })
  page?: number;
  @ApiProperty({ required: false })
  limit?: number;
  @ApiProperty({ required: false })
  orderBy?: string;
  @ApiProperty({ required: false })
  orderDirection?: 'ASC' | 'DESC';
}
export class findMesParams {
  @ApiProperty()
  chapa: string;
  @ApiProperty({
    description: 'Data a ser considerada; caso não informada, será usada a data atual do sistema',
    required: false,
  })
  dataAtual?: Date;
}

export class RequisDto {
  @ApiProperty()
  chapa: string;
  @ApiProperty()
  reqIdCodigo?: number;
  @ApiProperty()
  reqStatus?: string;
  @ApiProperty()
  reqDtReq?: string;
  @ApiProperty()
  reqDtSaida?: Date;
  @ApiProperty({ required: false })
  periodoAprovacao?: string;
  constructor(requis?: Partial<RequisDto>) {
    this.chapa = requis?.chapa;
    this.reqIdCodigo = requis?.reqIdCodigo;
    this.reqStatus = requis?.reqStatus;
    this.reqDtReq = requis?.reqDtReq;
    this.reqDtSaida = requis?.reqDtSaida;
    this.periodoAprovacao = requis?.periodoAprovacao;

  }
}

export class requiPendente {
  @ApiProperty()
  CHAPA: string;
  @ApiProperty()
  SQE_ID_CODIGO: number;
  @ApiProperty()
  REQ_ID_CODIGO: number;
  @ApiProperty({ required: false })
  REQ_DTRET?: Date;
  @ApiProperty({ required: false })
  periodopendente?: string;

  constructor(params: any) {
    this.CHAPA = params.CHAPA;
    this.SQE_ID_CODIGO = params.SQE_ID_CODIGO;
    this.REQ_ID_CODIGO = params.REQ_ID_CODIGO;
    this.REQ_DTRET = params.REQ_DTRET;
    this.periodopendente = params.periodopendente;
  }
}

export class requiTotal {
  @ApiProperty({
    type: requiPendente   
  })
  data: requiPendente[];
  @ApiProperty()
  total: number;
}
