import { Test, TestingModule } from '@nestjs/testing';
import { naotrabService } from '../naotrab.service';
import { naotrabEntity } from '../../database/db_oracle/entities/naotrab.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

import { HttpException, HttpStatus } from '@nestjs/common';

const mockRegistro = {
  NAO_ID_CODIGO: 1,
  REQ_ID_CODIGO: 2,
  NAO_INICIO: new Date('2011-09-22'),
  NAO_FIM: new Date('2011-09-22'),
  EFE_INICIO: new Date('2011-09-22'),
  EFE_FIM: new Date('2011-09-22'),
};

describe('naotrabService', () => {
  let service: naotrabService;
  let repository: Repository<naotrabEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        naotrabService,
        {
          provide: getRepositoryToken(naotrabEntity, 'oracleConnection'),
          useValue: {
            createQueryBuilder: jest.fn().mockReturnThis(),
            select: jest.fn().mockReturnThis(),
            leftJoin: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            andWhere: jest.fn().mockReturnThis(),
            getParameters: jest.fn().mockReturnValue({}),
            query: jest.fn().mockResolvedValue([]),
            getQuery: jest.fn().mockReturnValue(''),
            getOne: jest.fn().mockResolvedValue(null),
            find: jest.fn().mockResolvedValue([mockRegistro]),
          },
        },
      ],
    }).compile();

    service = module.get<naotrabService>(naotrabService);
    repository = module.get<Repository<naotrabEntity>>(
      getRepositoryToken(naotrabEntity, 'oracleConnection'),
    );
  });

  it('deve ser definido', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('findOne', () => {
    const setupFindOneTest = (mockValue: naotrabEntity | null, error?: Error) => {
      jest.spyOn(repository, 'createQueryBuilder').mockReturnValue({
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockImplementation(() => {
          if (error) throw error;
          return Promise.resolve(mockValue);
        }),
      } as any);
    };

    it('deve retornar um registro quando encontrar no banco', async () => {
      setupFindOneTest(mockRegistro);
      const result = await service.findOne(2);
      expect(result).toEqual([mockRegistro]);
      expect(repository.find).toHaveBeenCalledTimes(1);
    });

    it('deve lançar uma exceção se não encontrar o registro', async () => {
      // Mock do repositório para retornar um array vazio
      jest.spyOn(repository, 'find').mockResolvedValueOnce([]);

      // Verifica se a exceção é lançada
      await expect(service.findOne(124421111)).rejects.toThrow(
        new HttpException('Horas não trabalhadas não encontrada', HttpStatus.NOT_FOUND),
      );
    });
  });
});
