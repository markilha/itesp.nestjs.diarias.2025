import { ApiProperty } from '@nestjs/swagger';
import {  MaxLength, MinLength } from 'class-validator';

export class UsersDto {
 
  readonly id_usuario?: number;

  @MinLength(3)
  @MaxLength(100)
  readonly  nome: string;
  readonly login: string;
   senha: string;
}
export class UserUpdateDto {
  readonly nome?: string;
  readonly login?: string;
}

export class FindAllParams {
  @ApiProperty({required: false})
  nome?: string;
  @ApiProperty({required: false})
  login?: string;
}

export enum StatusDto {
  ATIVO = 1,
  INATIVO = 2,
}
