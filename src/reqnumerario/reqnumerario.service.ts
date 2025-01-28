import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { FindOptionsWhere, Repository } from 'typeorm';
import { FindAllParams, ReqnumerarioDto, updatChegadaDto } from './reqnumerarioDto';
import { ReqNumerarioEntity } from '../database/db_oracle/entities/reqnumerario.entity';

@Injectable()
export class ReqnumerarioService {
  constructor(   
    @InjectRepository(ReqNumerarioEntity, 'oracleConnection')
    private readonly renumerarioRepository: Repository<ReqNumerarioEntity>
  ) {}

  async findAll(params: FindAllParams): Promise<ReqnumerarioDto[]> {
    try {
      const searchParams: FindOptionsWhere<ReqNumerarioEntity> = {};

      if (params.RNU_ID_CODIGO) {
        searchParams.RNU_ID_CODIGO = params.RNU_ID_CODIGO;
      }
      if (params.REQ_ID_CODIGO) {
        searchParams.REQ_ID_CODIGO = params.REQ_ID_CODIGO;
      }

      let reqnumerarios: ReqNumerarioEntity[] = [];

      if (params.page && params.limit) {
        const page = params.page;
        const limit = params.limit;
        const skip = (page - 1) * limit;

        reqnumerarios = await this.renumerarioRepository.find({
          where: searchParams,
          skip,
          take: limit,
        });
      } else {
        reqnumerarios = await this.renumerarioRepository.find({
          where: searchParams,
        });
      }
      return reqnumerarios.map((reqv) => new ReqnumerarioDto(reqv));
    } catch (error) {
      throw new HttpException(
        'Erro ao buscar as requisições',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  
  async findOne(ITE_ID_CODIGO: number) {
    try {
      const item = await this.renumerarioRepository.query(
        `SELECT * FROM FINANCEIRO.S009_REQNUMERARIO  WHERE ITE_ID_CODIGO = :ITE_ID_CODIGO`,
        [ITE_ID_CODIGO],
      );    
  
      if (!item || item.length === 0) {
        throw new HttpException(
          `Reqnumerario com código: ${ITE_ID_CODIGO} não encontrado`,
          HttpStatus.NOT_FOUND,
        );
      }  
      return item[0];
    } catch (error) {
      console.log(error);
      throw new HttpException(
        `Erro ao buscar o reqnumerario(${ITE_ID_CODIGO}). ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // retonar o ultimo registro
  async findLast(): Promise<number> {
    try {
        const lastINumerario = await this.renumerarioRepository.query(
        `SELECT MAX(RNU_ID_CODIGO) as lastId FROM S009_REQNUMERARIO`,
      );
      const lastIdNum = lastINumerario[0]?.LASTID || 0;      
      return lastIdNum + 1;
    } catch (error) {
      throw new HttpException(
        'Erro ao buscar o último numerario',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async create(reqnumerario: ReqnumerarioDto): Promise<ReqnumerarioDto> {
    try {
      reqnumerario.RNU_ID_CODIGO = await this.findLast();
      const newReqnumerario = await this.renumerarioRepository.save(
        reqnumerario,
      );
      return new ReqnumerarioDto(newReqnumerario);
    } catch (error) {
      throw new HttpException(
        'Erro ao criar o numerario',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  
  async updateChegada(reqnumerario: updatChegadaDto): Promise<ReqnumerarioDto> {
    try {
      const reqnumerarioEntity = await this.renumerarioRepository.findOne({
        where: { RNU_ID_CODIGO: reqnumerario.RNU_ID_CODIGO },
      });

      if (!reqnumerarioEntity) {
        throw new HttpException(
          'Requisição não encontrada',
          HttpStatus.NOT_FOUND,
        );
      }

      reqnumerarioEntity.RNU_INTREAL = reqnumerario.RNU_INTREAL;
      reqnumerarioEntity.RNU_PARREAL = reqnumerario.RNU_PARREAL;

      await this.renumerarioRepository.save(reqnumerarioEntity);

      return new ReqnumerarioDto(reqnumerarioEntity);
    } catch (error) {
      throw new HttpException(
        'Erro ao atualizar o numerario',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
 
}
