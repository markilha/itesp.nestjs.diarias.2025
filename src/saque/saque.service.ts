import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FindAllParams, SaqueDto } from './saque.dto';

import { SaqueEntity } from 'src/database/db_mysql/entities/saque.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';

@Injectable()
export class SaqueService {
  constructor(
    @InjectRepository(SaqueEntity, 'mysqlConnection')
    private saqueRepository: Repository<SaqueEntity>,
  ) {}

  async findAll(params: FindAllParams): Promise<SaqueDto[]> {     
    
    try {
      const searchParams: FindOptionsWhere<SaqueDto> = {};
      if (params.sqeIdCodigo) {
        searchParams['sqeIdCodigo'] = params.sqeIdCodigo;
      }

      if (params.page && params.limit) {
        const page = params.page;
        const limit = params.limit;
        const skip = (page - 1) * limit;

        return await this.saqueRepository.find({
          where: searchParams,
          skip,
          take: limit,
        });
      }

      return await this.saqueRepository.find({
        where: searchParams,
      });
    } catch (error) {
      throw new HttpException('Não foi possível buscar cargos', HttpStatus.INTERNAL_SERVER_ERROR);   
    }
  }

  async findOne(codigo: number): Promise<SaqueDto> {
    try {
      return await this.saqueRepository.findOne({
        where: { sqeIdCodigo: codigo },
      });
    } catch (error) {
      throw new HttpException('Não foi possível busca o cargo', HttpStatus.INTERNAL_SERVER_ERROR); 
    }
  }
}
