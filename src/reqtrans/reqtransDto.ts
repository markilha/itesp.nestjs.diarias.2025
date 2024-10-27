import { reembolsoEntity } from "src/database/db_oracle/entities/reembolso.entity";
import { reqtransEntity } from "src/database/db_oracle/entities/requisicaoTrans.entity";


export class reqtransDto {
    REQ_ID_CODIGO?: number;
    REG_ID_CODIGO: number;
    COD_MUNICIP: number;
    TRA_ID_CODIGO: number;
    REQ_DTREQ: string;
    REQ_DTSAIDA: Date;
    REQ_MOTORISTA: string;
    REQ_HSAIDA: string;
    REQ_DTRET: Date;
    REQ_MOTIVO: string;
    REQ_HRET: string;
    REQ_KM: number;
    REQ_STATUS: string;
    REQ_DIARIA: string;
    REQ_INTEGRAL: number;
    REQ_PARCIAL: number;
    REQ_ESPECIAL: number;
    REQ_PACOTE: string;
    REQ_GOVERNADOR: string;
    constructor(reqtrans: reqtransEntity) {
        this.REQ_ID_CODIGO = reqtrans.REQ_ID_CODIGO;
        this.REG_ID_CODIGO = reqtrans.REG_ID_CODIGO;
        this.COD_MUNICIP = reqtrans.COD_MUNICIP;
        this.TRA_ID_CODIGO = reqtrans.TRA_ID_CODIGO;
        this.REQ_DTREQ = reqtrans.REQ_DTREQ;
        this.REQ_DTSAIDA = reqtrans.REQ_DTSAIDA;
        this.REQ_MOTORISTA = reqtrans.REQ_MOTORISTA;
        this.REQ_HSAIDA = reqtrans.REQ_HSAIDA;
        this.REQ_DTRET = reqtrans.REQ_DTRET;
        this.REQ_MOTIVO = reqtrans.REQ_MOTIVO;
        this.REQ_HRET = reqtrans.REQ_HRET;
        this.REQ_KM = reqtrans.REQ_KM;
        this.REQ_STATUS = reqtrans.REQ_STATUS;
        this.REQ_DIARIA = reqtrans.REQ_DIARIA;
        this.REQ_INTEGRAL = reqtrans.REQ_INTEGRAL;
        this.REQ_PARCIAL = reqtrans.REQ_PARCIAL;
        this.REQ_ESPECIAL = reqtrans.REQ_ESPECIAL;
        this.REQ_PACOTE = reqtrans.REQ_PACOTE;
        this.REQ_GOVERNADOR = reqtrans.REQ_GOVERNADOR;
    }
 
  
 
}


export interface FindAllParams {
  REQ_ID_CODIGO?: number;
  page: number;
  limit: number;
}

