import { Test, TestingModule } from '@nestjs/testing';
import { PrazosService } from '../Prazos.service';
import { PrazosEntity } from '../../database/db_oracle/entities/Prazos.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { mocksPpessoa, mocksPrazos } from '../__mocks__/mocks';
import { HttpException, HttpStatus } from '@nestjs/common';
import { PpessoaService } from '../../ppessoa/ppessoa.service';

describe('PrazosService', () => {
  let prazosservice: PrazosService;
  let repository: Repository<PrazosEntity>;
  let ppessoaservice: PpessoaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrazosService,
        {
          provide: getRepositoryToken(PrazosEntity, 'oracleConnection'),
          useValue: {
            find: jest.fn().mockResolvedValue(mocksPrazos),
            findOneOrFail: jest.fn().mockResolvedValue(mocksPrazos[0]),
            findmes: jest.fn().mockResolvedValue(mocksPrazos),
          },
        },
        PpessoaService,
        {
          provide: PpessoaService,
          useValue: {
            find: jest.fn().mockResolvedValue(mocksPpessoa),
          },
        },
      ],
    }).compile();

    prazosservice = module.get<PrazosService>(PrazosService);
    repository = module.get<Repository<PrazosEntity>>(
      getRepositoryToken(PrazosEntity, 'oracleConnection'),
    );
    ppessoaservice = module.get<PpessoaService>(PpessoaService);
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

  describe('Prazos Meses', () => {
    it('Deve retornar uma lista de prazos para o mês', async () => {
      const params = { chapa: '000081', data: new Date('2024-02-27') };
      const result = await prazosservice.findmes(params);
      expect(result).toEqual(mocksPrazos);
      expect(ppessoaservice.find).toHaveBeenCalledWith({ chapa: params.chapa });
    });

    it('Deve retornar erro quando nenhum prazo é encontrado', async () => {
      jest
        .spyOn(ppessoaservice, 'find')
        .mockRejectedValue(
          new HttpException('Funcionário não encontrado!!!', HttpStatus.INTERNAL_SERVER_ERROR),
        );
      await expect(prazosservice.findmes({ chapa: '123' })).rejects.toThrow(
        'Funcionário não encontrado!!!',
      );
    });
  });
});
