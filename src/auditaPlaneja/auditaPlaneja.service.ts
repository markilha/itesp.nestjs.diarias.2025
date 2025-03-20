import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { auditaPlanejaEntity } from 'src/database/db_oracle/entities/auditaPlaneja.entity';
import { FindAllParams } from './auditaPlanejaDto';

@Injectable()
export class auditaPlanejaService {
  constructor(
    @InjectRepository(auditaPlanejaEntity, 'oracleConnection')
    private auditaPlanejaRepository: Repository<auditaPlanejaEntity>,
  ) {}

  async findAll(
    params: FindAllParams,
  ): Promise<{ data: auditaPlanejaEntity[]; total: number; totalFiltrado: number }> {
    try {
      const page = params.page || 1;
      const limit = params.limit || 1000;
      const offset = (page - 1) * limit;
      const idIdCodigo = params.ITE_ID_CODIGO;
      const rreIdCodigo = params.RRE_ID_CODIGO;
      const dirIdCodigo = params.DIR_ID_CODIGO;
      const audautoriza = params.AUD_AUTORIZA;

      // Query para contar o total de registros (sem filtros)
      const countQueryBuilder = this.auditaPlanejaRepository
        .createQueryBuilder('auditaPlaneja')
        .where('1 = 1');

      // Query para contar o total de registros filtrados
      const filteredCountQueryBuilder = this.auditaPlanejaRepository
        .createQueryBuilder('auditaPlaneja')
        .where('1 = 1');

      // Query para os dados paginados (com filtros)
      const dataQueryBuilder = this.auditaPlanejaRepository
        .createQueryBuilder('auditaPlaneja')
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
        .orderBy('auditaPlaneja.AUD_DATA');

      // Aplicando filtros nas queries de dados e total filtrado

      if (idIdCodigo) {
        filteredCountQueryBuilder.andWhere('auditaPlaneja.ITE_ID_CODIGO = :idIdCodigo', {
          idIdCodigo,
        });
        dataQueryBuilder.andWhere('auditaPlaneja.ITE_ID_CODIGO = :idIdCodigo', { idIdCodigo });
      }
      if (rreIdCodigo) {
        filteredCountQueryBuilder.andWhere('auditaPlaneja.RRE_ID_CODIGO = :rreIdCodigo', {
          rreIdCodigo,
        });
        dataQueryBuilder.andWhere('auditaPlaneja.RRE_ID_CODIGO = :rreIdCodigo', { rreIdCodigo });
      }
      if (dirIdCodigo) {
        filteredCountQueryBuilder.andWhere('auditaPlaneja.DIR_ID_CODIGO = :dirIdCodigo', {
          dirIdCodigo,
        });
        dataQueryBuilder.andWhere('auditaPlaneja.DIR_ID_CODIGO = :dirIdCodigo', { dirIdCodigo });
      }
      if (audautoriza) {
        filteredCountQueryBuilder.andWhere('auditaPlaneja.AUD_AUTORIZA = :audautoriza', {
          audautoriza,
        });
        dataQueryBuilder.andWhere('auditaPlaneja.AUD_AUTORIZA = :audautoriza', { audautoriza });
      }

      // Executa as queries
      const totalCount = await countQueryBuilder.getCount();
      const filteredCount = await filteredCountQueryBuilder.getCount();
      const consulta = await dataQueryBuilder.getMany();

      return {
        total: totalCount,
        totalFiltrado: filteredCount,
        data: consulta,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
