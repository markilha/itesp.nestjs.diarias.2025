import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PrazosEntity } from '../database/db_oracle/entities/prazos.entity';
import { Between, FindOptionsWhere, Repository } from 'typeorm';
import { FindAllParams, findPrazosMesDto, PrazosDto } from './prazosDto';
import { PpessoaService } from '../ppessoa/ppessoa.service';
import { endOfMonth, startOfMonth, format } from 'date-fns';
import { calcularPeriodo } from 'src/util/calcula_periodo';

@Injectable()
export class PrazosService {
  constructor(
    @InjectRepository(PrazosEntity, 'oracleConnection')
    private PrazosRepository: Repository<PrazosEntity>,
    private ppessoaService: PpessoaService,
  ) {}

  async findAll(params: FindAllParams): Promise<PrazosDto[]> {
    try {
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
      if (params.page && params.limit) {
        const page = params.page;
        const limit = params.limit;
        const skip = (page - 1) * limit;

        return await this.PrazosRepository.find({
          where: searchParams,
          skip,
          take: limit,
        });
      }

      return await this.PrazosRepository.find({
        where: searchParams,
      });
    } catch (error) {
      throw new HttpException('Não foi possível buscar cargos', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOne(PRA_ID_CODIGO: number) {
    try {
      return await this.PrazosRepository.findOneOrFail({
        where: { PRA_ID_CODIGO },
      });
    } catch (error) {
      throw new HttpException('Prazo não encontrado', HttpStatus.NOT_FOUND);
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
