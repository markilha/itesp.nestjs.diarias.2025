import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from '../../database/db_mysql/entities/user.entity';
import { Repository } from 'typeorm';
import { userEntityMock, userMockResult } from '../__mocks__/user.mock';
import { HttpException, HttpStatus } from '@nestjs/common';

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
    await expect(service.findOne({ id_usuario: userEntityMock.id_usuario })).rejects.toThrow();
  });

  it('busca por nome', async () => {
    const user = await service.findByUserName(userEntityMock.login);
    expect(user).toEqual(userEntityMock);
  });

  it('Retornar todos usuarios', async () => {
    const users = await service.findAll({ nome: 'fulano de almeida', login: 'fulano' });
    expect(users).toEqual(userMockResult);
  });

  it('Erro ao retornar usuario', async () => {
    jest.spyOn(useRepository, 'findOne').mockRejectedValue(null);
    expect(service.findOne({ id_usuario: userEntityMock.id_usuario })).rejects.toThrow();
  });

  it('Erro ao retornar usuario - requisição', async () => {
    jest.spyOn(useRepository, 'findOne').mockRejectedValueOnce(new Error());
    expect(service.findOne({ id_usuario: userEntityMock.id_usuario })).rejects.toThrow();
  });
});
