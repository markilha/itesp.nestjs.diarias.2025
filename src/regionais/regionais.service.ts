import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { RegionalEntity } from '../database/db_oracle/entities/regionalEntity';
import { RegionaisDto } from './dtos/regionais.dto';
import { RegionaisParamsDto } from './dtos/regionais-params.dto';
import { getPaginatedQuery } from '../util/paginacao/paginaQuery';

@Injectable()
export class RegionaisService {

  constructor(
    @InjectRepository(RegionalEntity, 'oracleConnection')
    private readonly repository: Repository<RegionalEntity>,
  ) {}

  async findAll(params: RegionaisParamsDto): Promise<[number, RegionalEntity[]]> {
    const page = params.page ?? 1;
    const limit = params.limit ?? 500;

    const startRow = (page - 1) * limit + 1;
    const endRow = page * limit;

    const query = this.repository
      .createQueryBuilder('r')
      .select(['r.REG_ID_CODIGO as "REG_ID_CODIGO"', 'r.REG_DESCRICAO as "REG_DESCRICAO"'])
      .orderBy('r.REG_DESCRICAO', 'ASC');

    const paginatedQuery = getPaginatedQuery(query, startRow, endRow);
    const entities: Array<RegionalEntity & { TOTAL_COUNT: number }> =
      await this.repository.query(paginatedQuery);

    return [entities[0].TOTAL_COUNT, entities.map((entity) => new RegionalEntity(entity))];
  }

  async findOne(id: number): Promise<RegionaisDto> {
    const regional = await this.repository.findOne({ where: { REG_ID_CODIGO: id } });
    return new RegionaisDto(regional);
  }
}
