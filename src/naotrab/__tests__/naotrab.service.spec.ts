import { Test, TestingModule } from '@nestjs/testing';
import { naotrabService } from '../naotrab.service';
import { naotrabEntity } from '../../database/db_oracle/entities/naotrab.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { mocksnaotrab } from '../__mocks__/mocks';
import { HttpException } from '@nestjs/common';


describe('naotrabService', () => {
  let naotrabservice: naotrabService;
  let repository: Repository<naotrabEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        naotrabService,
        {
          provide: getRepositoryToken(naotrabEntity, 'oracleConnection'),
          useValue:{           
            findOneOrFail: jest.fn().mockResolvedValue(mocksnaotrab[0]),          
          }
        },
      ],
    }).compile();

    naotrabservice = module.get<naotrabService>(naotrabService);
    repository = module.get<Repository<naotrabEntity>>(getRepositoryToken(naotrabEntity, 'oracleConnection'));
  });

  it('deve ser definido', () => {
    expect(naotrabservice).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('findOneOrFail', () => {
    it('deve retornar as horas não trabalhadas ', async () => {
      const result = await naotrabservice.findOne(1);
      expect(result).toEqual(mocksnaotrab[0]);
      expect(repository.findOneOrFail).toHaveBeenCalledWith({ where: { REQ_ID_CODIGO: 1 } });
    });
    it('deve lançar uma HttpException se a resquicão não for encontrado', async () => {
      jest.spyOn(repository, 'findOneOrFail').mockRejectedValue(new Error());
      await expect(naotrabservice.findOne(100)).rejects.toThrow(HttpException);
    });
  });

  
});
