import { ReqViagemEntity } from 'src/database/db_oracle/entities/reqviagem.entity';

export class reqviagemDto {
  rqvIdCodigo: string;
  rnuIdCodigo: number;
  reqIdCodigo?: number;
  rqvDtInicio?: Date;
  rqvOrdem?: string;
  rqvHInicio?: string;

  constructor(reqviagem: ReqViagemEntity) {
    this.rqvIdCodigo = reqviagem.rqvIdCodigo;
    this.rnuIdCodigo = reqviagem.rnuIdCodigo;
    this.reqIdCodigo = reqviagem.reqIdCodigo;
    this.rqvDtInicio = reqviagem.rqvDtInicio;
    this.rqvOrdem = reqviagem.rqvOrdem;
    this.rqvHInicio = reqviagem.rqvHInicio;
  }
}

export interface FindAllParams {
    rnuIdCodigo: number;
    reqIdCodigo: number;
    rqvIdCodigo: string;
    rqvDtInicio: Date;
    rqvOrdem: string;
    rqvHInicio: string;
    page: number;
    limit: number;
}
