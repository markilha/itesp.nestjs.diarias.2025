import { Test, TestingModule } from '@nestjs/testing';
import { PrazosService } from '../Prazos.service';
import { PrazosEntity } from '../../database/db_oracle/entities/Prazos.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { mocksPrazos } from '../__mocks__/mocks';
import { HttpException } from '@nestjs/common';


describe('PrazosService', () => {
  let prazosservice: PrazosService;
  let repository: Repository<PrazosEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrazosService,
        {
          provide: getRepositoryToken(PrazosEntity, 'oracleConnection'),
          useValue:{
            find: jest.fn().mockResolvedValue(mocksPrazos),
            findOneOrFail: jest.fn().mockResolvedValue(mocksPrazos[0]),          
          }
        },
      ],
    }).compile();

    prazosservice = module.get<PrazosService>(PrazosService);
    repository = module.get<Repository<PrazosEntity>>(getRepositoryToken(PrazosEntity, 'oracleConnection'));
  });

  it('deve ser definido', () => {
    expect(prazosservice).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('findAll', () => {
    it('deve retornar uma lista as requisições', async () => {
      const result = await prazosservice.findAll({});
      expect(result).toEqual(mocksPrazos);
    });

    it('deve lançar uma HttpException se ocorrer um erro ao buscar das requsições', async () => {
      jest.spyOn(repository, 'find').mockRejectedValue(new Error());
      await expect(prazosservice.findAll({})).rejects.toThrow();
    });
  });

  describe('findOneOrFail', () => {
    it('deve retornar um requisicao ', async () => {
      const result = await prazosservice.findOne(1);
      expect(result).toEqual(mocksPrazos[0]);
      expect(repository.findOneOrFail).toHaveBeenCalledWith({ where: { PRA_ID_CODIGO: 1 } });
    });
    it('deve lançar uma HttpException se a resquicão não for encontrado', async () => {
      jest.spyOn(repository, 'findOneOrFail').mockRejectedValue(new Error());
      await expect(prazosservice.findOne(100)).rejects.toThrow(HttpException);
    });
  });

  
});
