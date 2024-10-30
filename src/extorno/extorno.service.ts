import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { extornoEntity } from 'src/database/db_oracle/entities/extorno.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { FindAllParams, extornoDto } from './extornoDto';

@Injectable()
export class extornoService {
  constructor(
    @InjectRepository(extornoEntity, 'oracleConnection')
    private extornoRepository: Repository<extornoEntity>,
  ) {}

  async findAll(params: FindAllParams): Promise<extornoDto[]> {
    try {
      const searchParams: FindOptionsWhere<extornoDto> = {};
      if (params.SQE_ID_CODIGO) {
        searchParams['SQE_ID_CODIGO'] = params.SQE_ID_CODIGO;
      }

      if (params.page && params.limit) {
        const page = params.page;
        const limit = params.limit;
        const skip = (page - 1) * limit;

        return await this.extornoRepository.find({
          where: searchParams,
          skip,
          take: limit,
        });
      }

      return await this.extornoRepository.find({
        where: searchParams,
      });
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Não foi possível buscar os extornos',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async findOne(SQE_ID_CODIGO: number): Promise<extornoDto> {
    try {
      return await this.extornoRepository.findOne({
        where: {
          SQE_ID_CODIGO,
        },
      });
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Não foi possível buscar o extorno',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async create(extorno: extornoDto): Promise<extornoDto> {
    try {
      return await this.extornoRepository.save(extorno);
    } catch (error) {      
      throw new HttpException(
        'Não foi possível criar o extorno',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
