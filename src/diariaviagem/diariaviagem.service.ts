import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DiariaViagemEntity } from 'src/database/db_oracle/entities/diariaViagem.entity';
import { Repository } from 'typeorm';
import { DiariaviagemDto, FindAllParams } from './diariaviagemDto';

import { calcularDiaria } from 'src/util/calculoDiaria';
import { Destino } from 'src/util/diariaDto';

@Injectable()
export class DiariaviagemService {
  constructor(
    @InjectRepository(DiariaViagemEntity, 'oracleConnection')
    private diariaviagemRepository: Repository<DiariaViagemEntity>,
  ) {}

  async findAll(params: FindAllParams): Promise<DiariaviagemDto[]> {
    try {
      const query = this.diariaviagemRepository.createQueryBuilder('a');
      if (params.CHAPA) {
        query.andWhere('CHAPA = :chapa', {
          chapa: params.CHAPA,
        });
      }
      if (params.REQ_ID_CODIGO) {
        query.andWhere('REQ_ID_CODIGO = :REQ', {
          REQ: params.REQ_ID_CODIGO,
        });
      }

      if (params.startDate && params.endDate) {
        query.andWhere('REQ_DTSAIDA BETWEEN :startDate AND :endDate', {
          startDate: params.startDate,
          endDate: params.endDate,
        });
      }
      // Paginação, caso fornecido nos parâmetros
      if (params.page && params.limit) {
        const offset = (params.page - 1) * params.limit;
        query.skip(offset).take(params.limit);
      }
      // Ordenação
      if (params.orderBy) {
        query.orderBy(params.orderBy, params.orderDirection === 'DESC' ? 'DESC' : 'ASC');
      } else {
        query.orderBy('REQ_ID_CODIGO', 'ASC');
      }

      const consulta = await query.getRawMany();

      const result = consulta.map((item) => {
        const parc = item.a_REQ_PARCIAL > 0 ? 1 : 0;
        const calc = calcularDiaria(
          35.36,
          7,
          Destino.OUTRAS_LOCALIDADES,
          0,
          item.a_REQ_INTEGRAL,
          parc,
          item.a_REQ_HRET,
        );
        return {
          REQ_DTSAIDA: item.a_REQ_DTSAIDA,
          REQ_ID_CODIGO: item.a_REQ_ID_CODIGO,
          CHAPA: item.a_CHAPA,
          NOME: item.a_NOME,
          CODSECAO: item.a_CODSECAO,
          DESCRICAO: item.a_DESCRICAO,
          REQ_HSAIDA: item.a_REQ_HSAIDA,
          REQ_DTRET: item.a_REQ_DTRET,
          REQ_HRET: item.a_REQ_HRET,
          REQ_KM: item.a_REQ_KM,
          REQ_INTEGRAL: Number(item.a_REQ_INTEGRAL) || 0,
          REQ_PARCIAL: Number(item.a_REQ_PARCIAL) || 0,
          REQ_ESPECIAL: Number(item.a_REQ_ESPECIAL) || 0,
          TRA_DESCRICAO: item.a_TRA_DESCRICAO,
          REQ_MOTIVO: item.a_REQ_MOTIVO,
          REQ_GOVERNADOR: item.a_REQ_GOVERNADOR,
          MDI_ID_CODIGO: item.a_MDI_ID_CODIGO,
          ITE_ID_CODIGO: item.a_ITE_ID_CODIGO,
          RRE_ID_CODIGO: item.a_RRE_ID_CODIGO,
          DIR_ID_CODIGO: item.a_DIR_ID_CODIGO,
          PRA_ID_CODIGO: item.a_PRA_ID_CODIGO,
          TDE_ID_CODIGO: item.a_TDE_ID_CODIGO,
          TDE_DESCRICAO: item.a_TDE_DESCRICAO,
          MDI_TIPO: item.a_MDI_TIPO,
          MDI_VALOR: Number(item.a_MDI_VALOR) || 0,
          MDI_CHEFE: item.a_MDI_CHEFE,
          MDI_GERENTE: item.a_MDI_GERENTE,
          MDI_DIRETOR: item.a_MDI_DIRETOR,
          MDI_DIREXECUTIVO: item.a_MDI_DIREXECUTIVO,
          MDI_DTAUTORIZA: item.a_MDI_DTAUTORIZA,
          MDI_JUSTIFICATIVA: item.a_MDI_JUSTIFICATIVA,
          diariaIntegral: calc.diariaIntegral,
          diariaParcial40: calc.diariaParcial40,
          diariaParcial20: calc.diariaParcial20,
          diariaBase: calc.diariaBase,
        };
      });

      return result;
    } catch (error) {
      console.error('Erro na consulta findPrestacao:', error);
      throw new HttpException('Erro ao buscar prestações', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOne(requisicao: number, chapa: string): Promise<DiariaviagemDto> {
    try {
      const result = await this.diariaviagemRepository
        .createQueryBuilder('r')
        .where('r.REQ_ID_CODIGO = :codigo', { codigo: requisicao })
        .where('r.CHAPA = :codigo', { codigo: chapa })
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

      throw new HttpException(
        'Erro interno no servidor ao buscar a Diária de Viagem',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
