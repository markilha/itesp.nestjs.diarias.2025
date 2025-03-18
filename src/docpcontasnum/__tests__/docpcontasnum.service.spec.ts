import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { docpcontasnumService } from '../docpcontasnum.service';
import { docpcontasnumEntity } from '../../database/db_oracle/entities/docpcontasnum.entity';
import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorMessages } from '../../components/error/error.constants';

const user = {
  sub: 1,
  login: 'AISOUZA',
  chapa: '000081',
  roles: [],
  permissao: 8,
  codsecao: '1.3.02.07.04.17.00',
};

const mockRegistro: docpcontasnumEntity = {
  SQE_ID_CODIGO: 1,
  NOME: 'Registro Teste',
  NDO_ID_CODIGO: 1,
  PCO_ID_CODIGO: 1,
  NDO_ID_NUMERO: '1',
  NDO_DATA: new Date(),
  CHAPA: '000081',
};

describe('docpcontasnumService', () => {
  let service: docpcontasnumService;
  let repository: Repository<docpcontasnumEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        docpcontasnumService,
        {
          provide: getRepositoryToken(docpcontasnumEntity, 'oracleConnection'),
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
          },
        },
      ],
    }).compile();

    service = module.get<docpcontasnumService>(docpcontasnumService);
    repository = module.get<Repository<docpcontasnumEntity>>(
      getRepositoryToken(docpcontasnumEntity, 'oracleConnection'),
    );
  });

  it('deve ser definido', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('deve retornar uma matriz de docpcontasnumEntity', async () => {
      const result = [];
      jest.spyOn(repository, 'query').mockResolvedValue(result);

      const params = { page: 1, limit: 500 };

      expect(await service.findAll(params, user)).toBe(result);
      expect(repository.createQueryBuilder).toHaveBeenCalled();
    });

    it('deve lançar uma HttpException se ocorrer um erro', async () => {
      jest.spyOn(repository, 'query').mockRejectedValue(new Error('Database error'));
      const params = { page: 1, limit: 500 };
      await expect(service.findAll(params, user)).rejects.toThrow(
        new HttpException(ErrorMessages.INTERNAL_ERROR, HttpStatus.INTERNAL_SERVER_ERROR),
      );
    });
  });

  describe('findOne', () => {
    const setupFindOneTest = (mockValue: docpcontasnumEntity | null, error?: Error) => {
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
      const result = await service.findOne(1);
      expect(result).toEqual(mockRegistro);
      expect(repository.createQueryBuilder().getOne).toHaveBeenCalled();
    });

    it('deve lançar uma exceção se não encontrar o registro', async () => {
      setupFindOneTest(null);
      await expect(service.findOne(1)).rejects.toThrow(
        new HttpException(ErrorMessages.NOT_FOUND, HttpStatus.NOT_FOUND),
      );
    });

    it('deve lançar uma exceção se ocorrer um erro inesperado', async () => {
      setupFindOneTest(null, new Error('Erro inesperado'));
      await expect(service.findOne(1)).rejects.toThrow(
        new HttpException(ErrorMessages.INTERNAL_ERROR, HttpStatus.INTERNAL_SERVER_ERROR),
      );
    });
  });
});
