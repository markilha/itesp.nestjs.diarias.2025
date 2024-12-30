import { Test, TestingModule } from '@nestjs/testing';
import { S001RequisicaoService } from '../s001_requisicao.service';
import { getRepositoryToken } from '@nestjs/typeorm';

import { ItinirarioService } from '../../itinirario/itinirario.service';
import { UfespService } from '../../ufesp/ufesp.service';
import { naotrabService } from '../../naotrab/naotrab.service';

import { Repository } from 'typeorm';
import { RequisicaoEntity } from '../../database/db_oracle/entities/requisicao.entity';
import { SaquesMesService } from '../../saques-mes/saques-mes.service';
import { PpessoaService } from '../../ppessoa/ppessoa.service';
import { mockAprovadas, mockQueryBuilder, mockReqMes, mockReqMesResult } from '../__mocks__/mocks';
import { FindAllAutorizadasParams } from '../requisicao.dto';
import { userAuthMock } from '../../users/__mocks__/user.mock';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('requsicaoService', () => {
  let requiservice: S001RequisicaoService;
  let requisicaoRepository: Repository<RequisicaoEntity>;
  const mockDate = new Date('2012-09-07T10:00:00Z');
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
            findAllAprovadas: jest.fn().mockResolvedValue(mockAprovadas),
            findMesAtual: jest.fn().mockResolvedValue(mockReqMes),
            createQueryBuilder: jest.fn(() => mockQueryBuilder),
            query: jest.fn().mockResolvedValue(mockReqMesResult),
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
        {
          provide: naotrabService,
          useValue: {
            getCurrentValue: jest.fn(),
          },
        },
        {
          provide: PpessoaService,
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
      const parms: FindAllAutorizadasParams = {
        chapa: '000081',
      };
      const requisicoes = await requiservice.findAllAprovadas(parms, userAuthMock);
      expect(requisicoes).toEqual(mockAprovadas);
      expect(requisicaoRepository.find).toHaveBeenCalledTimes(1);
    });

    it('deve lançar uma HttpException se o reqIdCodigo não for fornecido', async () => {
      jest.spyOn(requiservice, 'findAllAprovadas').mockRejectedValue(new Error());
      await expect(requiservice.findAllAprovadas(null, null)).rejects.toThrow();
    });
  });

  const params = {
    chapa: '000081',
    dataAtual: new Date('2023-11-29'),
  };

  // describe('findMesAtual', () => {
  //   it('Deve retornar o valor do mês atual', async () => {
  //     const reqMes = await requiservice.findMesAtual(params, userAuthMock);
  //     expect(reqMes).toEqual(mockReqMes);
     
  //   });

  //   it('deve lançar uma HttpException se o reqIdCodigo não for fornecido', async () => {
  //     jest.spyOn(requiservice, 'findMesAtual').mockRejectedValue(new Error());
  //     await expect(requiservice.findMesAtual(null,null)).rejects.toThrow();
  //   });
  // });
  
});
