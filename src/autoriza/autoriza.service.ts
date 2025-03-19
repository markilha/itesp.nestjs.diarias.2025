import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { autorizaEntity } from '../database/db_oracle/entities/autoriza.entity';
import { FindAllParams } from './autorizaDto';

@Injectable()
export class autorizaService {
  constructor(
    @InjectRepository(autorizaEntity, 'oracleConnection')
    private autorizaRepository: Repository<autorizaEntity>,
  ) {}

  async findAll(
    params: FindAllParams,
  ): Promise<{ data: autorizaEntity[]; total: number; totalFiltrado: number }> {
    try {
      const page = params.page || 1;
      const limit = params.limit || 1000;
      const offset = (page - 1) * limit;
      const sqeIdCodigo = params.SQE_ID_CODIGO;
      const idIdCodigo = params.ITE_ID_CODIGO;
      const rreIdCodigo = params.RRE_ID_CODIGO;
      const dirIdCodigo = params.DIR_ID_CODIGO;
      const stsIdCodigo = params.STS_ID_CODIGO;

      // Query para contar o total de registros (sem filtros)
      const countQueryBuilder = this.autorizaRepository
        .createQueryBuilder('autoriza')
        .where('1 = 1');

      // Query para contar o total de registros filtrados
      const filteredCountQueryBuilder = this.autorizaRepository
        .createQueryBuilder('autoriza')
        .where('1 = 1');

      // Query para os dados paginados (com filtros)
      const dataQueryBuilder = this.autorizaRepository
        .createQueryBuilder('autoriza')
        .where('1 = 1')
        .andWhere(
          `
          ROWNUM BETWEEN :minRow AND :maxRow
        `,
          {
            minRow: offset + 1,
            maxRow: offset + limit,
          },
        )
        .orderBy('autoriza.AUT_ID_CODIGO');

      // Aplicando filtros nas queries de dados e total filtrado
      if (sqeIdCodigo) {
        filteredCountQueryBuilder.andWhere('autoriza.SQE_ID_CODIGO = :sqeIdCodigo', {
          sqeIdCodigo,
        });
        dataQueryBuilder.andWhere('autoriza.SQE_ID_CODIGO = :sqeIdCodigo', { sqeIdCodigo });
      }
      if (idIdCodigo) {
        filteredCountQueryBuilder.andWhere('autoriza.ITE_ID_CODIGO = :idIdCodigo', { idIdCodigo });
        dataQueryBuilder.andWhere('autoriza.ITE_ID_CODIGO = :idIdCodigo', { idIdCodigo });
      }
      if (rreIdCodigo) {
        filteredCountQueryBuilder.andWhere('autoriza.RRE_ID_CODIGO = :rreIdCodigo', {
          rreIdCodigo,
        });
        dataQueryBuilder.andWhere('autoriza.RRE_ID_CODIGO = :rreIdCodigo', { rreIdCodigo });
      }
      if (dirIdCodigo) {
        filteredCountQueryBuilder.andWhere('autoriza.DIR_ID_CODIGO = :dirIdCodigo', {
          dirIdCodigo,
        });
        dataQueryBuilder.andWhere('autoriza.DIR_ID_CODIGO = :dirIdCodigo', { dirIdCodigo });
      }

      if (stsIdCodigo) {
        const stsIds = stsIdCodigo.split(',').map((id) => parseInt(id.trim(), 10));
        filteredCountQueryBuilder.andWhere('autoriza.STS_ID_CODIGO IN (:...stsIds)', { stsIds });
        dataQueryBuilder.andWhere('autoriza.STS_ID_CODIGO IN (:...stsIds)', { stsIds });
      }

      // Executa as queries
      const totalCount = await countQueryBuilder.getCount();
      const filteredCount = await filteredCountQueryBuilder.getCount();
      const consulta = await dataQueryBuilder.getMany();

      return {
        data: consulta,
        total: totalCount,
        totalFiltrado: filteredCount,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
