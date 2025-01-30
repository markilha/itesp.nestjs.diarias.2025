import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { FindOptionsWhere, Repository } from 'typeorm';
import { FindAllParams, ReqnumerarioDto, updatChegadaDto } from './reqnumerarioDto';
import { ReqNumerarioEntity } from '../database/db_oracle/entities/reqnumerario.entity';
import { getPaginatedQuery } from '../util/paginacao/paginaQuery';

@Injectable()
export class ReqnumerarioService {
  constructor(
    @InjectRepository(ReqNumerarioEntity, 'oracleConnection')
    private readonly renumerarioRepository: Repository<ReqNumerarioEntity>,
  ) {}
  
  async findAll(params: FindAllParams): Promise<ReqnumerarioDto[]> {
    try {
      const pageNumber = params.page ?? 1;
      const pageSize = params.limit ?? 500;
      const startRow = (pageNumber - 1) * pageSize + 1;
      const endRow = pageNumber * pageSize;

      const searchParams: FindOptionsWhere<ReqNumerarioEntity> = {};
      if (params.RNU_ID_CODIGO) {
        searchParams.RNU_ID_CODIGO = params.RNU_ID_CODIGO;
      }
      if (params.REQ_ID_CODIGO) {
        searchParams.REQ_ID_CODIGO = params.REQ_ID_CODIGO;
      }

      const queryBuilder = this.renumerarioRepository
        .createQueryBuilder('r')
        .select([
          'r.RNU_ID_CODIGO as RNU_ID_CODIGO',
          'r.SQE_ID_CODIGO as SQE_ID_CODIGO',
          'r.REQ_ID_CODIGO as REQ_ID_CODIGO',
          'r.ITE_ID_CODIGO as ITE_ID_CODIGO',
          'r.RRE_ID_CODIGO as RRE_ID_CODIGO',
          'r.DIR_ID_CODIGO as DIR_ID_CODIGO',
          'r.RNU_DTINICIO as RNU_DTINICIO',
          'r.RNU_HORAINICIO as RNU_HORAINICIO',
          'r.RNU_DTFIM as RNU_DTFIM',
          'r.RNU_HORAFIM as RNU_HORAFIM',
          'r.RNU_INTPREV as RNU_INTPREV',
          'r.RNU_PARPREV as RNU_PARPREV',
          'r.RNU_INTREAL as RNU_INTREAL',
          'r.RNU_PARREAL as RNU_PARREAL',
          'r.RNU_MOTIVO as RNU_MOTIVO',
          'r.RNU_PACOTE as RNU_PACOTE',
          'r.RNU_GOVERNADOR as RNU_GOVERNADOR',
          'r.RNU_VLINTEGRAL as RNU_VLINTEGRAL',
          'r.RNU_VLPARCIAL as RNU_VLPARCIAL',
          'r.RNU_VLBASE as RNU_VLBASE' 
        ])
        .where(searchParams);

      const paginatedQuery = getPaginatedQuery(queryBuilder, startRow, endRow);
      const parameters = Object.values(queryBuilder.getParameters());
      const result = await this.renumerarioRepository.query(paginatedQuery, parameters);

      return result;
    } catch (error) {
      console.log(error);
      throw new HttpException('Não foi possível buscar os docs', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOne(ITE_ID_CODIGO: number) {
    try {
      const item = await this.renumerarioRepository.query(
        `SELECT * FROM FINANCEIRO.S009_REQNUMERARIO  WHERE ITE_ID_CODIGO = :ITE_ID_CODIGO`,
        [ITE_ID_CODIGO],
      );

      if (!item || item.length === 0) {
        throw new HttpException(
          `Reqnumerario com código: ${ITE_ID_CODIGO} não encontrado`,
          HttpStatus.NOT_FOUND,
        );
      }
      return item[0];
    } catch (error) {
      console.log(error);
      throw new HttpException(
        `Erro ao buscar o reqnumerario(${ITE_ID_CODIGO}). ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // retonar o ultimo registro
  async findLast(): Promise<number> {
    try {
      const lastINumerario = await this.renumerarioRepository.query(
        `SELECT MAX(RNU_ID_CODIGO) as lastId FROM S009_REQNUMERARIO`,
      );
      const lastIdNum = lastINumerario[0]?.LASTID || 0;
      return lastIdNum + 1;
    } catch (error) {
      throw new HttpException(
        'Erro ao buscar o último numerario',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async create(reqnumerario: ReqnumerarioDto): Promise<ReqnumerarioDto> {
    try {
      reqnumerario.RNU_ID_CODIGO = await this.findLast();
      const newReqnumerario = await this.renumerarioRepository.save(reqnumerario);
      return new ReqnumerarioDto(newReqnumerario);
    } catch (error) {
      throw new HttpException('Erro ao criar o numerario', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateChegada(reqnumerario: updatChegadaDto): Promise<ReqnumerarioDto> {
    try {
      const reqnumerarioEntity = await this.renumerarioRepository.query(
        `SELECT * FROM FINANCEIRO.S009_REQNUMERARIO  WHERE RNU_ID_CODIGO = :RNU_ID_CODIGO`,
        [reqnumerario.RNU_ID_CODIGO],
      );

      if (!reqnumerarioEntity) {
        throw new HttpException('Requisição não encontrada', HttpStatus.NOT_FOUND);
      }

      reqnumerarioEntity.RNU_INTREAL = reqnumerario.RNU_INTREAL;
      reqnumerarioEntity.RNU_PARREAL = reqnumerario.RNU_PARREAL;

      await this.renumerarioRepository.save(reqnumerarioEntity);

      return new ReqnumerarioDto(reqnumerarioEntity);
    } catch (error) {
      throw new HttpException('Erro ao atualizar o numerario', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
