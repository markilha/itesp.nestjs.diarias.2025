import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Psecao } from 'src/database/db_oracle/entities/psecao.entity';

import { getPaginatedQuery } from '../util/paginacao/paginaQuery';
import { FindAllParams } from './dtos/psecao.dto';

@Injectable()
export class PsecaoService {
  constructor(
    @InjectRepository(Psecao, 'oracleConnection')
    private readonly repository: Repository<Psecao>,
  ) {}

  async findAll(params: FindAllParams): Promise<{
    total: number;
    pagina: number;
    data: Psecao[];
  }> {
    const page = params.page ?? 1;
    const limit = params.limit ?? 500;
    const startRow = (page - 1) * limit + 1;
    const endRow = page * limit;

    const query = this.repository
      .createQueryBuilder('r')
      .select([
        'r.CODIGO AS CODIGO',
        'r.DESCRICAO AS DESCRICAO',
        'r.CIDADE AS CIDADE',
        'r.CGC AS CGC',
      ])
      .orderBy('r.CODIGO', 'ASC');

    if (params.codigo) {
      query.andWhere('r.CODIGO = :codigo', { codigo: params.codigo });
    }

    if (params.descricao) {
      query.andWhere('r.DESCRICAO LIKE :descricao', {
        descricao: `%${params.descricao}%`,
      });
    }

    if (params.cidade) {
      query.andWhere('r.CIDADE LIKE :cidade', {
        cidade: `%${params.cidade}%`,
      });
    }
    if (params.page && params.limit) {
      const paginatedQuery = getPaginatedQuery(query, startRow, endRow);
      const entities: Array<Psecao & { TOTAL_COUNT: number }> =
        await this.repository.query(paginatedQuery);

      const total = entities.length > 0 ? entities[0].TOTAL_COUNT : 0;
      const data = entities.map((entity) => new Psecao(entity));

      return {
        total,
        pagina: page,
        data,
      };
    } else {
      const entities = await query.getRawMany();
      return {
        total: entities.length,
        pagina: page,
        data: entities,
      };
    }
  }
}
