import { permissaoCargo } from '../enums/cargo';
import { AuthUserDto } from 'src/auth/use.auth.Dto';
import { HttpException, HttpStatus } from '@nestjs/common';

export const permissaoFind = [
  {
    roles: [
      permissaoCargo.GTCAMPO,
      permissaoCargo.TESOURARIA_INTERIOR,
      permissaoCargo.FINANCEIRO_TESOURARIA,
    ],
    secao: 15,
  },
  {
    roles: [permissaoCargo.GERENTE],
    secao: 12,
  },
  {
    roles: [permissaoCargo.DIRETOR_ADJUNTO],
    secao: 3,
  },
];
export const permissaoFindAll = (permissao: number) => {  
  const permissaoFindAllSaqueSecao = permissaoFind.find((p) => p.roles.includes(permissao));  
  if (!permissaoFindAllSaqueSecao) {
    return null;
  }  
  return permissaoFindAllSaqueSecao.secao;
};

export function verificaAutorizacao(chapa: string, user: AuthUserDto) {
  if (chapa !== user.chapa) {
    if (
      user.permissao === permissaoCargo.USUARIO_NIVEL1 ||
      user.permissao === permissaoCargo.USUARIO_NIVEL2
    )
      throw new HttpException(
        'Usuário não tem autorização para cancelar saque de outro funcionário!!',
        HttpStatus.UNAUTHORIZED,
      );
  }
}
