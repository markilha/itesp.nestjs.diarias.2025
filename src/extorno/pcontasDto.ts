import { IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, Length } from 'class-validator';

export class pcontasDto {
  @IsNumber()
  @IsNotEmpty()
  PCO_ID_CODIGO: number;

  @IsIn(['N', 'R'])
  @IsNotEmpty()
  PCO_TIPO: string;

  @IsNumber()
  @IsOptional()
  PCO_TOTDOC?: number;
}

export interface FindAllParams {
  PCO_ID_CODIGO: number;
  page: number;
  limit: number;
}
