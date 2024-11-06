import { Test, TestingModule } from '@nestjs/testing';
import { extornoService } from '../extorno.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { extornoEntity } from '../../database/db_oracle/entities/extorno.entity';
import { Repository } from 'typeorm';
import { mockEntityExtorno } from '../__mocks__/mocks';
import {  FindAllParams } from '../extornoDto';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('ExtornoService', () => {
  let service: extornoService;
  let extornoRepository: Repository<extornoEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        extornoService,
        {
          provide: getRepositoryToken(extornoEntity, 'oracleConnection'),
          useValue: {
            find: jest.fn().mockResolvedValue(mockEntityExtorno),
            findOneOrFail: jest.fn().mockResolvedValue(mockEntityExtorno[0]),
            create: jest.fn().mockReturnValue(mockEntityExtorno[0]),
            save: jest.fn().mockResolvedValue(mockEntityExtorno[0]),
            findOne: jest.fn().mockResolvedValue(mockEntityExtorno[0]),
            merge: jest.fn().mockResolvedValue(mockEntityExtorno[0]),
            delete: jest.fn().mockResolvedValue(mockEntityExtorno[0]),
            softDelete: jest.fn().mockResolvedValue(mockEntityExtorno[0]),
          },
        },
      ],
    }).compile();

    service = module.get<extornoService>(extornoService);
    extornoRepository = module.get<Repository<extornoEntity>>(
      getRepositoryToken(extornoEntity, 'oracleConnection'),
    );
  });

  it('deve ser definido', () => {
    expect(service).toBeDefined();
    expect(extornoRepository).toBeDefined();
  });

  describe('findAll', () => {
    it('Retornar extorno com paginação', async () => {
      const params: FindAllParams = {
        page: 1,
        limit: 10,
      };

      jest.spyOn(extornoRepository, 'find').mockResolvedValue(mockEntityExtorno);

      const result = await service.findAll(params);
      expect(result).toEqual(mockEntityExtorno);
      expect(extornoRepository.find).toHaveBeenCalledWith({
        where: {},
        skip: 0,
        take: 10,
      });
    });

    it('deve retornar uma execao', async () => {
      jest.spyOn(extornoRepository, 'find').mockRejectedValue(new Error('Database error'));
      await expect(service.findAll({})).rejects.toThrow(
        new HttpException('Database error', HttpStatus.INTERNAL_SERVER_ERROR),
      );
    });

    it('deveria retornar um array de extornos', async () => {
      const result = await service.findAll({ SQE_ID_CODIGO: mockEntityExtorno[0].SQE_ID_CODIGO });
      expect(result).toEqual(mockEntityExtorno);
      expect(extornoRepository.find).toHaveBeenCalledTimes(1);
    });

    it('deve retornar uma execao', async () => {
      jest.spyOn(extornoRepository, 'find').mockRejectedValueOnce(new Error());
      await expect(service.findAll({})).rejects.toThrow();
    });
  });

  describe('findOneOrFail', () => {
    it('deve retornar um extorno', async () => {
      const result = await service.findOneOrFail(mockEntityExtorno[0].SQE_ID_CODIGO);
      expect(result).toEqual(mockEntityExtorno[0]);
      expect(extornoRepository.findOneOrFail).toHaveBeenCalledTimes(1);
    });

    it('deve retornar uma execao', () => {
      jest.spyOn(extornoRepository, 'findOneOrFail').mockRejectedValueOnce(new Error());
      expect(service.findOneOrFail(9999)).rejects.toThrow();
    });
  });

  describe('create', () => {   
    it('deve retornar um extorno', async () => {
      const result = await service.create(mockEntityExtorno[0]);
      expect(result).toEqual(mockEntityExtorno[0]);
      expect(extornoRepository.create).toHaveBeenCalledTimes(1);
      expect(extornoRepository.save).toHaveBeenCalledTimes(1);
    });

    it('deve retornar uma exceção ao falhar ao salvar', async () => {
      jest.spyOn(extornoRepository, 'save').mockRejectedValueOnce(new Error());
      await expect(service.create(mockEntityExtorno[0])).rejects.toThrow();
    });
  });

  describe('update', () => {
    it('deve retornar um extorno', async () => {
      const result = await service.update(mockEntityExtorno[0]);
      expect(result).toEqual(mockEntityExtorno[0]);
      expect(extornoRepository.findOneOrFail).toHaveBeenCalledTimes(1);
      expect(extornoRepository.merge).toHaveBeenCalledTimes(1);
    });
    it('deve retornar uma exceção ao falhar ao salvar', async () => {
      jest.spyOn(extornoRepository, 'save').mockRejectedValueOnce(new Error());
      await expect(service.update(mockEntityExtorno[0])).rejects.toThrow();
    });
  }); 
});
