export class EventosDiariasDto {
  chapa: string;
  total: number;
}

export interface FindAllParams {
  chapa?: string;
  total: number;
  page: number;
  limit: number;
}
