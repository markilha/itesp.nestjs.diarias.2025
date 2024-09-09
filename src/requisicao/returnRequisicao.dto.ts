import { RequisicaoEntity } from 'src/database/db_oracle/entities/requisicao.entity';
export class ReturnRequisicaoDto {
  regIdCodigo?: number;

  reqIdCodigo?: number;

  codMunicipio?: number;

  traIdCodigo?: number;

  reqDtReq?: string;

  reqDtSaida?: Date;

  reqMotorista?: string;

  reqHSaida?: string;

  reqDtRetorno?: Date;

  reqMotivo?: string;

  reqHRet?: string;

  reqKm?: number;

  reqStatus?: string;

  reqDiaria?: string;

  reqIntegral?: number;

  reqParcial?: number;

  reqEspecial?: number;

  reqPacote?: string;

  transmeio?: string;
  municipio?: string;

  destino_local?: string;
  destino_municipio?: string;
  destino_populacao?: number;
  salario?: number;


  constructor(requisicao: RequisicaoEntity) {
    this.reqIdCodigo = requisicao.reqIdCodigo;
    this.codMunicipio = requisicao.codMunicipio;
    this.reqDtReq = requisicao.reqDtReq;
    this.reqDtSaida = requisicao.reqDtSaida;
    this.reqHSaida = requisicao.reqHSaida;
    this.reqDtRetorno = requisicao.reqDtRetorno;
    this.reqMotivo = requisicao.reqMotivo;
    this.reqHRet = requisicao.reqHRet;
    this.reqKm = requisicao.reqKm;
    this.reqStatus = requisicao.reqStatus;
    this.reqDiaria = requisicao.reqDiaria;
    this.reqIntegral = requisicao.reqIntegral;
    this.reqParcial = requisicao.reqParcial;
    this.reqEspecial = requisicao.reqEspecial;
    this.reqPacote = requisicao.reqPacote;

    this.transmeio = requisicao.transmeio
      ? requisicao.transmeio.traDescricao
      : null;
    this.municipio = requisicao.municipio
      ? requisicao.municipio.nomeMunicipio
      : null;
    this.destino_local = requisicao.destino ? requisicao.destino.desLocal : null;
    this.destino_municipio = requisicao.destino ? requisicao.destino.municipio.munCidade: null;
    this.destino_populacao = requisicao.destino ? requisicao.destino.municipio.munPopulacao : null;    

  }
}
