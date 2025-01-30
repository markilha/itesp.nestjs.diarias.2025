import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { agruparecursoEntity } from '../database/db_oracle/entities/agruparecurso.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { FindAllParams } from './agruparecursoDto';
import { getPaginatedQuery } from '../util/paginacao/paginaQuery';

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

  async findAll(params: FindAllParams): Promise<any> {
    try {
      const pageNumber = params.page ?? 1;
      const pageSize = params.limit ?? 500;
      const startRow = (pageNumber - 1) * pageSize + 1;
      const endRow = pageNumber * pageSize;
      const searchParams: FindOptionsWhere<agruparecursoEntity> = {};

      if (params.AGS_ID_CODIGO) {
        searchParams['AGS_ID_CODIGO'] = params.AGS_ID_CODIGO;
      }

      if (params.DIR_ID_CODIGO) {
        searchParams['DIR_ID_CODIGO'] = params.DIR_ID_CODIGO;
      }

      const queryBuilder = this.agruparecursoRepository
        .createQueryBuilder('r')
        .select([
          'r.AGS_ID_CODIGO as AGS_ID_CODIGO',
          'r.DIR_ID_CODIGO as DIR_ID_CODIGO',
          'r.TDE_ID_CODIGO as TDE_ID_CODIGO',
          'r.STS_ID_CODIGO as STS_ID_CODIGO',
          'r.AGS_VALOR_SOLIC as AGS_VALOR_SOLIC',
          'r.AGS_VALOR_CONC as AGS_VALOR_CONC',
          'r.AGS_VALOR_PREST as AGS_VALOR_PREST',
          'r.AGS_OBSERVA as AGS_OBSERVA',
          'r.AGS_RECURSO as AGS_RECURSO',
        ])
        .where(searchParams);

      const paginatedQuery = getPaginatedQuery(queryBuilder, startRow, endRow);
      const parameters = Object.values(queryBuilder.getParameters());
      const result = await this.agruparecursoRepository.query(paginatedQuery, parameters);
      return result;
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
