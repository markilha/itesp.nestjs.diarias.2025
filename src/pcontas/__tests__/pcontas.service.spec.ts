import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PcontasService } from '../pcontas.service';
import { pcontasEntity } from '../../database/db_oracle/entities/pcontas.entity';
import { pcontasnumEntity } from '../../database/db_oracle/entities/pcontasnum';
import { reembolsoService } from '../../reembolso/reembolso.service';
import { extornoService } from '../../extorno/extorno.service';
import { SaqueService } from '../../saque/saque.service';
import { ReqnumerarioService } from '../../reqnumerario/reqnumerario.service';

import { pcontasDto, mockCreateDto} from '../__mocks__/mocks';


describe('PcontasService', () => {
  let service: PcontasService;
  let pcontasRepository: Repository<pcontasEntity>;
  let pcontasnumRepository: Repository<pcontasnumEntity>;

  const mockPcontasRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    insert: jest.fn(),
    query: jest.fn(),
  };

  const mockPcontasnumRepository = {
    insert: jest.fn(),
  };

  const mockReembolsoService = {
    findone: jest.fn(),
    atualizarJustificativa: jest.fn(),
  };

  const mockExtornoService = {
    create: jest.fn(),
  };

  const mockSaqueService = {
    findOne: jest.fn(),
  };

  const mockReqnumerarioService = {
    updateChegada: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PcontasService,
        { provide: getRepositoryToken(pcontasEntity, 'oracleConnection'), useValue: mockPcontasRepository },
        { provide: getRepositoryToken(pcontasnumEntity, 'oracleConnection'), useValue: mockPcontasnumRepository },
        { provide: reembolsoService, useValue: mockReembolsoService },
        { provide: extornoService, useValue: mockExtornoService },
        { provide: SaqueService, useValue: mockSaqueService },
        { provide: ReqnumerarioService, useValue: mockReqnumerarioService },
      ],
    }).compile();

    service = module.get<PcontasService>(PcontasService);
    pcontasRepository = module.get<Repository<pcontasEntity>>(getRepositoryToken(pcontasEntity, 'oracleConnection'));
    pcontasnumRepository = module.get<Repository<pcontasnumEntity>>(getRepositoryToken(pcontasnumEntity, 'oracleConnection'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('deve retornar uma lista de pcontas', async () => {
      const mockPcontas: pcontasDto[] = [{ PCO_ID_CODIGO: 1, PCO_TIPO: 'tipo1', PCO_TOTDOC: 100 }];
      mockPcontasRepository.find.mockResolvedValue(mockPcontas);

      const params = { page: 1, limit: 10 };
      const result = await service.findAll(params);

      expect(result).toEqual(mockPcontas);
      expect(mockPcontasRepository.find).toHaveBeenCalled();
    });

    it('deve lançar uma exceção em caso de erro', async () => {
      mockPcontasRepository.find.mockRejectedValue(new Error());
      await expect(service.findAll({})).rejects.toThrow(HttpException);
    });
  });

  describe('findOne', () => {
    it('deve retornar uma pconta pelo código', async () => {
      const mockPconta = { PCO_ID_CODIGO: 1, PCO_TIPO: 'tipo1', PCO_TOTDOC: 100 };
      mockPcontasRepository.findOne.mockResolvedValue(mockPconta);

      const result = await service.findOne(1);
      expect(result).toEqual(mockPconta);
      expect(mockPcontasRepository.findOne).toHaveBeenCalledWith({ where: { PCO_ID_CODIGO: 1 } });
    });

    it('deve lançar uma exceção se o registro não for encontrado', async () => {
      mockPcontasRepository.findOne.mockRejectedValue(new Error());
      await expect(service.findOne(1)).rejects.toThrow(HttpException);
    });
  });

  describe('createPcontas', () => {
    it('deve criar uma nova prestação de conta e retornar o PCO_ID_CODIGO', async () => {   

      const mockSaque = { sqeIdCodigo: 123, iteIdCodigo: 456, rreIdCodigo: 789, dirIdCodigo: 101, fpaIdCodigo: 202 };
      const mockReembolso = { SQE_ID_CODIGO: 123 };
      const mockLastIdResult = [{ LASTID: 10 }];
      mockSaqueService.findOne.mockResolvedValue(mockSaque);
      mockReembolsoService.findone.mockResolvedValue(mockReembolso);
      mockPcontasRepository.query.mockResolvedValue(mockLastIdResult);
      mockPcontasRepository.insert.mockResolvedValue({ identifiers: [{ PCO_ID_CODIGO: 11 }] });

      const result = await service.createPcontas(mockCreateDto);
      expect(result).toEqual({ PCO_ID_CODIGO: 11 });
      expect(mockSaqueService.findOne).toHaveBeenCalledWith(mockCreateDto.SQE_ID_CODIGO);
      expect(mockReembolsoService.findone).toHaveBeenCalledWith(mockCreateDto.SQE_ID_CODIGO);
      expect(mockPcontasRepository.insert).toHaveBeenCalled();
    });

    it('deve retornar uma exceção ao falhar ao inserir', async () => {
        jest.spyOn(mockPcontasRepository, 'insert').mockRejectedValueOnce(new Error());
        await expect(mockPcontasRepository.insert(mockCreateDto[0])).rejects.toThrowError();
      });
   
  });
});
