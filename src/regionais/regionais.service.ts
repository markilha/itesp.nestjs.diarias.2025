import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { RegionalEntity } from '../database/db_oracle/entities/regionalEntity';
import { PaginatedRegionaisDto } from './dtos/paginated-regionais.dto';
import { RegionaisDto } from './dtos/regionais.dto';
import { RegionaisParamsDto } from './dtos/regionais-params.dto';

@Injectable()
export class RegionaisService {
  constructor(
    @InjectRepository(RegionalEntity, 'oracleConnection')
    private readonly repository: Repository<RegionalEntity>,
  ) {}

  async findAll(params: RegionaisParamsDto): Promise<PaginatedRegionaisDto> {
    const totalQuery = await this.repository.query(
      'SELECT COUNT(*) as total FROM "COMUM"."S000_REGIONAL"'
    );
    const total = parseInt(totalQuery[0].TOTAL);

    const page = +params.page; // 1
    const limit = +params.limit || 100; //5

    const data = await this.repository
      .createQueryBuilder()
      .select('REG_ID_CODIGO', 'REG_ID_CODIGO')
      .addSelect('REG_DESCRICAO', 'REG_DESCRICAO')
      .where('1 = 1')
      .andWhere(
        `
          ROWNUM BETWEEN :min AND :max
        `,
        {
          min: 2, // page * limit, // 5
          max: 3, // (page * limit) + (limit), // 9
        },
      )
      .orderBy('REG_ID_CODIGO')
      .getRawMany();

    console.log(data);

    return {
      page,
      count: total,
      dataCount: data.length,
      pageCount: Math.ceil(total / limit),
      data: data.map((regional) => new RegionaisDto(regional)),
    };
  }

  async findOne(id: number): Promise<RegionaisDto> {
    const regional = await this.repository.findOne({ where: { REG_ID_CODIGO: id } });
    return new RegionaisDto(regional);
  }
}
