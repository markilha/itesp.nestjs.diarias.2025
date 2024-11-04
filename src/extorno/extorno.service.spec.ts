import { Test, TestingModule } from '@nestjs/testing';
import { extornoService } from './extorno.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { extornoEntity } from '../database/db_oracle/entities/extorno.entity';
import { Repository } from 'typeorm';
import exp from 'constants';

const mockEntityExtorno: extornoEntity[] = [
  {
    SQE_ID_CODIGO: 58693,
    ITE_ID_CODIGO: 43155,
    RRE_ID_CODIGO: 58167,
    DIR_ID_CODIGO: 4,
    PCO_ID_CODIGO: 1,
    FPA_ID_CODIGO: null,
    EXT_VALOR: 25.82,
    EXT_DATA: '19/11/2012 13:08:39',
    EXT_JUSTIFICA: 'ESTORNO VIAGEM',
  },
];

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
            find: jest.fn().mockResolvedValue(mockEntityExtorno),
            findOneOrFail: jest.fn().mockResolvedValue(mockEntityExtorno[0]),
            create: jest.fn().mockReturnValue(mockEntityExtorno[0]),
            save: jest.fn().mockResolvedValue(mockEntityExtorno[0]),
            findOne: jest.fn().mockResolvedValue(mockEntityExtorno[0]),
            merge: jest.fn().mockResolvedValue(mockEntityExtorno[0]),
            delete: jest.fn().mockResolvedValue(mockEntityExtorno[0]),
            softDelete: jest.fn().mockResolvedValue(mockEntityExtorno[0]),
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
    it('deve retornar um array de extornos', async () => {
      const result = await service.findAll({ SQE_ID_CODIGO: mockEntityExtorno[0].SQE_ID_CODIGO });
      expect(result).toEqual(mockEntityExtorno);
      expect(extornoRepository.find).toHaveBeenCalledTimes(1);
    });

    it('deve retornar uma execao', async () => {
      jest.spyOn(extornoRepository, 'find').mockRejectedValueOnce(new Error());
      expect(
        service.findAll({ SQE_ID_CODIGO: mockEntityExtorno[0].SQE_ID_CODIGO }),
      ).rejects.toThrowError();
    });
  });

  describe('findOneOrFail', () => {
    it('deve retornar um extorno', async () => {
      const result = await service.findOneOrFail(mockEntityExtorno[0].SQE_ID_CODIGO);
      expect(result).toEqual(mockEntityExtorno[0]);
      expect(extornoRepository.findOneOrFail).toHaveBeenCalledTimes(1);
    });

    it('deve retornar uma execao', () => {
      jest.spyOn(extornoRepository, 'findOneOrFail').mockRejectedValueOnce(new Error());
      expect(service.findOneOrFail(mockEntityExtorno[0].SQE_ID_CODIGO)).rejects.toThrowError();
    });
  });

  describe('create', () => {
    it('deve retornar um extorno', async () => {
      const data = {
        SQE_ID_CODIGO: 1,
        ITE_ID_CODIGO: 1,
        RRE_ID_CODIGO: 1,
        DIR_ID_CODIGO: 4,
        PCO_ID_CODIGO: 1,
        FPA_ID_CODIGO: null,
        EXT_VALOR: 25.82,
        EXT_DATA: '19/11/2012 13:08:39',
        EXT_JUSTIFICA: 'ESTORNO VIAGEM',
      };
      const result = await service.create(data);
      expect(result).toEqual(mockEntityExtorno[0]);
      expect(extornoRepository.create).toHaveBeenCalledTimes(1);
      expect(extornoRepository.save).toHaveBeenCalledTimes(1);
    });

    it('deve retornar uma exceção ao falhar ao salvar', async () => {
      jest.spyOn(extornoRepository, 'save').mockRejectedValueOnce(new Error());
      await expect(service.create(mockEntityExtorno[0])).rejects.toThrowError();
    });
  });

  describe('update', () => {
    it('deve retornar um extorno', async () => {
      const data = {
        SQE_ID_CODIGO: 1,
        ITE_ID_CODIGO: 1,
        RRE_ID_CODIGO: 1,
        DIR_ID_CODIGO: 4,
        PCO_ID_CODIGO: 1,
        FPA_ID_CODIGO: null,
        EXT_VALOR: 25.82,
        EXT_DATA: '19/11/2012 13:08:39',
        EXT_JUSTIFICA: 'ESTORNO VIAGEM2',
      };
      const result = await service.update(data);
      expect(result).toEqual(mockEntityExtorno[0]);
      expect(extornoRepository.findOneOrFail).toHaveBeenCalledTimes(1);
      expect(extornoRepository.merge).toHaveBeenCalledTimes(1);
    });

    it('deve retornar uma exceção ao falhar ao salvar', async () => {
      jest.spyOn(extornoRepository, 'findOneOrFail').mockRejectedValueOnce(new Error());
      await expect(service.update(mockEntityExtorno[0])).rejects.toThrowError();
    });
    it('deve retornar uma exceção ao falhar ao salvar', async () => {
      jest.spyOn(extornoRepository, 'save').mockRejectedValueOnce(new Error());
      await expect(service.update(mockEntityExtorno[0])).rejects.toThrowError();
    });
  });

  describe('delete', () => {
    it('deve retornar um extorno', async () => {
      const result = await service.delete(mockEntityExtorno[0].SQE_ID_CODIGO);
      expect(result).toEqual(mockEntityExtorno[0]);
      expect(extornoRepository.findOneOrFail).toHaveBeenCalledTimes(1);
    });

    it('deve retornar uma exceção ao falhar ao salvar', async () => {
      jest.spyOn(extornoRepository, 'findOneOrFail').mockRejectedValueOnce(new Error());
      await expect(service.delete(mockEntityExtorno[0].SQE_ID_CODIGO)).rejects.toThrowError();
    });
  });
});
