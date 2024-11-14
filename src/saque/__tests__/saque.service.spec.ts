import { Test, TestingModule } from '@nestjs/testing';
import { SaqueService } from '../saque.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SaqueEntity } from '../../database/db_oracle/entities/saque.entity';
import { MotivodiariaService } from '../../motivodiaria/motivodiaria.service';
import { ReqnumerarioService } from '../../reqnumerario/reqnumerario.service';
import { reembolsoService } from '../../reembolso/reembolso.service';
import { reqtransService } from '../../reqtrans/reqtrans.service';
import { ItinirarioService } from '../../itinirario/itinirario.service';
import { UfespService } from '../../ufesp/ufesp.service';
import { DespesadiariaService } from '../../despesadiaria/despesadiaria.service';
import { FuncsalarioService } from '../../funcsalario/funcsalario.service';
import { extornoService } from '../../extorno/extorno.service';
import { naotrabService } from '../../naotrab/naotrab.service';
import { itensreqrecService } from '../../itensreqrec/itensreqrec.service';
import { S001RequisicaoService } from '../../requisicao/s001_requisicao.service';
import { destinoService } from '../../destino/destino.service';
import { Repository } from 'typeorm';
import {
  mockDiariaChegada,
  mockDiariaInicial,
  mockMD,
  mockReturnSaque,
  mockSaque,
  mocktotal,
} from '../__mocks__/saque.mock';
import { calcularDiariaValores } from '../../util/calculo_dia_retorno';
import { Destino } from '../../util/diariaDto';
import { calcularValores } from '../../util/calculo_extorno';



describe('SaqueService', () => {
  let service: SaqueService;
  let saqueRepository: Repository<SaqueEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SaqueService,
        {
          provide: getRepositoryToken(SaqueEntity, 'oracleConnection'),
          useValue: {         
            findAll: jest.fn().mockResolvedValue(mocktotal),   
            findOne: jest.fn().mockResolvedValue(mockReturnSaque),
            query: jest.fn().mockResolvedValue([mockSaque]),
            updateEfetivo: jest.fn().mockResolvedValue(mockReturnSaque),
            save: jest.fn().mockResolvedValue(mockSaque),
            findOneOrFail: jest.fn().mockResolvedValue(mockReturnSaque)
          
          },
        },
        {
          provide: MotivodiariaService,
          useValue: {
            findOne: jest.fn().mockResolvedValue(mockMD),
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
      ],
    }).compile();

    service = module.get<SaqueService>(SaqueService);
    saqueRepository = module.get(getRepositoryToken(SaqueEntity, 'oracleConnection'));
  });

  it('Deve ser definido', () => {
    expect(service).toBeDefined();
    expect(saqueRepository).toBeDefined();
  });

  it('Buscar todos saques', async () => {
    let saques = await service.findAll({  CHAPA: '000081' }); 
    expect(saques).toEqual(mocktotal);
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

  describe('findOneOrFail', () => {
    it('deve retornar um extorno', async () => {
      const result = await service.findOne(mockReturnSaque.sqeIdCodigo);
      expect(result).toEqual(mockReturnSaque);
      expect(saqueRepository.findOneOrFail).toHaveBeenCalledTimes(1);
    });
    it('deve retornar uma execao', () => {
      jest.spyOn(saqueRepository, 'findOneOrFail').mockRejectedValueOnce(new Error());
      expect(service.findOne(9999)).rejects.toThrow();
    });
  });

  describe('updateEfetivo', () => {
    it('deve o efetivo do saque', async () => {
      const result = await service.updateEfetivo(mockReturnSaque.sqeIdCodigo, 'C');
      const resutEsperado = { ...mockReturnSaque, sqeEfetivo: 'C' };
      expect(result).toEqual(resutEsperado);
      expect(saqueRepository.findOneOrFail).toHaveBeenCalledTimes(1);
      expect(saqueRepository.save).toHaveBeenCalledTimes(1);
    });

    it('deve retornar uma exceção ', async () => {
      jest.spyOn(saqueRepository, 'findOneOrFail').mockRejectedValueOnce(new Error());
      await expect(service.updateEfetivo(99999, 'c')).rejects.toThrow();
    });
  });


});
