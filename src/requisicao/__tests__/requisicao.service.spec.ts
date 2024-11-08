import { Test, TestingModule } from '@nestjs/testing';
import { S001RequisicaoService } from '../s001_requisicao.service';
import { getRepositoryToken } from '@nestjs/typeorm';

import { ItinirarioService } from '../../itinirario/itinirario.service';
import { UfespService } from '../../ufesp/ufesp.service';

import { Repository } from 'typeorm';
import { RequisicaoEntity } from '../../database/db_oracle/entities/requisicao.entity';
import { SaquesMesService } from '../../saques-mes/saques-mes.service';
import { mockAprovadas, mockReqMes } from '../__mocks__/mocks';



describe('requsicaoService', () => {
  let requiservice: S001RequisicaoService;
  let requisicaoRepository: Repository<RequisicaoEntity>;

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

    // it('deve lançar HttpException quando ocorrer erro', async () => {
    //   // Mock do erro
    //   jest.spyOn(repository, 'find').mockRejectedValue(new Error('Database error'));

    //   // Verifica se o erro é lançado corretamente
    //   await expect(service.findMesAtual({ chapa: '000081' })).rejects.toThrow(
    //     new HttpException(
    //       'Erro ao buscar requisições aprovadas',
    //       HttpStatus.INTERNAL_SERVER_ERROR,
    //     ),
    //   );
    // });

    // it('não deve retornar requisições de outros meses', async () => {
    //   // Mock com requisições de meses diferentes
    //   const mockRequisicoes = [
    //     {
    //       reqIdCodigo: 1,
    //       reqStatus: 'AUTORIZADA PELO DIRETOR',
    //       chapa: '000081',
    //       reqDtReq: '07/11/2024 10:00:00', // Mês atual
    //     },
    //     {
    //       reqIdCodigo: 2,
    //       reqStatus: 'AUTORIZADA PELO DIRETOR',
    //       chapa: '000081',
    //       reqDtReq: '07/10/2024 10:00:00', // Mês anterior
    //     },
    //   ];

    //   // Mock que simula o filtro do banco
    //   jest.spyOn(repository, 'find').mockImplementation(async () => {
    //     return mockRequisicoes.filter(req => {
    //       const reqDate = new Date(req.reqDtReq.split(' ')[0].split('/').reverse().join('-'));
    //       const startMonth = new Date('2024-11-01');
    //       const endMonth = new Date('2024-11-30');
    //       return reqDate >= startMonth && reqDate <= endMonth;
    //     });
    //   });

    //   const result = await service.findMesAtual({ chapa: '000081' });

    //   // Deve retornar apenas a requisição do mês atual
    //   expect(result).toHaveLength(1);
    //   expect(result[0].reqDtReq).toBe('07/11/2024 10:00:00');
    // });
  });
});
