import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { pcontasnumEntity } from '../database/db_oracle/entities/pcontasnum';
import { FindOptionsWhere, Repository } from 'typeorm';
import { FindAllParams, pcontasNumDto } from './pcontasnumDto';
import { getPaginatedQuery } from 'src/util/paginacao/paginaQuery';

@Injectable()
export class PcontasNumService {
  constructor(
    @InjectRepository(pcontasnumEntity, 'oracleConnection')
    private pcontasnumRepository: Repository<pcontasnumEntity>,
  ) {}

  async findAll(params: FindAllParams): Promise<pcontasNumDto[]> {
    try {
      const pageNumber = params.page ?? 1;
      const pageSize = params.limit ?? 500;
      const startRow = (pageNumber - 1) * pageSize + 1;
      const endRow = pageNumber * pageSize;

      const searchParams: FindOptionsWhere<pcontasNumDto> = {};
      if (params.PCO_ID_CODIGO) {
        searchParams['PCO_ID_CODIGO'] = Number(params.PCO_ID_CODIGO);
      }

      const queryBuilder = this.pcontasnumRepository
        .createQueryBuilder('r')
        .select(['r.PCO_ID_CODIGO as PCO_ID_CODIGO', 'r.RNU_ID_CODIGO as RNU_ID_CODIGO'])
        .where(searchParams);

      const paginatedQuery = getPaginatedQuery(queryBuilder, startRow, endRow);
      const parameters = Object.values(queryBuilder.getParameters());
      const result = await this.pcontasnumRepository.query(paginatedQuery, parameters);

      return result;
    } catch (error) {
      console.log(error);
      throw new HttpException('Não foi possível buscar os docs', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOne(RNU_ID_CODIGO: number): Promise<pcontasNumDto> {
    try {
      const result = await this.pcontasnumRepository
        .createQueryBuilder('r')
        .where('r.RNU_ID_CODIGO = :codigo', { codigo: RNU_ID_CODIGO })
        .maxExecutionTime(10000)
        .cache(false)
        .getOne();

      if (!result) {
        throw new HttpException('Não encontrou nenhum registro', HttpStatus.NOT_FOUND);
      }
      return result;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error('Erro ao buscar registro:', error);

      throw new HttpException('Erro ao buscar registro', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async create(data: pcontasNumDto): Promise<pcontasNumDto> {
    try {
      const pcontasnum = this.pcontasnumRepository.create(data);
      await this.pcontasnumRepository.save(pcontasnum);
      return pcontasnum;
    } catch (error) {
      throw new HttpException(
        'Não foi possível criar a prestação de conta numerario',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
