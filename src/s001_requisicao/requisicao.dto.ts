import { IsString, IsNumber, IsOptional, IsDate, IsIn } from 'class-validator';

export class RequisicaoDto {
  @IsOptional()
  @IsNumber()
  readonly regIdCodigo?: number;

  @IsOptional()
  @IsNumber()
  readonly codMunicipio?: number;

  @IsOptional()
  @IsNumber()
  readonly traIdCodigo?: number;

  @IsOptional()
  @IsString()
  readonly reqDtReq?: string;

  @IsOptional()
  @IsDate()
  readonly reqDtSaida?: Date;

  @IsOptional()
  @IsString()
  readonly reqMotorista?: string;

  @IsOptional()
  @IsString()
  readonly reqHSaida?: string;

  @IsOptional()
  @IsDate()
  readonly reqDtRetorno?: Date;

  @IsOptional()
  @IsString()
  readonly reqMotivo?: string;

  @IsOptional()
  @IsString()
  readonly reqHRet?: string;

  @IsOptional()
  @IsNumber()
  readonly reqKm?: number;

  @IsOptional()
  @IsIn(['Pendente', 'Aprovado', 'Rejeitado']) // Exemplo de enum
  readonly reqStatus?: string;

  @IsOptional()
  @IsString()
  readonly reqDiaria?: string;

  @IsOptional()
  @IsNumber()
  readonly reqIntegral?: number;

  @IsOptional()
  @IsNumber()
  readonly reqParcial?: number;

  @IsOptional()
  @IsNumber()
  readonly reqEspecial?: number;

  @IsOptional()
  @IsString()
  readonly reqPacote?: string;

  @IsOptional()
  @IsString()
  readonly reqGovernador?: string;
}

export enum RequisicaoStatus {
  FINALIZADA = 'FINALIZADA',  
  CANCELADA = 'CANCELADA'
}

export interface FindAllParams {
  reqIdCodigo: number;
  codMunicipio: number;
  reqStatus: RequisicaoStatus;
  page?: number;
  limit?: number;
}

