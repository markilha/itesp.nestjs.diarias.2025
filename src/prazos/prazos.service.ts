import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PrazosEntity } from '../database/db_oracle/entities/prazos.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { FindAllParams, PrazosDto } from './prazosDto';

@Injectable()
export class PrazosService {
  constructor(
    @InjectRepository(PrazosEntity, 'oracleConnection')
    private PrazosRepository: Repository<PrazosEntity>,
  ) {}

  async findAll(params: FindAllParams): Promise<PrazosDto[]> {
    try {
      const searchParams: FindOptionsWhere<PrazosDto> = {};
      if (params.PRA_ID_CODIGO) {
        searchParams['PRA_ID_CODIGO'] = params.PRA_ID_CODIGO;
      }
      if (params.REG_ID_CODIGO) {
        searchParams['REG_ID_CODIGO'] = params.REG_ID_CODIGO;
      }
      if (params.PRA_ATIVO) {
        searchParams['PRA_ATIVO'] = params.PRA_ATIVO;
      }
      if (params.page && params.limit) {
        const page = params.page;
        const limit = params.limit;
        const skip = (page - 1) * limit;

        return await this.PrazosRepository.find({
          where: searchParams,
          skip,
          take: limit,
        });
      }

      return await this.PrazosRepository.find({
        where: searchParams,
      });
    } catch (error) {
      throw new HttpException('Não foi possível buscar cargos', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }  

  async findOne(PRA_ID_CODIGO: number) {
    try {
      return await this.PrazosRepository.findOneOrFail({
        where: { PRA_ID_CODIGO },
      });
    } catch (error) {
      throw new HttpException('Prazo não encontrado', HttpStatus.NOT_FOUND);
    }
  }
}
