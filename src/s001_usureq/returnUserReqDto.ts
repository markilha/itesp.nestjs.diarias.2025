
import { UsuReqEntity } from "src/database/db_oracle/entities/usureq.entity";
import { returnRmDto } from "src/rm/returnRmDto";

export class ReturnUserReqDto {
    reqIdCodigo: number; 
    chapa: string;    
    usuMov: string;    
    pessoa?: returnRmDto;

    constructor(userReqEntity: UsuReqEntity) {
        this.reqIdCodigo = userReqEntity.reqIdCodigo;
        this.chapa = userReqEntity.chapa;
        this.usuMov = userReqEntity.usuMov;
        this.pessoa = userReqEntity.pessoa ? new returnRmDto(userReqEntity.pessoa) : undefined;
    }
  }