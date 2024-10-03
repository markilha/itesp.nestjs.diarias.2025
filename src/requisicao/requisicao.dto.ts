
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
  reqDiaria?: string;
  reqIntegral?: string;
  reqParcial?: string;
  reqEspecial?: string;
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
  reqDiaria: string; 
  reqIntegral: string; 
  reqParcial: string; 
  reqEspecial: string; 
  reqPacote: number; 
  reqGovernador: string | null; 
  transmeio: number; 
  municipio: number;
  desLocal: string; 
  desMunIdCodigo: number; 
  desMunNme: string; 

  diariaIntegral: number;
  diariaParcial20: number;
  diariaParcial40: number; 
  diariaBase: number; 
  excedeu50Porcento: boolean; 
  salario: number; 
  totalSaqueMes: number; 
  salarioAtual: number;
  salario50Porcento: number;

  usuMov: string; 
    constructor(
    userReqEntity: RequisicaoEntity,   
    diariaIntegral?: number,
    diariaParcial40?: number,
    diariaParcial20?: number,
    diariaBase?: number,
    totalSaqueMes?: number,
    salarioAtual?: number,
    salario50Porcento?: number
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
    this.reqParcial = userReqEntity.reqParcial;
    this.reqEspecial = userReqEntity.reqEspecial;
    this.reqPacote = userReqEntity.reqPacote;
    this.reqGovernador = userReqEntity.reqGovernador;
    this.transmeio = userReqEntity.traIdCodigo;
    this.desLocal = userReqEntity.destino.desLocal;
    this.desMunIdCodigo = userReqEntity.destino.municipio.munIdCodigo;
    this.desMunNme = userReqEntity.destino.municipio.munCidade;   
    this.diariaIntegral = diariaIntegral;
    this.diariaParcial20 = diariaParcial20;
    this.diariaParcial40 = diariaParcial40;
    this.diariaBase = diariaBase;
    this.totalSaqueMes = totalSaqueMes;
    this.salarioAtual = salarioAtual;
    this.salario50Porcento = salario50Porcento;
  }

}



// export class RequisicaoDto {
//   @IsOptional()
//   @IsNumber()
//   readonly regIdCodigo?: number;

//   @IsOptional()
//   @IsNumber()
//   readonly codMunicipio?: number;

//   @IsOptional()
//   @IsNumber()
//   readonly traIdCodigo?: number;

//   @IsOptional()
//   @IsString()
//   readonly reqDtReq?: string;

//   @IsOptional()
//   @IsDate()
//   readonly reqDtSaida?: Date;

//   @IsOptional()
//   @IsString()
//   readonly reqMotorista?: string;

//   @IsOptional()
//   @IsString()
//   readonly reqHSaida?: string;

//   @IsOptional()
//   @IsDate()
//   readonly reqDtRetorno?: Date;

//   @IsOptional()
//   @IsString()
//   readonly reqMotivo?: string;

//   @IsOptional()
//   @IsString()
//   readonly reqHRet?: string;

//   @IsOptional()
//   @IsNumber()
//   readonly reqKm?: number;

//   @IsOptional()
//   @IsIn(['Pendente', 'Aprovado', 'Rejeitado']) // Exemplo de enum
//   readonly reqStatus?: string;

//   @IsOptional()
//   @IsString()
//   readonly reqDiaria?: string;

//   @IsOptional()
//   @IsNumber()
//   readonly reqIntegral?: number;

//   @IsOptional()
//   @IsNumber()
//   readonly reqParcial?: number;

//   @IsOptional()
//   @IsNumber()
//   readonly reqEspecial?: number;

//   @IsOptional()
//   @IsString()
//   readonly reqPacote?: string;

//   @IsOptional()
//   @IsString()
//   readonly reqGovernador?: string;
// }

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

