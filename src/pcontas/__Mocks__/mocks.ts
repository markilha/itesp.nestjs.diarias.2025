import { AuthUserDto } from 'src/auth/use.auth.Dto';
import { createPcontasDto } from '../pcontasDto';

export const createDto: createPcontasDto = {
  SQE_ID_CODIGO: 99,
  PCO_TIPO: 'N',
  PCO_TOTDOC: 1,
  JUSTIFICATIVA: 'Justificativa teste',
  TOTALCOMPLEMENTAR: 0,
  TOTALDEVOLUCAO: 0,
  INTREAL: '100',
  PARREAL: '50',
};

export const authUser: AuthUserDto = {
  sub: 1,
  login: 'user1',
  chapa: 'chapa123',
  roles: ['admin'],
  permissao: 1,
  codsecao: '001',
};

export const saqueMock = {
  sqeIdCodigo: 9162307,
  iteIdCodigo: 11815,
  rreIdCodigo: 529,
  dirIdCodigo: 3,
  fpaIdCodigo: 1,
  sqeDtSaque: null,
  sqeVlPrest: null,
  sqeDtPrest: null,
  sqeVlSaque: 325,
  sqeTipoSaque: 'N',
  sqeEfetivo: 'S',
  sqeDtPedido: '29/10/24',
  sqeLote: 166671,
  sqeAnoLote: null,
  stsIdCodigo: 1,
  sqeTerceiro: null,
  pesIdCodigo: null,
  pesPessoa: null,
  sqeUsuario: null,
  sqeEmpenho: null,
  sqeListaSiafem: null,
};

export const createChegadaDto = {
  RNU_ID_CODIGO: 1,
  RNU_INTREAL: '1',
  RNU_PARREAL: '1',
}



