import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { docpcontasnumEntity } from '../database/db_oracle/entities/docpcontasnum.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { FindAllParams, returnData } from './docpcontasnumDto';
import { http } from 'winston';

@Injectable()
export class docpcontasnumService {
  constructor(
    @InjectRepository(docpcontasnumEntity, 'oracleConnection')
    private docpcontasnumRepository: Repository<docpcontasnumEntity>,
  ) {}

  async findAll(params: FindAllParams): Promise<returnData> {
    try {
      const searchParams: FindOptionsWhere<docpcontasnumEntity> = {};
      if (params.SQE_ID_CODIGO) {
        searchParams['SQE_ID_CODIGO'] = params.SQE_ID_CODIGO;
      }
      if (params.PCO_ID_CODIGO) {
        searchParams['PCO_ID_CODIGO'] = params.PCO_ID_CODIGO;
      }
      if (params.REG_ID_CODIGO) {
        searchParams['REG_ID_CODIGO'] = params.REG_ID_CODIGO;
      }
      if (params.CHAPA) {
        searchParams['CHAPA'] = params.CHAPA;
      }

      let dados: docpcontasnumEntity[] = [];

      if (params.page && params.limit) {
        const page = params.page;
        const limit = params.limit;
        const skip = (page - 1) * limit;

        dados = await this.docpcontasnumRepository.find({
          where: searchParams,
          skip,
          take: limit,
        });
      }

      dados = await this.docpcontasnumRepository.find({
        where: searchParams,
      });

      return {
        data: dados,
        total: dados.length,
      };
    } catch (error) {
      throw new HttpException('Não foi possível buscar os docs', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOne(SQE_ID_CODIGO: number): Promise<docpcontasnumEntity> {
    try {
      return await this.docpcontasnumRepository.findOneOrFail({
        where: { SQE_ID_CODIGO },
      });
    } catch (error) {      
      throw new HttpException("Não encontrou nenhum registro", HttpStatus.NOT_FOUND);
    }
  }
}
