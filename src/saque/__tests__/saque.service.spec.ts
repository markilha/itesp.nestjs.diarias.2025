import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { SaqueService } from '../saque.service';

import { documentosService as DocumentosService } from '../../documentos/documento.service';

import { FindParamsSaque } from '../saque.dto';
import { returnSaqueDto } from '../saque.dto';
import { Repository } from 'typeorm';
import { SaqueEntity } from '../../database/db_oracle/entities/saque.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MotivodiariaService } from '../../motivodiaria/motivodiaria.service';
import { ReqnumerarioService } from '../../reqnumerario/reqnumerario.service';
import { reembolsoService } from '../../reembolso/reembolso.service';
import { extornoService } from '../../extorno/extorno.service';
import { reqtransService } from '../../reqtrans/reqtrans.service';
import { ItinirarioService } from '../../itinirario/itinirario.service';
import { UfespService } from '../../ufesp/ufesp.service';
import { DespesadiariaService } from '../../despesadiaria/despesadiaria.service';
import { FuncsalarioService } from '../../funcsalario/funcsalario.service';
import { naotrabService } from '../../naotrab/naotrab.service';
import { itensreqrecService } from '../../itensreqrec/itensreqrec.service';
import { S001RequisicaoService } from '../../requisicao/s001_requisicao.service';
import { destinoService } from '../../destino/destino.service';
import { PcontasService } from '../../pcontas/pcontas.service';
import { PcontasNumService } from '../../pcontasnum/pcontasnum.service';
import { ndocumentoService } from '../../ndocumento/ndocumento.service';
import { PpessoaService } from '../../ppessoa/ppessoa.service';
import { DataUtils } from '../../util/DataUtils';
import {
  RetonaPrestacaoStatus,
  RetornaSaquePendentes,
} from '../../util/variaveis/statusSaquePrestacao';

import { calcularDiariaValores } from '../../util/calculo_dia_retorno';
import { Destino } from '../../util/diariaDto';
import { mockDiariaChegada, mockDiariaInicial, mockReturnSaque } from '../__mocks__/saque.mock';
import { calcularValores } from '../../util/calculo_extorno';

