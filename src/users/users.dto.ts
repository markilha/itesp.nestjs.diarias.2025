import {  MaxLength, MinLength } from 'class-validator';

export class UsersDto {
 
  readonly USER_ID?: number;

  @MinLength(3)
  @MaxLength(100)
  readonly  REAL_NAME: string;
  readonly USERCS_NAME: string;
   USER_PWD: string;
}
export class UserUpdateDto {
  readonly REAL_NAME?: string;
  readonly USERCS_NAME?: string;
}

export interface FindAllParams {
  REAL_NAME: string;
  USERCS_NAME: string;
}

export enum StatusDto {
  ATIVO = 1,
  INATIVO = 2,
}
