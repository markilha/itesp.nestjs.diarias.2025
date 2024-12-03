import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { pcontasnumEntity } from 'src/database/db_oracle/entities/pcontasnum';
import { FindOptionsWhere, Repository } from 'typeorm';
import { FindAllParams, pcontasNumDto } from './pcontasnumDto';

@Injectable()
export class PcontasNumService {
  constructor(
    @InjectRepository(pcontasnumEntity, 'oracleConnection')
    private pcontasnumRepository: Repository<pcontasnumEntity>,
  ) {}

  async findAll(params: FindAllParams): Promise<pcontasNumDto[]> {
    try {
      const searchParams: FindOptionsWhere<pcontasNumDto> = {};
      if (params.PCO_ID_CODIGO) {
        searchParams['PCO_ID_CODIGO'] = Number(params.PCO_ID_CODIGO);
      }

      if (params.page && params.limit) {
        const page = params.page;
        const limit = params.limit;
        const skip = (page - 1) * limit;

        return await this.pcontasnumRepository.find({
          where: searchParams,
          skip,
          take: limit,
        });
      }

      return await this.pcontasnumRepository.find({
        where: searchParams,
      });
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Não foi possível as prestações de conta numerario',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(RNU_ID_CODIGO: number): Promise<pcontasNumDto> {
    try {
      return await this.pcontasnumRepository.findOne({
        where: { RNU_ID_CODIGO },
      });
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Não foi possível as prestações de conta numerario',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async create(data: pcontasNumDto): Promise<pcontasNumDto> {
    try {
      const pcontasnum = this.pcontasnumRepository.create(data);
      await this.pcontasnumRepository.save(pcontasnum);
      return pcontasnum;
    } catch (error) {     
      throw new HttpException(
        'Não foi possível criar a prestação de conta numerario',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
