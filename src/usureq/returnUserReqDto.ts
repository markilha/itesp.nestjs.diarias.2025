
import { UsuReqEntity } from "src/database/db_oracle/entities/usureq.entity";
import { ReturnRequisicaoDto } from "src/requisicao/returnRequisicao.dto";


export class ReturnUserReqDto {
    reqIdCodigo: number;
    chapa: string;
    usuMov: string;
    requisicao?: ReturnRequisicaoDto;
    salario: number;
    codfuncao: string;
    diariaIntegral: number;
    diariaParcial40: number;
    diariaParcial20: number;
    diariaBase: number;
    municipio_partida: string;
  
    constructor(
      userReqEntity: UsuReqEntity,
      diariaIntegral: number,
      diariaParcial40: number,
      diariaParcial20: number,
      diariaBase: number,
    ) {
      this.reqIdCodigo = userReqEntity.reqIdCodigo;
      this.chapa = userReqEntity.chapa;
      this.usuMov = userReqEntity.usuMov;
      this.requisicao = userReqEntity.requisicao
        ? new ReturnRequisicaoDto(userReqEntity.requisicao)
        : undefined;
      this.salario = userReqEntity.pfunc?.SALARIO;
      this.codfuncao = userReqEntity.pfunc?.CODFUNCAO;
  
      // Atribuindo as diárias calculadas
      this.diariaIntegral = diariaIntegral;
      this.diariaParcial40 = diariaParcial40;
      this.diariaParcial20 = diariaParcial20;
      this.diariaBase = diariaBase;
      this.municipio_partida = userReqEntity.requisicao?.municipio_partida?.nmeMunic;
    }
  }
  