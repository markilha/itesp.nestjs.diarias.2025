import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { agruparecursoEntity } from '../database/db_oracle/entities/agruparecurso.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { FindAllParams } from './agruparecursoDto';

@Injectable()
export class agruparecursoService {
  constructor(
    @InjectRepository(agruparecursoEntity, 'oracleConnection')
    private agruparecursoRepository: Repository<agruparecursoEntity>,
  ) {}

  //create
  async create(agruparecursoDto: Partial<agruparecursoEntity>): Promise<agruparecursoEntity> {
    try {
      return await this.agruparecursoRepository.save(
        this.agruparecursoRepository.create(agruparecursoDto),
      );
    } catch (error) {
      throw new HttpException('Não foi possível criar o cargo', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAll(params: FindAllParams): Promise<agruparecursoEntity[]> {
    try {
      const searchParams: FindOptionsWhere<agruparecursoEntity> = {};

      if (params.AGS_ID_CODIGO) {
        searchParams['AGS_ID_CODIGO'] = params.AGS_ID_CODIGO;
      }

      if (params.DIR_ID_CODIGO) {
        searchParams['DIR_ID_CODIGO'] = params.DIR_ID_CODIGO;
      }

      return await this.agruparecursoRepository.find({
        where: searchParams    
      });
   
    } catch (error) {
      console.log(error);
      throw new HttpException('Não foi possível buscar grupos', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  

  async findOne(AGS_ID_CODIGO: number): Promise<agruparecursoEntity> {
    try {
      return await this.agruparecursoRepository.findOneOrFail({
        where: { AGS_ID_CODIGO },
      });
    } catch (error) {
      throw new HttpException('Grupo não encontrado', HttpStatus.NOT_FOUND);
    }
  }

}
