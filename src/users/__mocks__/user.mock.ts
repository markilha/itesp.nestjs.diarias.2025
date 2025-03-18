import { AuthUserDto } from 'src/auth/use.auth.Dto';
import { UserEntity } from '../../database/db_mysql/entities/user.entity';

export const userEntityMock: UserEntity = {
  id_usuario: 1,
  nome: 'fulano de almeida',
  chapa: '000081',
  login: 'fulano',
  senha: '123456',
};

export const userMockResult = {
  data: [{ chapa: '000081', id_usuario: 1, login: 'fulano', nome: 'fulano de almeida' }],
  total: 1,
};

export const userAuthMock: AuthUserDto = {
  sub: 1,
  login: 'AISOUZA',
  chapa: '000081',
  roles: [],
  permissao: 8,
  codsecao: '1.3.02.07.04.17.00',
};
