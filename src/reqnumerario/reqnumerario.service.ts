import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { FindOptionsWhere, Repository } from 'typeorm';
import { FindAllParams, ReqnumerarioDto } from './reqnumerarioDto';
import { ReqNumerarioEntity } from '../database/db_oracle/entities/reqnumerario.entity';

@Injectable()
export class ReqnumerarioService {
  constructor(   
    @InjectRepository(ReqNumerarioEntity, 'oracleConnection')
    private readonly renumerarioRepository: Repository<ReqNumerarioEntity>
  ) {}

  async findAll(params: FindAllParams): Promise<ReqnumerarioDto[]> {
    try {
      const searchParams: FindOptionsWhere<ReqNumerarioEntity> = {};

      if (params.RNU_ID_CODIGO) {
        searchParams.RNU_ID_CODIGO = params.RNU_ID_CODIGO;
      }
      if (params.REQ_ID_CODIGO) {
        searchParams.REQ_ID_CODIGO = params.REQ_ID_CODIGO;
      }

      let reqnumerarios: ReqNumerarioEntity[] = [];

      if (params.page && params.limit) {
        const page = params.page;
        const limit = params.limit;
        const skip = (page - 1) * limit;

        reqnumerarios = await this.renumerarioRepository.find({
          where: searchParams,
          skip,
          take: limit,
        });
      } else {
        reqnumerarios = await this.renumerarioRepository.find({
          where: searchParams,
        });
      }
      return reqnumerarios.map((reqv) => new ReqnumerarioDto(reqv));
    } catch (error) {
      throw new HttpException(
        'Erro ao buscar as requisições',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  //find one pelo sqe_id_codigo
  async findOne(SQE_ID_CODIGO: number): Promise<ReqnumerarioDto> {
    try {
      const reqnumerario = await this.renumerarioRepository.findOne({
        where: { SQE_ID_CODIGO},
      });
      return new ReqnumerarioDto(reqnumerario);
    } catch (error) {
      throw new HttpException(
        'Erro ao buscar numerario',
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
      const newReqnumerario = await this.renumerarioRepository.save(
        reqnumerario,
      );
      return new ReqnumerarioDto(newReqnumerario);
    } catch (error) {
      throw new HttpException(
        'Erro ao criar o numerario',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

 

  // async findTotalReNumerarioMesAtual(chapa: string): Promise<number> {
  //   try {
  //     const dataAtual = new Date();
  //     const primeiroDiaMes = new Date(
  //       dataAtual.getFullYear(),
  //       dataAtual.getMonth(),
  //       1,
  //     );
  //     const ultimoDiaMes = new Date(
  //       dataAtual.getFullYear(),
  //       dataAtual.getMonth() + 1,
  //       0,
  //     );

  //     const total = await this.mysqlRepository
  //       .createQueryBuilder('s009_reqnumerario')
  //       .select(
  //         'SUM(COALESCE(s009_reqnumerario.RNU_VLINTEGRAL, 0) + COALESCE(s009_reqnumerario.RNU_VLPARCIAL, 0))',
  //         'total',
  //       )
  //       .where('s009_reqnumerario.RNU_DTINICIO BETWEEN :inicio AND :fim', {
  //         inicio: primeiroDiaMes,
  //         fim: ultimoDiaMes,
  //       })
  //       .andWhere('s009_reqnumerario.CHAPA = :chapa', { chapa })
  //       .getRawOne();

  //     return total.total || 0;
  //   } catch (error) {
  //     throw new HttpException(
  //       error.response || 'Erro ao buscar o total de requisições',
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //     );
  //   }
  // }
}
