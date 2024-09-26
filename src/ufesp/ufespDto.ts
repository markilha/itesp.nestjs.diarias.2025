export class UfespDto {
  ufeIdCodigo?: number;
  tdeIdCodigo?: number;
  ufeValor?: number;
  ufeDtInicio?: Date;
  ufeDtFinal?: Date;
}

export class FindAllParams {
  ufeIdCodigo: number;
  tdeIdCodigo?: number;
  ufeValor?: number;
  ufeDtInicio?: Date;
  page?: number;
  limit?: number;
}