describe('SaqueService', () => {
  let saqueService: SaqueService;
  let saqueRepository: Repository<SaqueEntity>;
  let documentosService: DocumentosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SaqueService,
        {
          provide: getRepositoryToken(SaqueEntity, 'oracleConnection'),
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
            getRawOne: jest.fn().mockResolvedValue(null),
            save: jest.fn().mockResolvedValue({}),
            findOne: jest.fn().mockResolvedValue(mockReturnSaque),
          },
        },
        {
          provide: DocumentosService,
          useValue: {
            findBySQE_ID_CODIGO: jest.fn(),
          },
        },
        {
          provide: MotivodiariaService,
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: ReqnumerarioService,
          useValue: {
            findLast: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: reembolsoService,
          useValue: {
            findone: jest.fn(),
          },
        },
        {
          provide: extornoService,
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: reqtransService,
          useValue: {
            updateStatus: jest.fn(),
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
          provide: DespesadiariaService,
          useValue: {
            calculateExpenses: jest.fn(),
          },
        },
        {
          provide: FuncsalarioService,
          useValue: {
            findAll: jest.fn(),
          },
        },
        {
          provide: naotrabService,
          useValue: {
            getCurrentValue: jest.fn(),
          },
        },
        {
          provide: itensreqrecService,
          useValue: {
            findItens: jest.fn(),
          },
        },
        {
          provide: S001RequisicaoService,
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: destinoService,
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: PcontasService,
          useValue: {
            findAll: jest.fn(),
          },
        },
        {
          provide: PcontasNumService,
          useValue: {
            findAll: jest.fn(),
          },
        },
        {
          provide: ndocumentoService,
          useValue: {
            findAll: jest.fn(),
          },
        },
        {
          provide: PpessoaService,
          useValue: {
            find: jest.fn(),
          },
        },
      ],
    }).compile();
    saqueService = module.get<SaqueService>(SaqueService);
    saqueRepository = module.get(getRepositoryToken(SaqueEntity, 'oracleConnection'));
    documentosService = module.get<DocumentosService>(DocumentosService);
  });

  it('deve ser definido', () => {
    expect(saqueService).toBeDefined();
  });

  describe('findAll', () => {
    it('deve retornar saques com paginação e filtros', async () => {
      const mockUser: any = {
        chapa: '123',
        permissao: 15,
        codsecao: '456',
      };

      const mockParams: FindParamsSaque = {
        orderBy: 'a.SQE_DTPEDIDO',
        orderDirection: 'ASC',
        page: 1,
        limit: 10,
      };
      const mockResult = [
        {
          SQE_ID_CODIGO: 24746,
          SQE_DTPEDIDO: '02/08/2009 21:00:00',
          SQE_DTSAQUE: '02/08/2009 21:00:00',
          SQE_DTPREST: '02/08/2009 21:00:00',
          NOME: 'Jose',
          REQ_ID_CODIGO: 87501,
          TDE_DESCRICAO: 'DIARIAS',
          SQE_VLSAQUE: 100,
          SQE_VLPREST: 0,
          VL_COMPLEMENTAR: 0,
          VL_EXTORNO: 100,
          REQ_DTREQ: '02/08/2009 21:00:00',
          REQ_STATUS: 'PLANEJAMENTO AUTORIZADO',
          CHAPA: '000363',
          STS_DESCRICAO: 'REQ.AVALIADA CHEFE IMEDIATO',
          SQE_EFETIVO: 'A',
          PRA_ATIVO: 'N',
          SQE_TIPOSAQUE: 'N',
          STATUS_SAQUE: 'Pendente',
          STATUS_PREST: null,
          ID_DOC: null,
          ORIGINAL_NAME: null,
          CODSECAO: '1.2.02.07.04.17.00',
        },
      ];

      const mockCount = [{ TOTAL_REGISTROS: 1 }];
      jest.spyOn(saqueRepository, 'query').mockResolvedValueOnce(mockResult);
      jest.spyOn(saqueRepository, 'query').mockResolvedValueOnce(mockCount);
      jest.spyOn(documentosService, 'findBySQE_ID_CODIGO').mockResolvedValueOnce([]);

      const STATUS_PREST = RetonaPrestacaoStatus(
        mockResult[0].SQE_EFETIVO,
        mockResult[0].SQE_TIPOSAQUE,
        mockResult[0].PRA_ATIVO,
        mockResult[0].SQE_DTPREST,
        mockResult[0].SQE_VLPREST,
      );

      const STATUS_SAQUE = RetornaSaquePendentes(
        mockResult[0].SQE_EFETIVO,
        mockResult[0].SQE_TIPOSAQUE,
        mockResult[0].PRA_ATIVO,
      );

      const result = await saqueService.findAll(mockParams, mockUser);

      expect(result).toEqual({
        data: [
          new returnSaqueDto({
            SQE_ID_CODIGO: 24746,
            SQE_DTPEDIDO: DataUtils.converterParaData('02/08/2009 21:00:00'),
            SQE_DTSAQUE: DataUtils.converterParaData('02/08/2009 21:00:00'),
            SQE_DTPREST: DataUtils.converterParaData('02/08/2009 21:00:00'),
            REQ_DTREQ: DataUtils.converterParaData('02/08/2009 21:00:00'),
            NOME: 'Jose',
            REQ_ID_CODIGO: 87501,
            TDE_DESCRICAO: 'DIARIAS',
            SQE_VLSAQUE: 100,
            SQE_VLPREST: 0,
            VL_COMPLEMENTAR: 0,
            VL_EXTORNO: 100,
            REQ_STATUS: 'PLANEJAMENTO AUTORIZADO',
            CHAPA: '000363',
            STS_DESCRICAO: 'REQ.AVALIADA CHEFE IMEDIATO',
            SQE_EFETIVO: 'A',
            PRA_ATIVO: 'N',
            SQE_TIPOSAQUE: 'Diária',
            STATUS_SAQUE: STATUS_SAQUE,
            STATUS_PREST: STATUS_PREST,
            ID_DOC: null,
            ORIGINAL_NAME: null,
            CODSECAO: '1.2.02.07.04.17.00',
          }),
        ],
        total: 1,
      });
    });

    it('deve lançar uma HttpException se ocorrer um erro', async () => {
      const mockUser: any = {
        chapa: '123',
        permissao: 15,
        codsecao: '456',
      };

      const mockParams: FindParamsSaque = {
        orderBy: 'a.SQE_DTPEDIDO',
        orderDirection: 'ASC',
        page: 1,
        limit: 10,
      };

      jest.spyOn(saqueRepository, 'query').mockRejectedValueOnce(new Error('Database error'));

      await expect(saqueService.findAll(mockParams, mockUser)).rejects.toThrow(
        new HttpException('Database error', HttpStatus.INTERNAL_SERVER_ERROR),
      );
    });
  });

  describe('Prestação de conta', () => {
    it('Calcula Diária Inicial', () => {
      const result = calcularDiariaValores(
        34.26,
        9,
        Destino.MAIS_DE_200K_HABITANTES_DISTANCIA_70KM,
        1,
        1,
        1,
        '19:00',
      );
      // Assert
      expect(result).toEqual(mockDiariaInicial);
    });

    it('Calcula Diária Final', () => {
      const result = calcularDiariaValores(
        34.26,
        9,
        Destino.MAIS_DE_200K_HABITANTES_DISTANCIA_70KM,
        1,
        1,
        1,
        '15:50:00',
      );
      expect(result).toEqual(mockDiariaChegada);
    });

    it('deve retornar VL_DEVOLUCAO zerado', () => {
      const { VL_EXTORNO, VL_DEVOLUCAO } = calcularValores(
        mockDiariaInicial.VL_DIARIA_INTEGRAL,
        mockDiariaChegada.VL_DIARIA_INTEGRAL,
      );
      expect(VL_EXTORNO).toBe(0);
      expect(VL_DEVOLUCAO).toBe(0);
    });

    it('deve retornar VL_EXTORNO parcial', () => {
      const { VL_EXTORNO, VL_DEVOLUCAO } = calcularValores(
        mockDiariaInicial.VL_DIARIA_PARCIAL,
        mockDiariaChegada.VL_DIARIA_PARCIAL,
      );
      expect(VL_EXTORNO).toBe(0);
      expect(VL_DEVOLUCAO).toBe(92.5);
    });
  });

  describe('findOne', () => {
    const mockSaqueData = {
      sqeIdCodigo: 1,
      iteIdCodigo: 100,
      sqeDtSaque: new Date(),
      sqeVlPrest: 500,
    };

    it('deve encontrar com sucesso um saque', async () => {
      const createQueryBuilderMock = {
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getRawOne: jest.fn().mockResolvedValue(mockSaqueData),
      };

      jest
        .spyOn(saqueRepository, 'createQueryBuilder')
        .mockReturnValue(createQueryBuilderMock as any);

      const result = await saqueService.findOne(1);

      expect(result).toEqual(mockSaqueData);
      expect(createQueryBuilderMock.select).toHaveBeenCalled();
      expect(createQueryBuilderMock.where).toHaveBeenCalledWith(
        'SaqueEntity.sqeIdCodigo = :sqeIdCodigo',
        { sqeIdCodigo: 1 },
      );
    });

    it('deve lançar uma exceção quando saque não for encontrado', async () => {
      const createQueryBuilderMock = {
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getRawOne: jest.fn().mockResolvedValue(null),
      };

      jest
        .spyOn(saqueRepository, 'createQueryBuilder')
        .mockReturnValue(createQueryBuilderMock as any);

      await expect(saqueService.findOne(1)).rejects.toThrow(
        new HttpException('Saque não encontrado', HttpStatus.INTERNAL_SERVER_ERROR),
      );
    });

    it('deve lidar com erros de repositório', async () => {
      jest.spyOn(saqueRepository, 'createQueryBuilder').mockImplementation(() => {
        throw new Error('Database connection error');
      });

      await expect(saqueService.findOne(1)).rejects.toThrow(
        new HttpException('Saque não encontrado', HttpStatus.INTERNAL_SERVER_ERROR),
      );
    });
  });

  describe('updateEfetivo', () => {
    it('deve o efetivo do saque', async () => {
      saqueService.findOne = jest.fn().mockResolvedValue(mockReturnSaque);
      const result = await saqueService.updateEfetivo(mockReturnSaque.sqeIdCodigo, 'C');
      const resutEsperado = { ...mockReturnSaque, sqeEfetivo: 'C' };
      expect(result).toEqual(resutEsperado);
      expect(saqueRepository.save).toHaveBeenCalledTimes(1);
    });
  });
});
