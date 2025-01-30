/* istanbul ignore file */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UferpsEntity } from '../database/db_oracle/entities/UferpsEntity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { FindAllParams, UfespDto } from './ufespDto';
import { getPaginatedQuery } from 'src/util/paginacao/paginaQuery';

@Injectable()
export class UfespService {
  constructor(
    @InjectRepository(UferpsEntity, 'oracleConnection')
    private uferpsRepository: Repository<UferpsEntity>,
  ) {}

  async create(createUferpsvalorDto: UfespDto): Promise<UfespDto> {
    try {
      const uferpsvalor = this.uferpsRepository.create(createUferpsvalorDto);
      return this.uferpsRepository.save(uferpsvalor);
    } catch (error) {
      console.log(error);
      throw new HttpException('Erro ao criar a ufesp', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async update(updateValue: UfespDto): Promise<UfespDto> {
    const result = await this.findOne(updateValue.ufeIdCodigo);
    this.uferpsRepository.merge(result, updateValue);
    return this.uferpsRepository.save(result);
  }

  //findOne
  async findOne(id: number): Promise<UfespDto> {
    try {
      return await this.uferpsRepository.findOneOrFail({
        where: { ufeIdCodigo: id },
      });
    } catch (error) {
      throw new HttpException('Ufesp não encontrada', HttpStatus.NOT_FOUND);
    }
  }

  async remove(id: number): Promise<void> {
    try {
      await this.uferpsRepository.delete(id);
    } catch (error) {
      console.log(error);
      throw new HttpException('Erro ao remover a ufesp', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAll(params: FindAllParams): Promise<UfespDto[]> {
    try {
      const pageNumber = params.page ?? 1;
      const pageSize = params.limit ?? 500;
      const startRow = (pageNumber - 1) * pageSize + 1;
      const endRow = pageNumber * pageSize;
      const searchParams: FindOptionsWhere<UferpsEntity> = {};

      if (params.ufeIdCodigo) {
        searchParams['ufeIdCodigo'] = params.ufeIdCodigo;
      }
      const queryBuilder = this.uferpsRepository
        .createQueryBuilder('r')
        .select([
          'r.UFE_ID_CODIGO as "ufeIdCodigo"',
          'r.TDE_ID_CODIGO as "tdeIdCodigo"',
          'r.UFE_VALOR as "ufeValor"',
          'r.UFE_DTINICIO as "ufeDtInicio"',
          'r.UFE_DTFINAL as "ufeDtFinal"',
        ])
        .where(searchParams);

      const paginatedQuery = getPaginatedQuery(queryBuilder, startRow, endRow);
      const parameters = Object.values(queryBuilder.getParameters());
      const result = await this.uferpsRepository.query(paginatedQuery, parameters);

      return result;
    } catch (error) {
      console.log(error);
      throw new HttpException('Não foi possível buscar os docs', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Novo método para encontrar o valor mais atual
  async findMostRecentValue(): Promise<UfespDto | undefined> {
    return this.uferpsRepository
      .createQueryBuilder('u')
      .orderBy('u.ufeDtFinal', 'DESC')
      .addOrderBy('u.ufeDtInicio', 'DESC')
      .getOne();
  }

  // Inserir uma data e retornar o valor da UFESP naquela data

  async findValueByDate(dateString: string | Date): Promise<UfespDto | null> {
    try {
      const date = dateString instanceof Date ? dateString : new Date(dateString);

      let result = await this.uferpsRepository
        .createQueryBuilder('u')
        .where(':date BETWEEN u.ufeDtInicio AND u.ufeDtFinal', { date }) // Utiliza BETWEEN para simplificar
        .getOne();

      // Se não encontrar, busca o valor anterior à data
      if (!result) {
        result = await this.uferpsRepository
          .createQueryBuilder('u')
          .where('u.ufeDtFinal < :date', { date }) // Reutiliza o mesmo valor
          .orderBy('u.ufeDtFinal', 'DESC')
          .getOne();
      }
      return result;
    } catch (error) {
      console.log(error);
      throw new HttpException('Erro ao buscar a ufesp', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
