import { IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, Length } from 'class-validator';

export class pcontasNumDto {
  
  @IsNumber()
  @IsNotEmpty()
  PCO_ID_CODIGO: number;

  
  RNU_ID_CODIGO: number;

 
}

export interface FindAllParams {
  PCO_ID_CODIGO: string;  
  page: number;
  limit: number;
}