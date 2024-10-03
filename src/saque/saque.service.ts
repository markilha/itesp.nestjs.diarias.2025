import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateSaqueDto, FindAllParams, SaqueDto, SaqueResultDto } from './saque.dto';

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
  
      if (params.stsIdCodigo) {
        searchParams['stsIdCodigo'] = params.stsIdCodigo;
      }
  
      const queryBuilder = this.saqueRepository.createQueryBuilder('saque')
        .leftJoinAndSelect('saque.status', 'status')
        .leftJoinAndSelect('saque.numerario', 'numerario');
  
      // Filtrar pela descrição do status, se fornecido
      if (params.stsDescricao) {
        queryBuilder.andWhere('status.stsDescricao = :statusDescricao', { statusDescricao: params.stsDescricao });
      }
  
      // Adicionar os outros filtros
      if (params.sqeIdCodigo) {
        queryBuilder.andWhere('saque.sqeIdCodigo = :sqeIdCodigo', { sqeIdCodigo: params.sqeIdCodigo });
      }
  
      if (params.stsIdCodigo) {
        queryBuilder.andWhere('saque.stsIdCodigo = :stsIdCodigo', { stsIdCodigo: params.stsIdCodigo });
      }
  
      // Paginação
      if (params.page && params.limit) {
        const page = params.page;
        const limit = params.limit;
        const skip = (page - 1) * limit;
  
        queryBuilder.skip(skip).take(limit);
      }
  
      return await queryBuilder.getMany();
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Não foi possível buscar os saques',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  

  // async findAll(params: FindAllParams): Promise<SaqueDto[]> {
  //   try {
  //     const searchParams: FindOptionsWhere<SaqueDto> = {};
  //     if (params.sqeIdCodigo) {
  //       searchParams['sqeIdCodigo'] = params.sqeIdCodigo;
  //     }

  //     if (params.stsIdCodigo) {
  //       searchParams['stsIdCodigo'] = params.stsIdCodigo;
  //     }


  //     if (params.page && params.limit) {
  //       const page = params.page;
  //       const limit = params.limit;
  //       const skip = (page - 1) * limit;

  //       return await this.saqueRepository.find({
  //         where: searchParams,
  //         skip,
  //         take: limit,
  //         relations: ['numerario', 'status'],
  //       });
  //     }

  //     return await this.saqueRepository.find({
  //       where: searchParams,
  //     });
  //   } catch (error) {
  //     console.log(error);
  //     throw new HttpException(
  //       'Não foi possível buscar os saques',
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //     );
  //   }
  // }

  async findOne(codigo: number): Promise<SaqueDto> {
    try {
      return await this.saqueRepository.findOne({
        where: { sqeIdCodigo: codigo },
        relations: ['numerario', 'status'],
      });
    } catch (error) {
      throw new HttpException(
        'Não foi possível busca o cargo',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async create(saque: CreateSaqueDto): Promise<SaqueDto> {
    try {
      saque.stsIdCodigo = 1;
      const newSaque = this.saqueRepository.create(saque);
      await this.saqueRepository.save(newSaque);
      return newSaque;
    } catch (error) {
        console.log(error);
      throw new HttpException(
        'Não foi possível criar o saque',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }


  async getSaqueData(chapa: string): Promise<SaqueResultDto[]> {
    const result = await this.saqueRepository
      .createQueryBuilder('a')
      .select([
        'a.SQE_ID_CODIGO',
        'c.RRE_ID_CODIGO',
        'b.RNU_ID_CODIGO',
        'b.RNU_DTINICIO',
        'c.CHAPA',
        'v.NOME',
        'b.REQ_ID_CODIGO',
        'a.SQE_VLSAQUE',
        'a.SQE_DTSAQUE',
        'a.SQE_EFETIVO',
        'a.STS_ID_CODIGO',
        's.STS_DESCRICAO',
        'a.SQE_VLPREST',
        'a.SQE_DTPEDIDO',
      ])
      .innerJoin('s009_reqnumerario', 'b', 'a.SQE_ID_CODIGO = b.SQE_ID_CODIGO')
      .innerJoin('s009_itensreqrec', 'c', 'a.ITE_ID_CODIGO = c.ITE_ID_CODIGO')
      .innerJoin('v009_funcsalario', 'v', 'c.CHAPA = v.CHAPA')
      .innerJoin('s009_status', 's', 'a.STS_ID_CODIGO = s.STS_ID_CODIGO')
      .where('c.CHAPA = :chapa', { chapa }) 
      .groupBy('c.RRE_ID_CODIGO')
      .addGroupBy('b.RNU_ID_CODIGO')
      .addGroupBy('c.CHAPA')
      .addGroupBy('v.NOME')
      .addGroupBy('b.REQ_ID_CODIGO')
      .addGroupBy('a.STS_ID_CODIGO')
      .addGroupBy('s.STS_DESCRICAO')     
      .getRawMany();
  
    return result as SaqueResultDto[];
  }
  

}










