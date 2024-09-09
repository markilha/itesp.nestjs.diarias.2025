
import { UsuReqEntity } from "src/database/db_oracle/entities/usureq.entity";
import { ReturnRequisicaoDto } from "src/requisicao/returnRequisicao.dto";
import { returnRmDto } from "src/rm/returnRmDto";



export class ReturnUserReqDto {
    reqIdCodigo: number; 
    chapa: string;    
    usuMov: string;    
    pessoa?: returnRmDto;
    requisicao?: ReturnRequisicaoDto;   
    salario?: number;
  

    constructor(userReqEntity: UsuReqEntity) {
        this.reqIdCodigo = userReqEntity.reqIdCodigo;
        this.chapa = userReqEntity.chapa;
        this.usuMov = userReqEntity.usuMov;    
        this.requisicao =  userReqEntity.requisicao ? new ReturnRequisicaoDto(userReqEntity.requisicao) : undefined;
        this.pessoa = userReqEntity.pessoa ? new returnRmDto(userReqEntity.pessoa) : undefined;       
    }
  }