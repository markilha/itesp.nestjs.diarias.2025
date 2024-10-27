import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { FindOptionsWhere, Repository } from 'typeorm';
import { FindAllParams, reembolsoDto } from './reembolsoDto';
import { reembolsoEntity } from 'src/database/db_oracle/entities/reembolso.entity';

@Injectable()
export class reembolsoService {
  constructor(   
    @InjectRepository(reembolsoEntity, 'oracleConnection')
    private readonly reembolsoRepository: Repository<reembolsoEntity>
  ) {}

  async findAll(params: FindAllParams): Promise<reembolsoDto[]> {
    try {
      const searchParams: FindOptionsWhere<reembolsoEntity> = {};

      if (params.ITE_ID_CODIGO) {
        searchParams.ITE_ID_CODIGO = params.ITE_ID_CODIGO;
      }
      if (params.SQE_ID_CODIGO) {
        searchParams.SQE_ID_CODIGO = params.SQE_ID_CODIGO;
      }

      let reembolsos: reembolsoEntity[] = [];

      if (params.page && params.limit) {
        const page = params.page;
        const limit = params.limit;
        const skip = (page - 1) * limit;

        reembolsos = await this.reembolsoRepository.find({
          where: searchParams,
          skip,
          take: limit,
        });
      } else {
        reembolsos = await this.reembolsoRepository.find({
          where: searchParams,
        });
      }
      return reembolsos.map((reqv) => new reembolsoDto(reqv));
    } catch (error) {
      throw new HttpException(
        'Erro ao buscar as requisições',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }


  async create(reembolso: reembolsoDto): Promise<reembolsoDto> {
    try {
      const newreembolso = await this.reembolsoRepository.save(
        reembolso,
      );
      return new reembolsoDto(newreembolso);
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Erro ao criar o reembolso',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  } 

}
