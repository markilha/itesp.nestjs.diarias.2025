import { ApiProperty } from '@nestjs/swagger';
import { Role } from 'src/auth/role.enum';

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
  @ApiProperty({ required: false })
  page?: number;
  @ApiProperty({ required: false })
  limit?: number;
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

export class PerfilAcesso {
  @ApiProperty()
  id_perfil_acesso: number;
  @ApiProperty()
  id_sistema: number;
  @ApiProperty()
  descricao: string;
  @ApiProperty()
  incluir: string;
  @ApiProperty()
  alterar: string;
  @ApiProperty()
  consultar: string;
  @ApiProperty()
  deletar: string;
  @ApiProperty()
  permissao_usuario: string;
}

export class FindAllParamsDto {

  @ApiProperty()
  id_usuario: number;
  @ApiProperty()
  nome: string;

  @ApiProperty()
  chapa: string;

  @ApiProperty()
  login: string;

}

export class darAcessoParamsDto {

  @ApiProperty()
  id_usuario: number;
  @ApiProperty()
  login: string;

  @ApiProperty()
  chapa: string;


}

export class userInfo {
  @ApiProperty()
  id_usuario: number;
  @ApiProperty()
  login: string;
  @ApiProperty()
  chapa: string
  @ApiProperty({
    type: [String],
    enum: Role,
    description: 'Roles do usuário',
  })
  roles: string[]
  @ApiProperty()
  permissao: number;
}

export class returnTotal {
  @ApiProperty({
    description: 'Array de objetos do tipo UsersDto',
    type: [UsersDto],
  })
  data: UsersDto[];
    @ApiProperty({
    description: 'Valor total calculado',
    type: Number,
    example: 0,
  })
  total: number;

}

