
import { UsuReqEntity } from "src/database/db_oracle/entities/usureq.entity";
import { ReturnRequisicaoDto } from "src/requisicao/returnRequisicao.dto";


export class ReturnUserReqDto {
    reqIdCodigo: number; 
    chapa: string;    
    usuMov: string; 
    requisicao?: ReturnRequisicaoDto;  
    salario: number;
    codfuncao: string;

    constructor(userReqEntity: UsuReqEntity) {
        this.reqIdCodigo = userReqEntity.reqIdCodigo;
        this.chapa = userReqEntity.chapa;
        this.usuMov = userReqEntity.usuMov;    
        this.requisicao =  userReqEntity.requisicao ? new ReturnRequisicaoDto(userReqEntity.requisicao) : undefined; 
        this.salario = userReqEntity.pfunc?.SALARIO;
        this.codfuncao = userReqEntity.pfunc?.CODFUNCAO;
    }
  }