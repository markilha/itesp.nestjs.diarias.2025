import { Test, TestingModule } from '@nestjs/testing';
import { PcargoService } from '../pcargo.service';
import { PcargoEntity } from '../../database/db_oracle/entities/pcargo.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HttpException } from '@nestjs/common';
import { PcargoDto, FindAllParams } from '../pcargoDto';
import { mockParams, mockResult } from '../__mocks__/mocks';

describe('PcargoService', () => {
  let service: PcargoService;
  let repository: Repository<PcargoEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PcargoService,
        {
          provide: getRepositoryToken(PcargoEntity, 'oracleConnection'),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<PcargoService>(PcargoService);
    repository = module.get<Repository<PcargoEntity>>(getRepositoryToken(PcargoEntity, 'oracleConnection'));
  });

  describe('findAll', () => {
    it('deve retornar uma lista de cargos quando os parâmetros de busca forem válidos', async () => {    

      jest.spyOn(repository, 'find').mockResolvedValue(mockResult as PcargoEntity[]);

      const result = await service.findAll(mockParams);

      expect(result).toEqual(mockResult);
      expect(repository.find).toHaveBeenCalledWith({
        where: { codigo: '123' },
        skip: 0,
        take: 10,
      });
    });

    it('deve lançar uma HttpException se ocorrer um erro ao buscar os cargos', async () => {
      const mockParams: FindAllParams = { codigo: '123', page: 1, limit: 10 };
      jest.spyOn(repository, 'find').mockRejectedValue(new Error('Erro'));

      await expect(service.findAll(mockParams)).rejects.toThrow(HttpException);
    });
  });

  describe('findOneOrFail', () => {
    it('deve retornar um cargo quando o código for válido', async () => {
      const codigo = '123';
      const mockResult: PcargoDto = { codigo: '123', nome: 'Cargo de Teste' };
  
      jest.spyOn(repository, 'findOneOrFail').mockResolvedValue(mockResult as PcargoEntity);
  
      const result = await service.findOne(codigo);
  
      expect(result).toEqual(mockResult);
      expect(repository.findOneOrFail).toHaveBeenCalledWith({ where: { codigo } });
    });
  
    it('deve lançar uma HttpException se o cargo não for encontrado', async () => {
      const codigo = '123';
  
      // Mock para lançar erro simulando que o cargo não foi encontrado
      jest.spyOn(repository, 'findOneOrFail').mockRejectedValue(new Error('Cargo não encontrado'));
  
      await expect(service.findOne(codigo)).rejects.toThrow(HttpException);
    });
  });
  
});
