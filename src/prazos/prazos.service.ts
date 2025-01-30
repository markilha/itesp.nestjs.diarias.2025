import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { PrazosEntity } from '../database/db_oracle/entities/prazos.entity';
import { Between, FindOptionsWhere, Repository } from 'typeorm';
import { FindAllParams, findPrazosMesDto, PrazosDto, returnData } from './prazosDto';
import { PpessoaService } from '../ppessoa/ppessoa.service';
import { endOfMonth, startOfMonth } from 'date-fns';
import { calcularPeriodo } from '../util/calcula_periodo';
import { formatError } from 'src/components/error/error.service';
import { getPaginatedQuery } from '../util/paginacao/paginaQuery';

@Injectable()
export class PrazosService {
  constructor(
    @InjectRepository(PrazosEntity, 'oracleConnection')
    private PrazosRepository: Repository<PrazosEntity>,
    private ppessoaService: PpessoaService,
  ) {}

 
  async findAll(params: FindAllParams): Promise<returnData> {
    try {
      const pageNumber = params.page ?? 1;
      const pageSize = params.limit ?? 500;
      const startRow = (pageNumber - 1) * pageSize + 1;
      const endRow = pageNumber * pageSize;

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
      const queryBuilder = this.PrazosRepository.createQueryBuilder('r')
        .select([
          'r.PRA_ID_CODIGO as PRA_ID_CODIGO',
          'r.PRA_PREVISAO as PRA_PREVISAO',
          'r.PRA_INICIO_RECURSO as PRA_INICIO_RECURSO',
          'r.PRA_FIM_RECURSO as PRA_FIM_RECURSO',
          'r.PRA_ATIVO as PRA_ATIVO',
          'r.PRA_INICIO_APLICA as PRA_INICIO_APLICA',
          'r.PRA_FIM_APLICA as PRA_FIM_APLICA',
          'r.REG_ID_CODIGO as REG_ID_CODIGO',
          'r.ORR_ID_CODIGO as ORR_ID_CODIGO',
        ])
        .where(searchParams);
      const paginatedQuery = getPaginatedQuery(queryBuilder, startRow, endRow);

      const parameters = Object.values(queryBuilder.getParameters());

      const result = await this.PrazosRepository.query(paginatedQuery, parameters);

      return {
        data: result,
        total: result?.length > 0 ? result[0].TOTAL_COUNT : 0,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error('Erro ao buscar registro:', error);
      const formattedError = formatError(error);
      throw new HttpException(formattedError, formattedError.statusCode);
    }
  }
  async findOne(PRA_ID_CODIGO: number, request?: Request): Promise<PrazosEntity> {
      try {
        const result = await this.PrazosRepository
          .createQueryBuilder('r')
          .where('r.PRA_ID_CODIGO = :codigo', { codigo: PRA_ID_CODIGO })
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
        const formattedError = formatError(error, request);      
        throw new HttpException(
          formattedError,
          formattedError.statusCode
        );
      }
    }

  async findmes(params: findPrazosMesDto): Promise<PrazosDto[]> {
    try {
      const dataatual = params.data || new Date();
      const inicioMes = startOfMonth(dataatual);
      const fimMes = endOfMonth(dataatual);
      const ppessoa = await this.ppessoaService.find({ chapa: params.chapa });
      const reg = ppessoa.REG_ID_CODIGO;

      const consulta = await this.PrazosRepository.find({
        where: {
          REG_ID_CODIGO: reg,
          PRA_INICIO_APLICA: Between(inicioMes, fimMes),
        },
      });

      const prazos = consulta.map((prazo) => {
        const datAplicacao = new Date(prazo.PRA_INICIO_APLICA);
        const datRecurso = new Date(prazo.PRA_INICIO_RECURSO);
        const perAplicacao = calcularPeriodo(datAplicacao);
        const perRecurso = calcularPeriodo(datRecurso);

        return new PrazosDto({
          ...prazo,
          PER_APLICACAO: perAplicacao,
          PER_RECURSO: perRecurso,
        });
      });

      return prazos;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }
}
