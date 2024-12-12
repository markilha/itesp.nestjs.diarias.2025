import { permissaoCargo } from '../enums/cargo';

export const permissaoFind = [
  {
    roles: [
      permissaoCargo.GTCAMPO,
      permissaoCargo.FINANCEIRO_INTERIOR,
      permissaoCargo.FINANCEIRO_TESOURARIA,
    ],
    secao: 15,
  },
  {
    roles: [
      permissaoCargo.GERENTE
    ],
    secao: 12,
  },
  {
    roles: [
      permissaoCargo.DIRETOR_ADJUNTO
    ],
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