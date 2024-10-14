import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FindAllParams } from './saque-mesDto';
import { SaqueMesDto } from './saque-mesDto';
import { FindOptionsWhere, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SaqueMesEntity } from 'src/database/db_mysql/entities/saqueMes.entity';

@Injectable()
export class SaquesMesService {
  constructor(
    @InjectRepository(SaqueMesEntity, 'mysqlConnection')
    private saqueMes: Repository<SaqueMesEntity>,
  ) {}

  // Método privado para construir a query base
  private createBaseQueryBuilder() {
    return this.saqueMes
      .createQueryBuilder('a')
      .select([
        'd.CHAPA AS chapa',
        'd.NOME AS nome',
        'e.DESCRICAO AS descricao',
        'f.FUNCAO AS funcao',
        'a.MESSAQUE AS messaque',
        "STR_TO_DATE(a.MESSAQUE, '%m/%Y') AS messaque2",
        'a.TotSaque AS totSaque',
        'IFNULL(b.TotSaqueEstCanc, 0) AS totSaqueEstCanc',
        'c.mesdev AS mesDev',
        'IFNULL(c.vl_devolucao, 0) AS vlDevolucao',
        'IFNULL(f.SALARIO, 0) AS salario',
      ])
      .leftJoin(
        'v009_saqueestcanc_mes',
        'b',
        'a.CHAPA = b.CHAPA AND a.MESSAQUE = b.MESSAQUE AND a.TDE_ID_CODIGO = b.TDE_ID_CODIGO',
      )
      .leftJoin(
        'v009_devoltot_mes',
        'c',
        'a.CHAPA = c.chapa AND a.MESSAQUE = c.mesdev AND a.TDE_ID_CODIGO = c.tde_id_codigo',
      )
      .innerJoin('pfunc', 'd', 'a.CHAPA = d.CHAPA')
      .innerJoin('psecao', 'e', 'd.CODSECAO = e.CODIGO')
      .leftJoin('v009_funcsalario', 'f', 'd.CHAPA = f.CHAPA')
      .where('a.TDE_ID_CODIGO = :codigo', { codigo: 7 });
  }

  // Método privado para aplicar filtros comuns
  private applyFilters(query, params: FindAllParams) {
    if (params.CHAPA) {
      query.andWhere('a.CHAPA = :chapa', { chapa: params.CHAPA });
    }

    if (params.messaque) {
      query.andWhere('a.MESSAQUE = :messaque', { messaque: params.messaque });
    }

    if (params.page && params.limit) {
      const page = params.page;
      const limit = params.limit;
      const skip = (page - 1) * limit;
      query.skip(skip).take(limit);
    }

    return query;
  }

  // Método público para buscar todos os registros
  async findAll(params: FindAllParams): Promise<SaqueMesDto[]> {
    const query = this.createBaseQueryBuilder();
    this.applyFilters(query, params);

    const result = await query.getRawMany();
    return result;
  }

  // Método público para buscar um registro específico
  async findOne(chapa: string, messaque: string): Promise<SaqueMesDto | null> {
    const query = this.createBaseQueryBuilder()
      .andWhere('a.CHAPA = :chapa', { chapa })
      .andWhere('a.MESSAQUE = :messaque', { messaque })
      .limit(1);

    const result = await query.getRawOne();
    if (!result) {
      throw new HttpException('Registro não encontrado', HttpStatus.NOT_FOUND);
    }

    result.TotalSaqueMes = result.totSaque - result.totSaqueEstCanc - result.vlDevolucao;

    return result;
  }
}
