import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DespesaDiariaEntity } from '../database/db_oracle/entities/despesaDiaria.entity';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { FindAllParams } from './despesadiariaDto';

@Injectable()
export class DespesadiariaService {
  constructor(
    @InjectRepository(DespesaDiariaEntity, 'oracleConnection')
    private despesaRepository: Repository<DespesaDiariaEntity>,
  ) {}

  async findAll(params: FindAllParams): Promise<DespesaDiariaEntity[]> {
    try {
      const searchParams: FindOptionsWhere<DespesaDiariaEntity> = {};

      if (params.nome) {
        searchParams['nome'] = ILike(`%${params.nome}%`);
      }

      if (params.cargo) {
        searchParams['cargo'] = params.cargo;
      }

      return await this.despesaRepository.find({
        where: searchParams,
      });
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  //findone
  async findOne(cargo: string): Promise<DespesaDiariaEntity> {
    try {
      return await this.despesaRepository.findOne({
        where: { cargo: cargo }, 
      });
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  
}
