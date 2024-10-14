import { SaqueMesEntity } from "src/database/db_mysql/entities/saqueMes.entity";

export class SaqueMesDto {
  CHAPA: string;
  TDE_ID_CODIGO: number;
  SQE_TIPOSAQUE: string;
  messaque: string;
  totSaque: number;
  TotalSaqueMes: number;

  constructor(entity: SaqueMesEntity, totalSaqueMes: number) {      
    this.CHAPA = entity.CHAPA;
    this.TDE_ID_CODIGO = entity.TDE_ID_CODIGO;
    this.SQE_TIPOSAQUE = entity.SQE_TIPOSAQUE;
    this.messaque = entity.messaque;
    this.totSaque = entity.TotSaque;
    this.TotalSaqueMes = totalSaqueMes;
  }
}

export class FindAllParams {
  CHAPA?: string; 
  messaque?: string; 
  page?: number; 
  limit?: number; 
  orderBy?: string;
  orderDirection?: string;
}