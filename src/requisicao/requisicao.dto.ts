
import { RequisicaoEntity } from 'src/database/db_mysql/entities/requisicao.entity';

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
  reqIdCodigo: number;
  chapa: string;
  codMunicipio: number;
  oriMunicipio: string; 
  reqDtReq: string; 
  reqDtSaida: string;
  reqHSaida: string; 
  reqDtRetorno: string; 
  reqMotivo: string; 
  reqHRet: string;
  reqKm: number; 
  reqStatus: string; 
  reqDiaria: number; 
  reqIntegral: number; 
  reqParcial: number; 
  reqEspecial: number; 
  reqPacote: number; 
  reqGovernador: string | null; 
  transmeio: number; 
  municipio: number;
  desLocal?: string; 
  desMunIdCodigo: number; 
  desMunNme: string; 
  diariaIntegral: number;
  diariaParcial: number;
  diariaBase: number; 
  salario50Porcento: number;
  saldoDisponivel: number;
  meioTransporte: string;
  regDescricao: string;
  traDescricao: string;
  saqueMes: number;
  valorSolicitado: number;
  usuMov: string; 
    constructor(
    userReqEntity: RequisicaoEntity,   
    diariaIntegral?: number,
    diariaParcial?: number,    
    diariaBase?: number,
    saqueMes?: number,
    valorSolicitado?: number,
    salario50Porcento?: number,
    saldoDisponivel?: number, 
   
   
  ) {
    this.reqIdCodigo = userReqEntity.reqIdCodigo;   
    this.chapa = userReqEntity.chapa;
    this.municipio = userReqEntity.codMunicipio;
    this.oriMunicipio = userReqEntity.nmeMunic;     
    this.reqDtReq = userReqEntity.reqDtReq;
    this.reqDtSaida = userReqEntity.reqDtSaida;
    this.reqHSaida = userReqEntity.reqHSaida;
    this.reqDtRetorno = userReqEntity.reqHRet;
    this.reqMotivo = userReqEntity.reqMotivo;
    this.reqHRet = userReqEntity.reqHRet;
    this.reqKm = userReqEntity.reqKm;
    this.reqStatus = userReqEntity.reqStatus;
    this.reqDiaria = userReqEntity.reqDiaria;
    this.reqIntegral = userReqEntity.reqIntegral;
    this.reqParcial =  userReqEntity.reqParcial;
    this.reqEspecial = userReqEntity.reqEspecial;
    this.reqPacote = userReqEntity.reqPacote;
    this.reqGovernador = userReqEntity.reqGovernador;
    this.transmeio = userReqEntity.traIdCodigo;    
    this.desLocal = userReqEntity.destino?.desLocal ?? null;
    this.desMunIdCodigo = userReqEntity.destino?.municipio?.munIdCodigo ?? 0; 
    this.desMunNme = userReqEntity.destino?.municipio?.munCidade ?? '';    
    this.diariaIntegral = diariaIntegral;
    this.diariaParcial = diariaParcial   
    this.diariaBase = diariaBase;   
    this.saqueMes = saqueMes; 
    this.valorSolicitado = valorSolicitado;
    this.salario50Porcento = salario50Porcento;
    this.saldoDisponivel = saldoDisponivel; 
    this.regDescricao = userReqEntity.regDescricao;
    this.traDescricao = userReqEntity.traDescricao;
   
  }

}


export enum RequisicaoStatus {
  FINALIZADA = 'FINALIZADA',  
  CANCELADA = 'CANCELADA'
}

export interface FindAllParams {
  reqIdCodigo: number;
  codMunicipio: number;
  reqStatus: RequisicaoStatus;
  chapa: string;
  page?: number;
  limit?: number;
  orderBy?: string;
  orderDirection?: 'ASC' | 'DESC';
}

