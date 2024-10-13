import { IsInt, IsString, IsOptional, IsDecimal, IsDate, IsNotEmpty } from 'class-validator';

export class CreateMotivodiariaDto {
  MDI_ID_CODIGO: number;
  ITE_ID_CODIGO: number;
  RRE_ID_CODIGO: number;
  DIR_ID_CODIGO: number;
  REQ_ID_CODIGO?: number | null;
  MDI_TIPO?: string | null;
  MDI_VALOR?: number | null;
  MDI_CHEFE?: string | null;
  MDI_GERENTE?: string | null;
  MDI_DIRETOR?: string | null;
  MDI_DIREXECUTIVO?: string | null;
  MDI_DTAUTORIZA?: Date | null;
  MDI_JUSTIFICATIVA?: string | null;
}

export interface FindAllParams {
  CHAPA?: string;
  page?: number;
  limit?: number;
}
