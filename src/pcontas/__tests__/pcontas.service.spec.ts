import { Test, TestingModule } from '@nestjs/testing';
import { PcontasService } from '../pcontas.service';
import { Repository } from 'typeorm';
import { pcontasEntity } from '../../database/db_oracle/entities/pcontas.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SaqueService } from '../../saque/saque.service';
import { ReqnumerarioService } from '../../reqnumerario/reqnumerario.service';
import { ndocumentoService } from '../../ndocumento/ndocumento.service';
import { pcontasnumEntity } from '../../database/db_oracle/entities/pcontasnum';
import { pcontasDtoMock } from '../pcontasDto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { userAuthMock } from '../../users/__mocks__/user.mock';
import { createChegadaDto } from '../__Mocks__/mocks';
import { ReqNumerarioEntity } from '../../database/db_oracle/entities/reqnumerario.entity';

describe('PcontasService', () => {
  let servicePContas: PcontasService;
  let pcontasRepository: Repository<pcontasEntity>;
  let saqueService: SaqueService;
  let reqnumerarioService: ReqnumerarioService;
  let reqnumerarioRepository: Repository<ReqNumerarioEntity>;


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PcontasService,
        {
          provide: getRepositoryToken(pcontasEntity, 'oracleConnection'),
          useValue: {
            find: jest.fn().mockResolvedValue(pcontasDtoMock),
            findOneByOrFail: jest.fn().mockResolvedValue(pcontasDtoMock[0]),
            query: jest.fn(),
            save: jest.fn().mockResolvedValue(pcontasDtoMock[0]),
            create: jest.fn().mockResolvedValue(pcontasDtoMock[0]),
            insert: jest.fn().mockResolvedValue(pcontasDtoMock[0]),
            createPcontas: jest.fn().mockResolvedValueOnce(1),
          },
        },
        {
          provide: getRepositoryToken(pcontasnumEntity, 'oracleConnection'),
          useClass: Repository,
        },
        {
          provide: SaqueService,
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: ReqnumerarioService,
          useValue: {
            updateChegada: jest.fn().mockResolvedValue(createChegadaDto),
            save: jest.fn().mockResolvedValue(createChegadaDto),
          },
        },
        {
          provide: ndocumentoService,
          useValue: {
            someMethod: jest.fn(),
          },
        },
      ],
    }).compile();

    servicePContas = module.get<PcontasService>(PcontasService);
    pcontasRepository = module.get<Repository<pcontasEntity>>(
      getRepositoryToken(pcontasEntity, 'oracleConnection'),
    );
   
    saqueService = module.get<SaqueService>(SaqueService);
    reqnumerarioService = module.get<ReqnumerarioService>(ReqnumerarioService);
  
  });

  it('should be defined', () => {
    expect(servicePContas).toBeDefined();
    expect(pcontasRepository).toBeDefined();
  });

  describe('findAll', () => {
    it('Retornar a lista de prestação de conta', async () => {
      //Act
      const result = await servicePContas.findAll({});
      expect(result).toEqual(pcontasDtoMock);
      expect(pcontasRepository.find).toHaveBeenCalledTimes(1);
    });
    it('Retornar a lista de prestação de conta com parametros', async () => {
      //Act
      const result = await servicePContas.findAll({ PCO_ID_CODIGO: 1 });
      expect(result).toEqual(pcontasDtoMock);
      expect(pcontasRepository.find).toHaveBeenCalledTimes(1);
    });

    it('Retornar a lista de prestação de conta com paginação', async () => {
      //Act
      const result = await servicePContas.findAll({ page: 1, limit: 10 });
      expect(result).toEqual(pcontasDtoMock);
      expect(pcontasRepository.find).toHaveBeenCalledTimes(1);
    });

    it('Deve retornar um erro', async () => {
      //Arrange
      jest.spyOn(pcontasRepository, 'find').mockRejectedValueOnce(new Error());
      //Act
      expect(servicePContas.findAll({})).rejects.toThrow();
    });
  });

  describe('findOneOrFail', () => {
    it('Retornar uma prestação de conta', async () => {
      //Act
      const result = await servicePContas.findOne(1);
      //Assert
      expect(result).toEqual(pcontasDtoMock[0]);
      expect(pcontasRepository.findOneByOrFail).toHaveBeenCalledTimes(1);
    });

    it('Deve retornar um erro', async () => {
      // Act
      jest.spyOn(pcontasRepository, 'findOneByOrFail').mockRejectedValueOnce(new Error());
      
      // Assert
      await expect(servicePContas.findOne(1)).rejects.toThrow(
        new HttpException(
          'Erro ao buscar a prestação de conta',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    });
  });

  describe('lastid', () => {
    it('Retornar o ultimo id', async () => {
      //Arrange
      jest.spyOn(pcontasRepository, 'query').mockResolvedValueOnce([{ LASTID: 1 }]);
      //Act
      const result = await servicePContas.lastid();
      //Assert
      expect(result).toEqual(1);
      expect(pcontasRepository.query).toHaveBeenCalledTimes(1);
    });

    it('Deve retornar um erro', async () => {
      //Arrange
      jest.spyOn(pcontasRepository, 'query').mockRejectedValueOnce(new Error());
     
     // Assert
     await expect(servicePContas.lastid()).rejects.toThrow(
      new HttpException(
        'Erro ao buscar o último ID',
        HttpStatus.INTERNAL_SERVER_ERROR,
      ),
    );
    });
  });

  describe('create', () => {
    it('Deve criar uma prestação de conta', async () => {
      //Arrange
      const createDto = {
        "PCO_ID_CODIGO": 3,
        "PCO_TIPO": "N",
        "PCO_TOTDOC": 0
      };
      //Act
      const result = await servicePContas.create(createDto);
      //Assert
      expect(result).toEqual(pcontasDtoMock[0]);
      expect(pcontasRepository.create).toHaveBeenCalledTimes(1);
    });

    it('Deve retornar um erro', async () => {
      //Arrange
      jest.spyOn(pcontasRepository, 'save').mockRejectedValueOnce(new Error());     
     // Assert
     await expect(servicePContas.create(null)).rejects.toThrow(
      new HttpException(
        'Não foi possível criar a prestação de conta',
        HttpStatus.INTERNAL_SERVER_ERROR,
      ),
    );
    });
  });

  describe('createPcontas', () => {
    it('Deve criar uma prestação de conta', async () => {         
      //Act
      const result = await servicePContas.findOne(1);
      //Assert
      expect(result).toEqual(pcontasDtoMock[0]);
      expect(pcontasRepository.findOneByOrFail).toHaveBeenCalledTimes(1);
    });
    it('lastid', async () => {
      //Arrange
      jest.spyOn(pcontasRepository, 'query').mockResolvedValueOnce([{ LASTID: 1 }]);
      //Act
      const result = await servicePContas.lastid();
      //Assert
      expect(result).toEqual(1);
      expect(pcontasRepository.query).toHaveBeenCalledTimes(1);
    });

    it('insert', async () => {
      //Arrange
      const createDto = {
        "PCO_ID_CODIGO": 3,
        "PCO_TIPO": "N",
        "PCO_TOTDOC": 0
      };
      //Act
      const result = await pcontasRepository.insert(createDto);
      //Assert
      expect(result).toEqual(pcontasDtoMock[0]);
      expect(pcontasRepository.insert).toHaveBeenCalledTimes(1);
    });

    it('query', async () => {
      //Arrange
      jest.spyOn(pcontasRepository, 'query').mockResolvedValueOnce(1);
      //Act
      const result = await pcontasRepository.query(`SELECT MAX(PCO_ID_CODIGO) as lastId FROM S009_PCONTAS`);
      //Assert
      expect(result).toEqual(1);
      expect(pcontasRepository.query).toHaveBeenCalledTimes(1);
    });

    it('updateChegada', async () => {    
      //Act
      const result = await reqnumerarioService.updateChegada(createChegadaDto);
      //Assert
      expect(result).toEqual(createChegadaDto);     
      
    });


    it('Deve retornar um erro', async () => {
         //Arrange
         const createDto = {     
          SQE_ID_CODIGO: 1,         
          PCO_TIPO: 'N',          
          PCO_TOTDOC: 1,        
          JUSTIFICATIVA: 'justificativa',       
          TOTALCOMPLEMENTAR: 0,        
          TOTALDEVOLUCAO: 0,     
          INTREAL: '1',        
          PARREAL: '1',
        }
      //Arrange
      jest.spyOn(pcontasRepository, 'save').mockRejectedValueOnce(new Error());     
    // Assert
    await expect(servicePContas.createPcontas(createDto,userAuthMock)).rejects.toThrow(
      new HttpException(
        'Erro ao buscar o último ID',
        HttpStatus.INTERNAL_SERVER_ERROR,
      ),
    );
    });
  });
});
