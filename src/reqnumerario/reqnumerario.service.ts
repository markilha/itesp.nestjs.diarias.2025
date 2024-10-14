import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { FindOptionsWhere, Repository } from 'typeorm';
import { CreateReqnumerarioDto, FindAllParams, ReturnReqnumerarioDto } from './reqnumerarioDto';
import { ReqNumerarioEntity } from 'src/database/db_mysql/entities/ReqNumerario.entity';
import { SaqueEntity } from 'src/database/db_mysql/entities/saque.entity';
import { SaqueService } from 'src/saque/saque.service';

@Injectable()
export class ReqnumerarioService {
  constructor(
    @InjectRepository(ReqNumerarioEntity, 'mysqlConnection')
    private readonly mysqlRepository: Repository<ReqNumerarioEntity>,

    private readonly saqueRepository: SaqueService,
  ) {}

  async findAll(params: FindAllParams): Promise<ReturnReqnumerarioDto[]> {
    try {
      const searchParams: FindOptionsWhere<ReqNumerarioEntity> = {};

      if (params.rnuIdCodigo) {
        searchParams.rnuIdCodigo = params.rnuIdCodigo;
      }
      if (params.reqIdCodigo) {
        searchParams.reqIdCodigo = params.reqIdCodigo;
      }

      let reqnumerarios: ReqNumerarioEntity[] = [];

      if (params.page && params.limit) {
        const page = params.page;
        const limit = params.limit;
        const skip = (page - 1) * limit;

        reqnumerarios = await this.mysqlRepository.find({
          where: searchParams,
          skip,
          take: limit,
        });
      } else {
        reqnumerarios = await this.mysqlRepository.find({
          where: searchParams,
        });
      }
      return reqnumerarios.map((reqv) => new ReturnReqnumerarioDto(reqv));
    } catch (error) {
      throw new HttpException(
        'Erro ao buscar as requisições',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

 

  async findTotalReNumerarioMesAtual(chapa: string): Promise<number> {
    try {
      const dataAtual = new Date();
      const primeiroDiaMes = new Date(
        dataAtual.getFullYear(),
        dataAtual.getMonth(),
        1,
      );
      const ultimoDiaMes = new Date(
        dataAtual.getFullYear(),
        dataAtual.getMonth() + 1,
        0,
      );

      const total = await this.mysqlRepository
        .createQueryBuilder('s009_reqnumerario')
        .select(
          'SUM(COALESCE(s009_reqnumerario.RNU_VLINTEGRAL, 0) + COALESCE(s009_reqnumerario.RNU_VLPARCIAL, 0))',
          'total',
        )
        .where('s009_reqnumerario.RNU_DTINICIO BETWEEN :inicio AND :fim', {
          inicio: primeiroDiaMes,
          fim: ultimoDiaMes,
        })
        .andWhere('s009_reqnumerario.CHAPA = :chapa', { chapa })
        .getRawOne();

      return total.total || 0;
    } catch (error) {
      throw new HttpException(
        error.response || 'Erro ao buscar o total de requisições',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
