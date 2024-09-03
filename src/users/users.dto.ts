import { IsNumber, MaxLength, MinLength } from 'class-validator';

export class UsersDto {
  @IsNumber()
  readonly id?: number;

  @MinLength(3)
  @MaxLength(100)
  readonly nome: string;

  readonly login: string;

  readonly senha: string;
}
export class UserUpdateDto {
  readonly nome?: string;
  readonly login?: string;
}

export interface FindAllParams {
  nome: string;
  login: string;
}

export enum StatusDto {
  ATIVO = 1,
  INATIVO = 2,
}
