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
import { Repository } from 'typeorm';
import { mockMD, mockParams, mockSaque } from '../__mocks__/saque.mock';

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
            justificativa: jest.fn(),
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
            calculateExpenses: jest.fn(),
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
    const saques = await service.findAll({SQE_ID_CODIGO: 15739});
    expect(saques).toEqual([mockSaque]);
  });
});
