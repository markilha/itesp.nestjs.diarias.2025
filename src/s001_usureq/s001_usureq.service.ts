import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { S001Usureq } from 'src/database/db_oracle/entities/usureq.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { FindAllParams } from './usureqDto';

@Injectable()
export class S001UsureqService {
  constructor(
    @InjectRepository(S001Usureq)
    private usureqRepository: Repository<S001Usureq>,
  ) {}

  async findAll(params: FindAllParams): Promise<S001Usureq[]> {
    const searchParams: FindOptionsWhere<S001Usureq> = {};

    if (params.reqIdCodigo) {
      searchParams.reqIdCodigo = params.reqIdCodigo;
    }

    if (params.page && params.limit) {
      const page = params.page;
      const limit = params.limit;
      const skip = (page - 1) * limit;

      return await this.usureqRepository.find({
        where: searchParams,
        skip,
        take: limit,
      });
    }

    return await this.usureqRepository.find({
      where: searchParams,
    });
  }
}
