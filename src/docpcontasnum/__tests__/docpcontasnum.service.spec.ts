import { Test, TestingModule } from '@nestjs/testing';
import { docpcontasnumService } from '../docpcontasnum.service';
import { docpcontasnumEntity } from '../../database/db_oracle/entities/docpcontasnum.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { mockDocpcontasnum, mockDocResponse } from '../__mocks__/mocks';

describe('docpcontasnumService', () => {
  let docpcontasnumservice: docpcontasnumService;
  let repository: Repository<docpcontasnumEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        docpcontasnumService,
        {
          provide: getRepositoryToken(docpcontasnumEntity, 'oracleConnection'),
          useValue: {
            find: jest.fn().mockResolvedValue(mockDocpcontasnum),
            findOne: jest.fn().mockResolvedValue(mockDocpcontasnum[0]),
            findOneOrFail: jest.fn().mockResolvedValue(mockDocpcontasnum[0]),
          },
        },
      ],
    }).compile();

    docpcontasnumservice = module.get<docpcontasnumService>(docpcontasnumService);
    repository = module.get<Repository<docpcontasnumEntity>>(
      getRepositoryToken(docpcontasnumEntity, 'oracleConnection'),
    );
  });

  it('deve ser definido', () => {
    expect(docpcontasnumservice).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('findAll', () => {
    it('deve retornar uma lista os documentos', async () => {
      const result = await docpcontasnumservice.findAll({});
      expect(result).toEqual(mockDocResponse);
    });

    it('deve lançar uma HttpException se ocorrer um erro ao buscar das requsições', async () => {
      jest.spyOn(repository, 'find').mockRejectedValue(new Error());
      await expect(docpcontasnumservice.findAll({})).rejects.toThrow();
    });
  });

  describe('findOne', () => {
    it('deve retornar uma documento pelo sqe_id_codigo', async () => {
      const result = await docpcontasnumservice.findOne(142577);
      expect(result).toEqual(mockDocpcontasnum[0]);
      expect(repository.findOneOrFail).toHaveBeenCalledTimes(1);
    });

    it('deve lançar uma exceção se o registro não for encontrado', async () => {
      jest.spyOn(repository, 'findOneOrFail').mockRejectedValue(new Error());
      await expect(docpcontasnumservice.findOne(1)).rejects.toThrow();
    });
  });
});
