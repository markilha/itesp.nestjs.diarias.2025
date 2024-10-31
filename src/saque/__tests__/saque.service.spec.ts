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
import { Repository } from 'typeorm';
import { mockDiariaChegada, mockDiariaInicial, mockMD, mockSaque } from '../__mocks__/saque.mock';
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
            findOne: jest.fn().mockResolvedValue(mockSaque),
            query: jest.fn().mockResolvedValue([mockSaque]),
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
    const saques = await service.findAll({ SQE_ID_CODIGO: 15739 });
    expect(saques).toEqual([mockSaque]);
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

  
});
