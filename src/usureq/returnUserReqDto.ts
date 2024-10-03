import { UsuReqEntity } from 'src/database/db_mysql/entities/usureq.entity';

export class ReturnUserReqDto {
  reqIdCodigo: number;
  chapa: string;
  codMunicipio: number;
  ori_municipio: string;
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
  reqGovernador: string;
  transmeio: number;
  municipio: number;
  des_local: string;
  des_mun_id_codigo: number;
  des_mun_nme: string;
  diariaIntegral: number;
  diariaParcial20: number | null;
  diariaParcial40: number;
  diariaBase: number;
  excedeu50Porcento: boolean;
  totalNumerario: number;
  salario: number;
  usuMov: string;

  constructor(
    userReqEntity: UsuReqEntity,
    diariaIntegral: number,
    diariaParcial40: number,
    diariaParcial20: number,
    diariaBase: number,
    excedeu50Porcento: boolean,
    totalDiariasMes: number,
  ) {
    this.reqIdCodigo = userReqEntity.reqIdCodigo;
    this.chapa = userReqEntity.chapa;
    this.codMunicipio =
      userReqEntity.requisicao?.municipio_partida?.codMunicipio;
    this.ori_municipio = userReqEntity.requisicao?.municipio_partida?.nmeMunic;
    this.reqDtReq = userReqEntity.requisicao?.reqDtReq;
    this.reqDtSaida = userReqEntity.requisicao?.reqDtSaida;
    this.reqHSaida = userReqEntity.requisicao.reqHSaida;    
    this.reqMotivo = userReqEntity.requisicao.reqMotivo;
    this.reqHRet = userReqEntity.requisicao.reqHRet;
    this.reqKm = userReqEntity.requisicao.reqKm;
    this.reqStatus = userReqEntity.requisicao.reqStatus;
    this.reqDiaria = userReqEntity.requisicao.reqDiaria;
    this.reqIntegral = userReqEntity.requisicao.reqIntegral;
    this.reqParcial = userReqEntity.requisicao.reqParcial;
    this.reqEspecial = userReqEntity.requisicao.reqEspecial;
    this.reqPacote = userReqEntity.requisicao.reqPacote;
    this.reqGovernador = userReqEntity.requisicao.reqGovernador;
    this.transmeio = userReqEntity.requisicao.transmeio.traIdCodigo;
    this.municipio = userReqEntity.requisicao.codMunicipio;
    this.des_local = userReqEntity.requisicao.destino.desLocal;
    this.des_mun_id_codigo = userReqEntity.requisicao.destino.munIdCodigo;
    this.des_mun_nme = userReqEntity.requisicao.destino.municipio.munCidade;
    this.diariaIntegral = diariaIntegral;
    this.diariaParcial20 = diariaParcial20;
    this.diariaParcial40 = diariaParcial40;
    this.diariaBase = diariaBase;
    this.excedeu50Porcento = excedeu50Porcento;
    this.salario = userReqEntity.pfunc?.salario;
    this.totalNumerario = totalDiariasMes;
    this.usuMov = userReqEntity.usuMov;
  }
}

export class ReturnRequiscaoDto {
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

  constructor(userReqEntity: UsuReqEntity) {
    //convertendo a data para string
    const dateReqdtreq = new Date(userReqEntity.requisicao.reqDtReq) || null;
    const dateReqdtSaida =
      new Date(userReqEntity.requisicao.reqDtSaida) || null;
    //convertendo string em numero
    const reqIntegral = Number(userReqEntity.requisicao.reqIntegral) || null;
    const reqParcial = Number(userReqEntity.requisicao.reqParcial) || null;
    const reqEspecial = Number(userReqEntity.requisicao.reqEspecial) || null;
    //convertendo numero em string
    const reqPacote = userReqEntity.requisicao.reqPacote.toString() || null;

    this.reqIdCodigo = userReqEntity.reqIdCodigo;
    this.chapa = userReqEntity.chapa;
    this.codMunicipio =
      userReqEntity.requisicao?.municipio_partida?.codMunicipio;
    this.ori_municipio = userReqEntity.requisicao?.municipio_partida?.nmeMunic;
    this.reqDtReq = userReqEntity.requisicao?.reqDtReq;

    this.reqDtSaida = dateReqdtSaida;
    this.reqHSaida = userReqEntity.requisicao.reqHSaida;
    this.reqDtRetorno = dateReqdtreq;
    this.reqMotivo = userReqEntity.requisicao.reqMotivo;
    this.reqHRet = userReqEntity.requisicao.reqHRet;
    this.reqKm = userReqEntity.requisicao.reqKm;
    this.reqStatus = userReqEntity.requisicao.reqStatus;
    this.reqDiaria = userReqEntity.requisicao.reqDiaria;
    this.reqIntegral = reqIntegral;
    this.reqParcial = reqParcial;
    this.reqEspecial = reqEspecial;
    this.reqPacote = reqPacote;
    this.reqGovernador = userReqEntity.requisicao.reqGovernador;
    this.transmeio = userReqEntity.requisicao.transmeio.traIdCodigo;
    this.municipio = userReqEntity.requisicao.codMunicipio;
    this.des_local = userReqEntity.requisicao.destino.desLocal;
    this.des_mun_id_codigo = userReqEntity.requisicao.destino.munIdCodigo;
    this.des_mun_nme = userReqEntity.requisicao.destino.municipio.munCidade;
    this.usuMov = userReqEntity.usuMov;
  }
}
