import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReqNumerarioEntity } from 'src/database/db_oracle/entities/reqnumerario.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { FindAllParams } from './reqnumerarioDto';
import { ReqnumerarioDto } from './reqnumerarioDto';

@Injectable()
export class ReqnumerarioService {
  constructor(
    @InjectRepository(ReqNumerarioEntity)
    private readonly reqviagemRepository: Repository<ReqNumerarioEntity>,
  ) {}

  async findAll(params: FindAllParams): Promise<ReqnumerarioDto[]> {
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

        reqnumerarios = await this.reqviagemRepository.find({
          where: searchParams,
          skip,
          take: limit,
        });
      } else {
        reqnumerarios = await this.reqviagemRepository.find({
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
}
