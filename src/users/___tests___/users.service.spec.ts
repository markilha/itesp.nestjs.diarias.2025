import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from '../../database/db_mysql/entities/user.entity';
import { Repository } from 'typeorm';
import { userEntityMock } from '../__mocks__/user.mock';

describe('UsersService', () => {
  let service: UsersService;
  let useRepository: Repository<UserEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(UserEntity, 'mysqlConnection'),
          useValue: {
            findOne: jest.fn().mockResolvedValue(userEntityMock),
            findByUserName: jest.fn().mockResolvedValue(userEntityMock),
            findAll: jest.fn().mockResolvedValue([userEntityMock]),
            find: jest.fn().mockResolvedValue([userEntityMock]),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    useRepository = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity, 'mysqlConnection'),
    );
  });

  it('deve ser definido', () => {
    expect(service).toBeDefined();
    expect(useRepository).toBeDefined();
  });

  it('Busca por id', async () => {
    const user = await service.findOne(userEntityMock.id_usuario);
    expect(user).toEqual(userEntityMock);
  });

  it('busca por nome', async () => {
    const user = await service.findByUserName(userEntityMock.login);
    expect(user).toEqual(userEntityMock);
  });

  it('Retornar todos usuarios', async () => {
    const users = await service.findAll({ nome: userEntityMock.nome, login: userEntityMock.login });
    expect(users).toEqual([userEntityMock]);
  });
  
  it('Erro ao retornar usuario', async () => {
    jest.spyOn(useRepository, 'findOne').mockRejectedValue(null);
    expect(service.findOne(userEntityMock.id_usuario)).rejects.toBeNull();
  });
  
  it('Erro ao retornar usuario - requisição', async () => {
    jest.spyOn(useRepository, 'findOne').mockRejectedValueOnce(new Error());
    expect(service.findOne(userEntityMock.id_usuario)).rejects.toThrowError();
  });
});
