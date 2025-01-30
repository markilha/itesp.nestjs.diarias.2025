import { Test, TestingModule } from '@nestjs/testing';
import { reqtransService } from '../reqtrans.service';
import { reqtransEntity } from '../../database/db_oracle/entities/requisicaoTrans.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HttpException } from '@nestjs/common';
import { mockreqtrans, mockreqtransCancelada } from '../__mocks__/mocks';
import { updateStatusDto } from '../reqtransDto';

describe('reqtransService', () => {
  let service: reqtransService;
  let repository: Repository<reqtransEntity>;
  

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        reqtransService,
        {
          provide: getRepositoryToken(reqtransEntity, 'oracleConnection'),
          useValue: {
            find: jest.fn().mockResolvedValue([mockreqtrans]),
            findAll: jest.fn().mockResolvedValue([mockreqtrans]),
            findOneOrFail: jest.fn().mockResolvedValue(mockreqtrans),
            save: jest.fn().mockResolvedValue(mockreqtrans),
            findOne: jest.fn().mockResolvedValue(mockreqtrans),
            update: jest.fn().mockResolvedValue(mockreqtrans),
            updatereqStatus: jest.fn().mockResolvedValue(mockreqtrans),
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
    service = module.get<reqtransService>(reqtransService);
    repository = module.get<Repository<reqtransEntity>>(
      getRepositoryToken(reqtransEntity, 'oracleConnection'),
    );
  });

  it('deve ser definido', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  // create
  describe('create', () => {
    it('deve criar uma nova requisição', async () => {
      service.create = jest.fn().mockResolvedValueOnce(mockreqtrans);
      const result = await service.create(mockreqtrans);     
      expect(result).toEqual(mockreqtrans);
    });

    it('deve lançar uma HttpException se ocorrer um erro ao criar a requisição', async () => {     
      service.create = jest.fn().mockRejectedValueOnce(new Error());
      await expect(service.create(mockreqtrans)).rejects.toThrow();
    });
  });

  describe('findAll', () => {
    it('deve retornar uma lista as requisições', async () => {
      service.findAll = jest.fn().mockReturnValueOnce([mockreqtrans]);
      const result = await service.findAll({});
      expect(result).toEqual([mockreqtrans]);
    }
    );    

    it('deve lançar uma HttpException se ocorrer um erro ao buscar das requsições', async () => {
      service.findAll = jest.fn().mockRejectedValueOnce(new Error());
      await expect(service.findAll(mockreqtrans)).rejects.toThrow();
    });
  });

  describe('findOneOrFail', () => {
    it('deve retornar um requisicao ', async () => {
    service.findOne = jest.fn().mockReturnValueOnce(mockreqtrans);
    const result = await service.findOne(1);
    expect(result).toEqual(mockreqtrans);
    });
   
    it('deve lançar uma HttpException se a resquicão não for encontrado', async () => {
      jest.spyOn(repository, 'findOneOrFail').mockRejectedValue(new Error());
      await expect(service.findOne(100)).rejects.toThrow(HttpException);
    });
  });

 


});
