import { ItinerarioEntity } from 'src/database/db_mysql/entities/itinerario.entity';

export class ItinerarioDto {
  ITI_ID_CODIGO: number;
  REQ_ID_CODIGO: number;
  ITI_HCHEGADA: string;
  MUN_ID_CODIGO: number;
  ITI_LOCAL: string;
  ITI_DTSAIDA: Date;
  ITI_HSAIDA: string;
  ITI_KM: number;
  ITI_DTCHEGADA: Date;

  constructor(itinerario: ItinerarioEntity) {
    this.ITI_ID_CODIGO = itinerario.ITI_ID_CODIGO;
    this.REQ_ID_CODIGO = itinerario.REQ_ID_CODIGO;
    this.ITI_HCHEGADA = itinerario.ITI_HCHEGADA;
    this.MUN_ID_CODIGO = itinerario.MUN_ID_CODIGO;
    this.ITI_LOCAL = itinerario.ITI_LOCAL;
    this.ITI_DTSAIDA = itinerario.ITI_DTSAIDA;
    this.ITI_HSAIDA = itinerario.ITI_HSAIDA;
    this.ITI_KM = itinerario.ITI_KM;
    this.ITI_DTCHEGADA = itinerario.ITI_DTCHEGADA;
  }
}

export interface FindAllParams {
  REQ_ID_CODIGO?: number;
  page?: number;
  limit?: number;
}


  
