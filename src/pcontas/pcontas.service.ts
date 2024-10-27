import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { pcontasEntity } from 'src/database/db_oracle/entities/pcontas.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { FindAllParams, pcontasDto } from './pcontasDto';
import { pcontasnumEntity } from 'src/database/db_oracle/entities/pcontasnum';

@Injectable()
export class PcontasService {
  constructor(
    @InjectRepository(pcontasEntity, 'oracleConnection')
    private pcontasRepository: Repository<pcontasEntity>,

    @InjectRepository(pcontasnumEntity, 'oracleConnection')
    private readonly pcontasnumRepository: Repository<pcontasnumEntity>, 
  ) {}

  async findAll(params: FindAllParams): Promise<pcontasDto[]> {
    try {
      const searchParams: FindOptionsWhere<pcontasDto> = {};
      if (params.PCO_ID_CODIGO) {
        searchParams['PCO_ID_CODIGO'] = Number(params.PCO_ID_CODIGO);
      }

      if (params.page && params.limit) {
        const page = params.page;
        const limit = params.limit;
        const skip = (page - 1) * limit;

        return await this.pcontasRepository.find({
          where: searchParams,
          skip,
          take: limit,
        });
      }

      return await this.pcontasRepository.find({
        where: searchParams,
      });
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Não foi possível as prestações de conta',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async findOne(PCO_ID_CODIGO: number): Promise<pcontasDto> {
    try {
      return await this.pcontasRepository.findOne({
        where: {
          PCO_ID_CODIGO,
        },
      });
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Não foi possível as prestações de conta',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  

  async createPcontas(SQE_ID_CODIGO: number): Promise<number> {

     // Obtém o último valor de PCO_ID_CODIGO
     const lastIdResult = await this.pcontasRepository.query(
      `SELECT MAX(PCO_ID_CODIGO) as lastId FROM S009_PCONTAS`
    );
    const lastId = lastIdResult[0]?.LASTID || 0;  
    const newId = lastId + 1;     
    
    const pcontas = {
      PCO_ID_CODIGO: newId,
      PCO_TIPO: 'N',
      PCO_TOTDOC: 0,
    };

    const insertResult = await this.pcontasRepository.insert(pcontas);
    const pcoIdCodigo = insertResult.identifiers[0].PCO_ID_CODIGO;
    const rnuIdCodigo = await this.pcontasRepository.query(
      `SELECT RNU_ID_CODIGO FROM S009_REQNUMERARIO WHERE SQE_ID_CODIGO = :sqeIdCodigo`,
      [SQE_ID_CODIGO],
    );

    await this.pcontasnumRepository.insert({
      PCO_ID_CODIGO: pcoIdCodigo,
      RNU_ID_CODIGO: rnuIdCodigo[0]?.RNU_ID_CODIGO,
    });

    return pcoIdCodigo;
  }
}
