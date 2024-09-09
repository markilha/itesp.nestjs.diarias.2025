import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReqViagemEntity } from 'src/database/db_oracle/entities/reqviagem.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { FindAllParams,reqviagemDto } from './reqviagemDto';


@Injectable()
export class ReqviagemService {
  constructor(
    @InjectRepository(ReqViagemEntity)
    private readonly reqviagemRepository: Repository<ReqViagemEntity>,
  ) {}

  async findAll(params: FindAllParams): Promise<reqviagemDto[]> {
    try {
      const searchParams: FindOptionsWhere<ReqViagemEntity> = {};
      if (params.reqIdCodigo) {
        searchParams.reqIdCodigo = params.reqIdCodigo;
      }

      let reqviagems: ReqViagemEntity[] = [];

      if (params.page && params.limit) {
        const page = params.page;
        const limit = params.limit;
        const skip = (page - 1) * limit;

        reqviagems = await this.reqviagemRepository.find({
          where: searchParams,
          skip,
          take: limit,
        });
      } else {
        reqviagems = await this.reqviagemRepository.find({
          where: searchParams,
        });
      }

      return reqviagems.map((reqv) => new reqviagemDto(reqv));
    } catch (error) {
      throw new HttpException(
        'Erro ao buscar as requisições',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
