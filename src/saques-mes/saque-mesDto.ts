import { SaqueMesEntity } from "src/database/db_mysql/entities/saqueMes.entity";

export class SaqueMesDto {
  chapa: string;
  tdeidcodigo: number;
  sqetiposaque: string;
  messaque: string;
  totsaque: number;

  constructor(entity: SaqueMesEntity) {
    this.chapa = entity.chapa;
    this.tdeidcodigo = entity.tdeidcodigo;
    this.sqetiposaque = entity.sqetiposaque;
    this.messaque = entity.messaque;
    this.totsaque = entity.totsaque;
  }
}

export class FindAllParams {
  chapa?: string; 
  messaque?: string; 
  page?: number; 
  limit?: number; 
  orderBy?: string;
  orderDirection?: string;
}