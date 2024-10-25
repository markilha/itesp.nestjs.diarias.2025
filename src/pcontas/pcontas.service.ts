import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { pcontasEntity } from 'src/database/db_oracle/entities/pcontas.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { FindAllParams, pcontasDto } from './pcontasDto';

@Injectable()
export class PcontasService {
  constructor(
    @InjectRepository(pcontasEntity, 'oracleConnection')
    private pcontasRepository: Repository<pcontasEntity>,
  ) {}

  async findAll(params: FindAllParams): Promise<pcontasDto[]> {
    try {
      const searchParams: FindOptionsWhere<pcontasDto> = {};
      if (params.PCO_ID_CODIGO) {
        searchParams['PCO_ID_CODIGO'] = Number(params.PCO_ID_CODIGO);
      }

      if (params.page && params.limit) {
        const page = params.page;
        const limit = params.limit;
        const skip = (page - 1) * limit;

        return await this.pcontasRepository.find({
          where: searchParams,
          skip,
          take: limit,
        });
      }

      return await this.pcontasRepository.find({
        where: searchParams,
      });
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Não foi possível as prestações de conta',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async findOne(PCO_ID_CODIGO: number): Promise<pcontasDto> {
    try {
      return await this.pcontasRepository.findOne({
        where: {
          PCO_ID_CODIGO,
        },
      });
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Não foi possível as prestações de conta',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
