import { ApiProperty } from "@nestjs/swagger";
import { reembolsoEntity } from "../database/db_oracle/entities/reembolso.entity";
import { reqtransEntity } from "../database/db_oracle/entities/requisicaoTrans.entity";


export class reqtransDto {
  @ApiProperty()
    REQ_ID_CODIGO?: number;
    @ApiProperty()
    REG_ID_CODIGO: number;
    @ApiProperty()
    COD_MUNICIP: number;
    @ApiProperty()
    TRA_ID_CODIGO: number;
    @ApiProperty()
    REQ_DTREQ: string;
    @ApiProperty()
    REQ_DTSAIDA: Date;
    @ApiProperty()
    REQ_MOTORISTA: string;
    @ApiProperty()
    REQ_HSAIDA: string;
    @ApiProperty()
    REQ_DTRET: Date;
    @ApiProperty()
    REQ_MOTIVO: string;
    @ApiProperty()
    REQ_HRET: string;
    @ApiProperty()
    REQ_KM: number;
    @ApiProperty()
    REQ_STATUS: string;
    @ApiProperty()
    REQ_DIARIA: string;
    @ApiProperty()
    REQ_INTEGRAL: number;
    @ApiProperty()
    REQ_PARCIAL: number;
    @ApiProperty()
    REQ_ESPECIAL: number;
    @ApiProperty()
    REQ_PACOTE: string;
    @ApiProperty()
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


export class FindAllParams {
  @ApiProperty({ required: false })
  REQ_ID_CODIGO?: number;
  @ApiProperty({ required: false })
  orderDirection: 'ASC' | 'DESC';
  @ApiProperty({ required: false })
  orderBy?: string;
  @ApiProperty({ required: false })
  page?: number;
  @ApiProperty({ required: false })
  limit?: number;
}


