import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PcargoEntity } from '../database/db_oracle/entities/pcargo.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { FindAllParams, PcargoDto, PcargoDtoCreate, PcargoDtoUpdate } from './pcargoDto';
import { getPaginatedQuery } from '../util/paginacao/paginaQuery';

@Injectable()
export class PcargoService {
  constructor(
    @InjectRepository(PcargoEntity, 'oracleConnection')
    private pcargoRepository: Repository<PcargoEntity>,
  ) {}

  //create
  async create(pcargoDto: PcargoDtoCreate): Promise<PcargoDto> {
    try {
      return await this.pcargoRepository.save(this.pcargoRepository.create(pcargoDto));
    } catch (error) {
      throw new HttpException('Não foi possível criar o cargo', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  async findAll(params: FindAllParams): Promise<PcargoDto[]> {
    try {
      const pageNumber = params.page ?? 1;
      const pageSize = params.limit ?? 500;
      const startRow = (pageNumber - 1) * pageSize + 1;
      const endRow = pageNumber * pageSize;

      const searchParams: FindOptionsWhere<PcargoDto> = {};

      if (params.codigo) {
        searchParams['codigo'] = params.codigo;
      }
      if (params.nome) {
        searchParams['nome'] = params.nome;
      }
      if (params.ufesp) {
        searchParams['ufesp'] = params.ufesp;
      }

      const queryBuilder = this.pcargoRepository
        .createQueryBuilder('r')
        .select([
          'r.codigo as "codigo"',
          'r.nome as "nome"',
          'r.inativo as "inativo"',                
        ])
        .where(searchParams);

      const paginatedQuery = getPaginatedQuery(queryBuilder, startRow, endRow);
      const parameters = Object.values(queryBuilder.getParameters());
      const result = await this.pcargoRepository.query(paginatedQuery, parameters);

      return result;
    } catch (error) {
      console.log(error);
      throw new HttpException('Não foi possível buscar os cargos', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
 
 async findOne(codigo: string) {
     try {
       const result = await this.pcargoRepository
         .createQueryBuilder('r')
         .where('r.codigo = :codigo', { codigo: codigo })
         .maxExecutionTime(10000)
         .cache(false)
         .getOne();
 
       if (!result) {
         throw new HttpException('Não encontrou nenhum registro', HttpStatus.NOT_FOUND);
       }
       return result;
     } catch (error) {
       if (error instanceof HttpException) {
         throw error;
       }
       console.error('Erro ao buscar registro:', error);
 
       throw new HttpException('Erro ao buscar registro', HttpStatus.INTERNAL_SERVER_ERROR);
     }
   }
  //update
  async update(pcargoDto: PcargoDtoUpdate): Promise<PcargoDto> {
    const pcargo = await this.findOne(pcargoDto.codigo);
    this.pcargoRepository.merge(pcargo, pcargoDto);
    return await this.pcargoRepository.save(pcargo);
  }

  async delete(codigo: string) {
    await this.findOne(codigo);
    await this.pcargoRepository.delete({ codigo: codigo });
  }
}
