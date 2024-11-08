import { Test, TestingModule } from '@nestjs/testing';
import { S001RequisicaoService } from '../s001_requisicao.service';
import { getRepositoryToken } from '@nestjs/typeorm';

import { ItinirarioService } from '../../itinirario/itinirario.service';
import { UfespService } from '../../ufesp/ufesp.service';

import { Repository } from 'typeorm';
import { RequisicaoEntity } from '../../database/db_oracle/entities/requisicao.entity';
import { SaquesMesService } from '../../saques-mes/saques-mes.service';
import { mockAprovadas, mockQueryBuilder, mockReqMes } from '../__mocks__/mocks';



describe('requsicaoService', () => {
  let requiservice: S001RequisicaoService;
  let requisicaoRepository: Repository<RequisicaoEntity>;
  // const mockQueryBuilder = {
  //   where: jest.fn().mockReturnThis(),
  //   andWhere: jest.fn().mockReturnThis(),
  //   getRawMany: jest.fn().mockResolvedValue(mockReqMes), 
  // };


    // Mock da data atual para testes consistentes
    const mockDate = new Date('2024-11-07T10:00:00Z');
    const originalDate = global.Date;
  
    beforeAll(() => {
      // Mock da data atual
      global.Date = class extends Date {
        constructor() {
          super();
          return mockDate;
        }
      } as any;
    });
  
    afterAll(() => {
      // Restaura a data original
      global.Date = originalDate;
    });
  

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        S001RequisicaoService,
        {
          provide: getRepositoryToken(RequisicaoEntity, 'oracleConnection'),
          useValue: {
            find: jest.fn().mockResolvedValue(mockAprovadas),
            findAllAprovadas: jest.fn(),
            findMesAtual: jest.fn().mockResolvedValue(mockReqMes),
            createQueryBuilder: jest.fn(() => mockQueryBuilder),
          },
        },
        {
          provide: ItinirarioService,
          useValue: {
            findRoute: jest.fn(),
          },
        },
        {
          provide: UfespService,
          useValue: {
            getCurrentValue: jest.fn(),
          },
        },
        {
          provide: SaquesMesService,
          useValue: {
            getCurrentValue: jest.fn(),
          },
        },
      ],
    }).compile();

    requiservice = module.get<S001RequisicaoService>(S001RequisicaoService);
    requisicaoRepository = module.get<Repository<RequisicaoEntity>>(
      getRepositoryToken(RequisicaoEntity, 'oracleConnection'),
    );
  });

  it('Deve ser definido', () => {
    expect(requiservice).toBeDefined();
    expect(requisicaoRepository).toBeDefined();
  });

  describe('findAllAprovadas', () => {
    it('Deve retornar todas as requisições aprovadas', async () => {
      const requisicoes = await requiservice.findAllAprovadas({ chapa: '000081' });
      expect(requisicoes).toEqual(mockAprovadas);
      expect(requisicaoRepository.find).toHaveBeenCalledTimes(1);
    });
    it('deve lançar uma HttpException se o reqIdCodigo não for fornecido', async () => {
      jest.spyOn(requiservice, 'findAllAprovadas').mockRejectedValue(new Error());
      await expect(requiservice.findAllAprovadas(null)).rejects.toThrow();     
    });
  });

  describe('findMesAtual', () => {
    it('deve retornar requisições do mês atual', async () => {     
      const result = await requiservice.findMesAtual({ chapa: '000081' });      
      expect(result).toEqual(mockReqMes);     
    });

    it('deve lançar HttpException quando ocorrer erro', async () => {
     
      jest.spyOn(requiservice, 'findMesAtual').mockRejectedValue(new Error());
      await expect(requiservice.findMesAtual(null)).rejects.toThrow();   
    });
   
  });
});
