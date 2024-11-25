import { ApiProperty } from '@nestjs/swagger';

export class UsersDto {
  id_usuario?: number;
  nome: string;
  login: string;
  senha: string;
  chapa: string;
}

export class UserUpdateDto {
  readonly nome?: string;
  readonly login?: string;
}

export class FindAllParams {
  @ApiProperty({ required: false })
  nome?: string;
  @ApiProperty({ required: false })
  login?: string;
}

export enum StatusDto {
  ATIVO = 1,
  INATIVO = 2,
}

export class userNivelDto {
  @ApiProperty()
  nome: string;

  @ApiProperty()
  chapa: number;

  @ApiProperty()
  login: string;

  @ApiProperty()
  id_perfil_acesso: number;

  @ApiProperty()
  id_sistema: number;
}
