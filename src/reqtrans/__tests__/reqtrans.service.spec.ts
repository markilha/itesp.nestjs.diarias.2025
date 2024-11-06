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

  describe('findAll', () => {
    it('deve retornar uma lista as requisições', async () => {
      const result = await service.findAll({});
      expect(result).toEqual([mockreqtrans]);
    });

    it('deve lançar uma HttpException se ocorrer um erro ao buscar das requsições', async () => {
      jest.spyOn(repository, 'find').mockRejectedValue(new Error());
      await expect(service.findAll({})).rejects.toThrow();
    });
  });

  describe('findOneOrFail', () => {
    it('deve retornar um requisicao ', async () => {
      const result = await service.findOne(1);
      expect(result).toEqual(mockreqtrans);
      expect(repository.findOneOrFail).toHaveBeenCalledWith({ where: { REQ_ID_CODIGO: 1 } });
    });
    it('deve lançar uma HttpException se a resquicão não for encontrado', async () => {
      jest.spyOn(repository, 'findOneOrFail').mockRejectedValue(new Error());
      await expect(service.findOne(100)).rejects.toThrow(HttpException);
    });
  });

  describe('updatereqStatus', () => {
    it('deve atualizar o status de uma requisição existente', async () => {
      const params: updateStatusDto = { REQ_ID_CODIGO: 1, REQ_STATUS: 'Novo Status' };
      const mockUpdatedReqTrans = { ...mockreqtrans, REQ_STATUS: params.REQ_STATUS };
      jest.spyOn(service, 'findOne');
      jest.spyOn(repository, 'save');
      const result = await service.updatereqStatus(params);
      expect(result).toEqual(mockUpdatedReqTrans);
      expect(service.findOne).toHaveBeenCalledWith(params.REQ_ID_CODIGO);
      expect(repository.save).toHaveBeenCalledWith({
        ...mockreqtrans,
        REQ_STATUS: params.REQ_STATUS,
      });
    });

    it('deve lançar uma HttpException se a requisição não for encontrada', async () => {
      const updateParams: updateStatusDto = {
        REQ_ID_CODIGO: 9999,
        REQ_STATUS: 'Novo Status',
      };
      jest.spyOn(service, 'findOne').mockRejectedValue(new Error());
      await expect(service.updatereqStatus(updateParams)).rejects.toThrow();
    });
  });

  describe('update', () => {
    it('deve atualizar a requisição se encontrada', async () => {
      jest.spyOn(repository, 'findOne');
      jest.spyOn(repository, 'update');
      const result = await service.update(mockreqtrans);
      expect(result).toEqual(mockreqtrans);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { REQ_ID_CODIGO: mockreqtrans.REQ_ID_CODIGO },
      });
      expect(repository.update).toHaveBeenCalledWith(
        { REQ_ID_CODIGO: mockreqtrans.REQ_ID_CODIGO },
        mockreqtrans,
      );
    });
  });

  describe('Cancelar uma requisição', () => {
    it('deve chamar updatereqStatus com os parâmetros corretos quando reqIdCodigo é fornecido', async () => {
      const reqIdCodigo = 1;
      jest.spyOn(service, 'updatereqStatus');
      const result = await service.cancela(reqIdCodigo);
      expect(service.updatereqStatus).toHaveBeenCalledWith({
        REQ_ID_CODIGO: reqIdCodigo,
        REQ_STATUS: 'CANCELADA',
      });
      expect(result).toEqual(mockreqtransCancelada);
    });
    it('deve lançar uma HttpException se o reqIdCodigo não for fornecido', async () => {
      jest.spyOn(service, 'updatereqStatus').mockRejectedValue(new Error());
      await expect(service.cancela(null)).rejects.toThrow(HttpException);
    });
  });
});
