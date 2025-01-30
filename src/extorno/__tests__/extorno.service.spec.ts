import { Test, TestingModule } from '@nestjs/testing';
import { extornoService } from '../extorno.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { extornoEntity } from '../../database/db_oracle/entities/extorno.entity';
import { Repository } from 'typeorm';
import { mockEntityExtorno } from '../__mocks__/mocks';
import { FindAllParams } from '../extornoDto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { SaqueService } from '../../saque/saque.service';
import { ErrorMessages } from '../../components/error/error.constants';
import { find, merge } from 'rxjs';

const mockRegistro: extornoEntity = {
  SQE_ID_CODIGO: 1,
  ITE_ID_CODIGO: 43155,
  RRE_ID_CODIGO: 58167,
  DIR_ID_CODIGO: 4,
  PCO_ID_CODIGO: 2,
  FPA_ID_CODIGO: null,
  EXT_VALOR: 25.82,
  EXT_DATA: '19/11/2012 13:08:39',
  EXT_JUSTIFICA: '',
};

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
            createQueryBuilder: jest.fn().mockReturnThis(),
            select: jest.fn().mockReturnThis(),
            leftJoin: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            andWhere: jest.fn().mockReturnThis(),
            getParameters: jest.fn().mockReturnValue({}),
            query: jest.fn().mockResolvedValue([]),
            getQuery: jest.fn().mockReturnValue(''),
            getOne: jest.fn().mockResolvedValue(null),
            findOneOrFail: jest.fn().mockResolvedValue(mockRegistro),
            findOne: jest.fn().mockResolvedValue(mockRegistro),
            create: jest.fn().mockReturnValue(mockRegistro),
            save: jest.fn().mockReturnValue(mockRegistro),
            merge: jest.fn().mockReturnValue(mockRegistro),

          },
        },
        SaqueService,
        {
          provide: SaqueService,
          useValue: {
            findOne: jest.fn(),
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
    it('deve retornar uma matriz de docpcontasnumEntity', async () => {
      const result = [];
      jest.spyOn(extornoRepository, 'query').mockResolvedValue(result);

      const params = { page: 1, limit: 500 };

      expect(await service.findAll(params)).toBe(result);
      expect(extornoRepository.createQueryBuilder).toHaveBeenCalled();
    });

    it('deve lançar uma HttpException se ocorrer um erro', async () => {
      jest
        .spyOn(extornoRepository, 'query')
        .mockRejectedValue(new Error(ErrorMessages.INTERNAL_ERROR));
      const params = { page: 1, limit: 500 };
      await expect(service.findAll(params)).rejects.toThrow(
        new HttpException(ErrorMessages.INTERNAL_ERROR, HttpStatus.INTERNAL_SERVER_ERROR),
      );
    });
  });

  describe('findOneOrFail', () => {
    const setupFindOneTest = (mockValue: extornoEntity | null, error?: Error) => {
      jest.spyOn(extornoRepository, 'createQueryBuilder').mockReturnValue({
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockImplementation(() => {
          if (error) throw error;
          return Promise.resolve(mockValue);
        }),
      } as any);
    };

    it('deve retornar um registro quando encontrar no banco', async () => {
      setupFindOneTest(mockRegistro);
      const result = await service.findOneOrFail(1);
      expect(result).toEqual(mockRegistro);
      expect(extornoRepository.createQueryBuilder().getOne).toHaveBeenCalled();
    });
   
  });

  describe('findOne', () => {
    const setupFindOneTest = (mockValue: extornoEntity | null, error?: Error) => {
      jest.spyOn(extornoRepository, 'createQueryBuilder').mockReturnValue({
        select: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockImplementation(() => {
          if (error) throw error;
          return Promise.resolve(mockValue);
        }),
      } as any);
    };

    it('deve retornar um registro quando encontrar no banco', async () => {
      setupFindOneTest(mockRegistro);
      const result = await service.findOne(1,2);
      expect(result).toEqual(mockRegistro);
      expect(extornoRepository.createQueryBuilder().getOne).toHaveBeenCalled();
    });
   
  });
 
  describe('create', () => {
    it('deve retornar um extorno', async () => {
      const result = await service.create(mockRegistro);
      expect(result).toEqual(mockRegistro);
      expect(extornoRepository.create).toHaveBeenCalledTimes(1);
      expect(extornoRepository.save).toHaveBeenCalledTimes(1);
    });

    it('deve lançar uma HttpException salvar', async () => {
         jest.spyOn(extornoRepository, 'save').mockRejectedValue(new Error(`${ErrorMessages.INTERNAL_ERROR}: create extorno`));         
         await expect(service.create(null)).rejects.toThrow(
           new HttpException(`Erro ao criar extorno`, HttpStatus.INTERNAL_SERVER_ERROR),
         );
       });
  });

  describe('update', () => {
    it('deve retornar um extorno', async () => {
      // Mock da resposta do método findOne
      jest.spyOn(service, 'findOne').mockResolvedValue(mockRegistro);  
      // Mock da resposta do método save
      jest.spyOn(extornoRepository, 'save').mockResolvedValue(mockRegistro);  
      // Chamando o método update
      const result = await service.update(mockRegistro);
  
      // Validando os resultados
      expect(result).toEqual(mockRegistro);
      expect(service.findOne).toHaveBeenCalledTimes(1);
      expect(extornoRepository.merge).toHaveBeenCalledTimes(1);
      expect(extornoRepository.save).toHaveBeenCalledTimes(1);
    });
  
    it('deve retornar uma exceção ao falhar ao salvar', async () => {     
      jest.spyOn(extornoRepository, 'save').mockRejectedValueOnce(new Error('Erro ao Atualizar extorno')); 
      await expect(service.update(mockEntityExtorno[0])).rejects.toThrow('Erro ao Atualizar extorno');
    });
  });
  
});
