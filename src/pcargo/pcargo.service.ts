import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PcargoEntity } from 'src/database/db_oracle/entities/pcargo.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { FindAllParams, PcargoDto } from './pcargoDto';

@Injectable()
export class PcargoService {
  constructor(
    @InjectRepository(PcargoEntity, 'oracleConnection')
    private pcargoRepository: Repository<PcargoEntity>,
  ) {}

  async findAll(params: FindAllParams): Promise<PcargoDto[]> {     
    try {
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
    } catch (error) {
      console.log(error);
      throw new HttpException('Não foi possível buscar cargos', HttpStatus.INTERNAL_SERVER_ERROR);   
    }
  }

  async findOne(codigo: string): Promise<PcargoDto> {
    try {
      return await this.pcargoRepository.findOne({
        where: { codigo: codigo },
      });
    } catch (error) {
      throw new HttpException('Não foi possível busca o cargo', HttpStatus.INTERNAL_SERVER_ERROR); 
    }
  }
}
