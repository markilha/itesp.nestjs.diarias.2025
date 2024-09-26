import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PcargoEntity } from 'src/database/db_mysql/entities/pcargoEntity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { FindAllParams, PcargoDto } from './pcargoDto';

@Injectable()
export class PcargoService {
  constructor(
    @InjectRepository(PcargoEntity, 'mysqlConnection')
    private pcargoRepository: Repository<PcargoEntity>,
  ) {}

  async findAll(params: FindAllParams): Promise<PcargoDto[]> {
    const searchParams: FindOptionsWhere<PcargoDto> = {};

    if (params.codigo) {
      searchParams['codigo'] = params.codigo;
    }

    if (params.page && params.limit) {
      const page = params.page;
      const limit = params.limit;
      const skip = (page - 1) * limit;

      return await this.pcargoRepository.find({
        where: searchParams,
        skip,
        take: limit,
      });
    }

    return await this.pcargoRepository.find({
      where: searchParams,
    });
  }

  async findOne(codigo: string): Promise<PcargoDto> {
    return await this.pcargoRepository.findOne({
        where: { codigo: codigo }
    });
  }
}
