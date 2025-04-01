import { Test, TestingModule } from '@nestjs/testing';
import { UfespService } from '../ufesp.service';
import { Repository } from 'typeorm';
import { UferpsEntity } from '../../database/db_mysql/entities/UferpsEntity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { mocksUfesp, ufespData, updateData } from '../__mocks__/mocks';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('UfespService', () => {
  let service: UfespService;
  let ufespRepository: Repository<UferpsEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UfespService,
        {
          provide: getRepositoryToken(UferpsEntity, 'oracleConnection'),
          useValue: {
            find: jest.fn().mockResolvedValue([mocksUfesp]),
            createQueryBuilder: jest.fn(),
            update: jest.fn(),
            findOneBy: jest.fn().mockResolvedValue(ufespData),
            findOne: jest.fn().mockResolvedValue(mocksUfesp),
            findOneOrFail: jest.fn().mockResolvedValue(mocksUfesp),
            save: jest.fn().mockResolvedValue(mocksUfesp),
            merge: jest.fn().mockResolvedValue(mocksUfesp),
          },
        },
      ],
    }).compile();

    service = module.get<UfespService>(UfespService);
    ufespRepository = module.get<Repository<UferpsEntity>>(
      getRepositoryToken(UferpsEntity, 'oracleConnection'),
    );
  });

  it('deve ser definido', () => {
    expect(service).toBeDefined();
  });

  // it('Retornar todas ufeps', async () => {
  //   const ufesps = await service.findAll({});
  //   expect(ufesps).toEqual([mocksUfesp]);
  // });

  describe('findOne', () => {
    it('deve retornar uma UFESP', async () => {
      jest.spyOn(ufespRepository, 'findOneOrFail');
      const result = await service.findOne(20);
      expect(result).toEqual(mocksUfesp);
    });

    it('deve lançar uma HttpException com status NOT_FOUND quando a UFESP não é encontrada', async () => {
      jest.spyOn(ufespRepository, 'findOneOrFail').mockRejectedValue(new Error());

      try {
        await service.findOne(999); // Um ID que provavelmente não existe
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.status).toBe(HttpStatus.NOT_FOUND);
        expect(error.message).toBe('Ufesp não encontrada');
      }

      expect(ufespRepository.findOneOrFail).toHaveBeenCalledWith({
        where: { ufeIdCodigo: 999 },
      });
    });
  });

  describe('findMostRecentValue', () => {
    it('deve retornar o valor UFESP mais recente', async () => {
      const queryBuilderMock = {
        orderBy: jest.fn().mockReturnThis(),
        addOrderBy: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(ufespData),
      };

      jest.spyOn(ufespRepository, 'createQueryBuilder').mockReturnValue(queryBuilderMock as any);

      const result = await service.getLast();
      expect(result).toEqual(ufespData);
      expect(queryBuilderMock.orderBy).toHaveBeenCalledWith('u.ufeDtFinal', 'DESC');
      expect(queryBuilderMock.addOrderBy).toHaveBeenCalledWith('u.ufeDtInicio', 'DESC');
      expect(queryBuilderMock.getOne).toHaveBeenCalled();
    });
  });

  describe('findValueByDate', () => {
    it('deve retornar o valor UFESP para uma data específica', async () => {
      jest.spyOn(ufespRepository, 'createQueryBuilder').mockReturnValue({
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(ufespData),
      } as any);

      const result = await service.findValueByDate('2024-01-01');
      expect(result).toEqual(ufespData);
    });
  });
  it('deve atualizar uma UFESP com sucesso', async () => {
    jest.spyOn(ufespRepository, 'findOneOrFail');
    jest.spyOn(ufespRepository, 'save');
    const result = await service.update(updateData);
    expect(result).toEqual(mocksUfesp);
  });
});
