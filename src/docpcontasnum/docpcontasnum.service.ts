import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { docpcontasnumEntity } from '../database/db_oracle/entities/docpcontasnum.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { FindAllParams } from './docpcontasnumDto';

import { permissaoFindAll } from '../util/permissao/permissao';
import { AuthUserDto } from '../auth/use.auth.Dto';
import { getPaginatedQuery } from '../util/paginacao/paginaQuery';
import { ErrorMessages } from '../components/error/error.constants';

@Injectable()
export class docpcontasnumService {
  constructor(
    @InjectRepository(docpcontasnumEntity, 'oracleConnection')
    private docpcontasnumRepository: Repository<docpcontasnumEntity>,
  ) {}

  async findAll(params: FindAllParams, user: AuthUserDto): Promise<any> {
    try {
      const pageNumber = params.page ?? 1;
      const pageSize = params.limit ?? 500;
      const startRow = (pageNumber - 1) * pageSize + 1;
      const endRow = pageNumber * pageSize;

      const searchParams: FindOptionsWhere<docpcontasnumEntity> = {};
      if (params.SQE_ID_CODIGO) {
        searchParams['SQE_ID_CODIGO'] = params.SQE_ID_CODIGO;
      }
      if (params.PCO_ID_CODIGO) {
        searchParams['PCO_ID_CODIGO'] = params.PCO_ID_CODIGO;
      }
      if (params.REG_ID_CODIGO) {
        searchParams['REG_ID_CODIGO'] = params.REG_ID_CODIGO;
      }

      const queryBuilder = this.docpcontasnumRepository
        .createQueryBuilder('r')
        .select([
          'r.NDO_ID_CODIGO as NDO_ID_CODIGO',
          'r.SQE_ID_CODIGO as SQE_ID_CODIGO',
          'r.PCO_ID_CODIGO as PCO_ID_CODIGO',
          'r.PES_ID_CODIGO as PES_ID_CODIGO',
          'r.PES_PESSOA as PES_PESSOA',
          'r.NDO_ID_NUMERO as NDO_ID_NUMERO',
          'r.NDO_DATA as NDO_DATA',
          'r.NDO_DTENTREGA as NDO_DTENTREGA',
          'r.NDO_OPERADOR as NDO_OPERADOR',
          'r.STS_ID_CODIGO as STS_ID_CODIGO',
          'r.NDO_SERIE as NDO_SERIE',
          'r.NDO_TITULO as NDO_TITULO',
          'r.PES_NOME as PES_NOME',
          'r.CHAPA as CHAPA',
          'r.NOME as NOME',
          'r.CODIGO as CODIGO',
          'r.DESCRICAO as DESCRICAO',
          'r.VALORTOTAL as VALORTOTAL',
          'r.SQE_DTPREST as SQE_DTPREST',
          'r.TDE_DESCRICAO as TDE_DESCRICAO',
          'r.TDE_ID_CODIGO as TDE_ID_CODIGO',
          'r.SQE_VLSAQUE as SQE_VLSAQUE',
          'r.SQE_VLPREST as SQE_VLPREST',
          'r.SQE_DTSAQUE as SQE_DTSAQUE',
          'r.PCO_TIPO as PCO_TIPO',
          'r.PCO_TOTDOC as PCO_TOTDOC',
          'r.PRA_ID_CODIGO as PRA_ID_CODIGO',
          'r.REQ_ID_CODIGO as REQ_ID_CODIGO',
          'r.SQE_EFETIVO as SQE_EFETIVO',
          'r.REG_ID_CODIGO as REG_ID_CODIGO',
          'fs.CODSECAO as CODSECAO',
        ])
        .leftJoin('PFUNC', 'fs', 'r.CHAPA = fs.CHAPA')
        .where(searchParams);

      const per = permissaoFindAll(user.permissao);

      if (per) {
        queryBuilder.andWhere('fs.CODSECAO LIKE :codsecao', {
          codsecao: `${user.codsecao.substring(0, per)}%`,
        });
      } else if (params.CHAPA) {
        queryBuilder.andWhere('r.CHAPA = :chapa', { chapa: user.chapa });
      }

      const paginatedQuery = getPaginatedQuery(queryBuilder, startRow, endRow);
      const parameters = Object.values(queryBuilder.getParameters());
      const result = await this.docpcontasnumRepository.query(paginatedQuery, parameters);

      return result;
    } catch (error) {
      throw new HttpException(ErrorMessages.INTERNAL_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOne(SQE_ID_CODIGO: number): Promise<docpcontasnumEntity> {
    try {
      const result = await this.docpcontasnumRepository
        .createQueryBuilder('r')
        .where('r.SQE_ID_CODIGO = :codigo', { codigo: SQE_ID_CODIGO })
        .getOne();

      if (!result) {
        throw new HttpException(ErrorMessages.NOT_FOUND, HttpStatus.NOT_FOUND);
      }
      return result;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(`${ErrorMessages.INTERNAL_ERROR}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
