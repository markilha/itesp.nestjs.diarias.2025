


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
  reqPacote: string; 
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
  diariaParcPorc: number;
  vlDiaria: number;
  usuMov: string; 
  
    constructor(
    params: any,    
  ) {
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
    this.reqParcial =  params.reqParcial > 0 ? 1 : 0;
    this.reqEspecial = Number(params.reqEspecial) || 0;
    this.reqPacote = params.reqPacote === 1 ? 'N' : 'S';
    this.reqGovernador = params.reqGovernador;    
    this.desLocal = params.destino?.desLocal ?? null;
    this.desMunIdCodigo = params.destino?.municipio?.munIdCodigo ?? 0; 
    this.desMunNme = params.destino?.municipio?.munCidade ?? '';    
    this.diariaIntegral = params.diariaIntegral;
    this.diariaParcial = params.diariaParcial   
    this.diariaBase = params.diariaBase;   
    this.saqueMes = params.saqueMes; 
    this.valorSolicitado = params.valorSolicitado;
    this.salario50Porcento = params.salario50Porcento;
    this.saldoDisponivel = params.saldoDisponivel; 
    this.regDescricao = params.regDescricao;
    this.traDescricao = params.traDescricao;
    this.diariaParcPorc =params.diariaParcPorc;
    this.vlDiaria = params.vlDiaria;
   
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

