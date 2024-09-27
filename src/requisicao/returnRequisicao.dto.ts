import { RequisicaoEntity } from 'src/database/db_mysql/entities/requisicao.entity';
import { UsuReqEntity } from 'src/database/db_mysql/entities/usureq.entity';

export class ReturnRequisicaoDto {
  reqIdCodigo: number;
  chapa: string;
  codMunicipio: number;
  ori_municipio: string;  
  reqDtReq: string;
  reqDtSaida: Date;
  reqHSaida: string;
  reqDtRetorno: Date;
  reqMotivo: string;
  reqHRet: string;
  reqKm: number;
  reqStatus: string;
  reqDiaria: string;
  reqIntegral: number;
  reqParcial: number;
  reqEspecial: number;
  reqPacote: string;
  reqGovernador: string;
  transmeio: number;
  municipio: number;
  des_local: string;
  des_mun_id_codigo: number; 
  des_mun_nme: string;   
  usuMov: string;
  useReq: UsuReqEntity[];

  
  constructor(
    userReqEntity: RequisicaoEntity,    
  ) {
   this.reqIdCodigo = userReqEntity.reqIdCodigo;   
    this.codMunicipio = userReqEntity.municipio_partida?.codMunicipio;
    this.ori_municipio = userReqEntity.municipio_partida?.nmeMunic;     
    this.reqDtReq = userReqEntity.reqDtReq;
    this.reqDtSaida = userReqEntity.reqDtSaida;
    this.reqHSaida = userReqEntity.reqHSaida;
    this.reqDtRetorno = userReqEntity.reqDtRetorno;
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
    this.transmeio = userReqEntity.transmeio.traIdCodigo;
    this.municipio = userReqEntity.codMunicipio;
    this.des_local = userReqEntity.destino.desLocal;
    this.des_mun_id_codigo = userReqEntity.destino.munIdCodigo;    
    this.des_mun_nme = userReqEntity.destino.municipio.munCidade;  
    this.useReq = userReqEntity.usereq;

  }
}
