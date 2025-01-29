import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { FindOptionsWhere, Repository } from 'typeorm';
import { FindAllParams, reembolsoDto, upadteJustificativaDto, updateDto } from './reembolsoDto';
import { reembolsoEntity } from '../database/db_oracle/entities/reembolso.entity';
import { getPaginatedQuery } from 'src/util/paginacao/paginaQuery';

@Injectable()
export class reembolsoService {
  constructor(
    @InjectRepository(reembolsoEntity, 'oracleConnection')
    private readonly reembolsoRepository: Repository<reembolsoEntity>,
  ) {}

  async findAll(params: FindAllParams): Promise<reembolsoDto[]> {
    try {
      const pageNumber = params.page ?? 1;
      const pageSize = params.limit ?? 500;
      const startRow = (pageNumber - 1) * pageSize + 1;
      const endRow = pageNumber * pageSize;
      const searchParams: FindOptionsWhere<reembolsoEntity> = {};

      if (params.ITE_ID_CODIGO) {
        searchParams.ITE_ID_CODIGO = params.ITE_ID_CODIGO;
      }
      if (params.SQE_ID_CODIGO) {
        searchParams.SQE_ID_CODIGO = params.SQE_ID_CODIGO;
      }
      const queryBuilder = this.reembolsoRepository
        .createQueryBuilder('r')
        .select([
          'r.RRE_ID_CODIGO as RRE_ID_CODIGO',
          'r.DIR_ID_CODIGO as DIR_ID_CODIGO',
          'r.ITE_ID_CODIGO as ITE_ID_CODIGO',
          'r.SQE_ID_CODIGO as SQE_ID_CODIGO',
          'r.RRE_JUSTIFICATIVA as RRE_JUSTIFICATIVA',
          'r.RRE_SAQUE as RRE_SAQUE',
        ])
        .where(searchParams);

      const paginatedQuery = getPaginatedQuery(queryBuilder, startRow, endRow);

      const parameters = Object.values(queryBuilder.getParameters());

      const result = await this.reembolsoRepository.query(paginatedQuery, parameters);

      return result.map((reqv) => new reembolsoDto(reqv));
    } catch (error) {
      throw new HttpException('Erro ao buscar as requisições', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async create(reembolso: reembolsoDto): Promise<reembolsoDto> {
    try {
      const newreembolso = await this.reembolsoRepository.save(reembolso);
      return new reembolsoDto(newreembolso);
    } catch (error) {
      console.log(error);
      throw new HttpException('Erro ao criar o reembolso', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async inseriReembolso(MD: reembolsoDto): Promise<boolean> {
    try {
      await this.reembolsoRepository.query(
        `INSERT INTO FINANCEIRO.S009_REEMBOLSO (
            RRE_ID_CODIGO,
            DIR_ID_CODIGO,
            ITE_ID_CODIGO,
            SQE_ID_CODIGO,
            RRE_JUSTIFICATIVA,
            RRE_SAQUE
          ) VALUES (
            :rreIdCodigo,
            :dirIdCodigo,
            :iteIdCodigo,
            :sqeIdCodigo,
            :rreJustificativa,
            :sqeIdCodigo
          )`,
        [
          MD.RRE_ID_CODIGO,
          MD.DIR_ID_CODIGO,
          MD.ITE_ID_CODIGO,
          MD.SQE_ID_CODIGO,
          MD.RRE_JUSTIFICATIVA,
          MD.RRE_SAQUE,
        ],
      );
      return true;
    } catch (error) {
      throw new HttpException('Erro ao criar a justificativa', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async atualizarJustificativa(dados: upadteJustificativaDto): Promise<boolean> {
    try {
      const exist = await this.reembolsoRepository.findOne({
        where: { SQE_ID_CODIGO: dados.SQE_ID_CODIGO },
      });
      if (!exist) {
        throw new HttpException('Reembolso não encontrado', HttpStatus.NOT_FOUND);
      }
      await this.reembolsoRepository.query(
        `UPDATE FINANCEIRO.S009_REEMBOLSO
         SET RRE_JUSTIFICATIVA = :rreJustificativa,
             RRE_SAQUE = :rreSaque
         WHERE SQE_ID_CODIGO = :sqeIdCodigo`,
        [dados.RRE_JUSTIFICATIVA, dados.RRE_SAQUE, dados.SQE_ID_CODIGO],
      );
      return true;
    } catch (error) {
      throw new HttpException(
        'Erro ao atualizar a justificativa',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  
  async findone(SQE_ID_CODIGO: number): Promise<reembolsoDto> {
    try {
      const result = await this.reembolsoRepository
      .createQueryBuilder('r')
      .where('r.SQE_ID_CODIGO = :codigo', { codigo: SQE_ID_CODIGO })
      .maxExecutionTime(10000)
      .cache(false)
      .getOne();

      return result;

    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error('Erro ao buscar registro:', error);

      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  //update
  async update(ree: updateDto): Promise<{ message: string }> {
    try {
      const codigo = Number(ree.RRE_ID_CODIGO);
      const reembolsoExist = await this.findone(codigo);

      if (!reembolsoExist) {
        throw new HttpException('Reembolso não encontrado', HttpStatus.NOT_FOUND);
      }

      const dados = {
        REE_AUTORIZADO: ree.REE_AUTORIZADO,
        RRE_JUSTIFICATIVA: ree.RRE_JUSTIFICATIVA,
        RRE_SAQUE: ree.RRE_SAQUE,
      };

      await this.reembolsoRepository.update(ree.RRE_ID_CODIGO, dados);

      return { message: 'Atualizado com sucesso!!!' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
