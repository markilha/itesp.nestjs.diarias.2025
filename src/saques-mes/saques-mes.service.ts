import {  Injectable } from '@nestjs/common';

import { SaqueMesDto } from './saque-mesDto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SaqueMesEntity } from '../database/db_oracle/entities/saqueMes.entity';

@Injectable()
export class SaquesMesService {
  constructor(
    @InjectRepository(SaqueMesEntity, 'oracleConnection')
    private saqueMes: Repository<SaqueMesEntity>,
  ) {}

  async findOne(chapa: string, messaque: string): Promise<SaqueMesDto[]> {
    try {    

      const consulta = await this.saqueMes.query(`
          SELECT 
              d.CHAPA AS chapa,
              d.NOME AS nome,
              e.DESCRICAO AS descricao,
              f.FUNCAO AS funcao,
              a.MESSAQUE AS messaque,             
              a.TotSaque AS totSaque,
              NVL(b.TotSaqueEstCanc, 0) AS totSaqueEstCanc,
              c.mesdev AS mesDev,
              NVL(c.vldevolucao, 0) AS vlDevolucao,
              NVL(f.SALARIO, 0) AS salario
          FROM 
              FINANCEIRO.v009_saqueefet_mes a
          LEFT JOIN 
              FINANCEIRO.v009_saqueestcanc_mes b
              ON a.CHAPA = b.CHAPA 
              AND a.MESSAQUE = b.MESSAQUE 
              AND a.TDE_ID_CODIGO = b.TDE_ID_CODIGO
          LEFT JOIN 
             FINANCEIRO.v009_devoltot_mes c
              ON a.CHAPA = c.chapa 
              AND a.MESSAQUE = c.mesdev 
              AND a.TDE_ID_CODIGO = c.tde_id_codigo
          INNER JOIN 
             RM.pfunc d
              ON a.CHAPA = d.CHAPA
          INNER JOIN 
             RM.psecao e
              ON d.CODSECAO = e.CODIGO
          LEFT JOIN 
             FINANCEIRO.v009_funcsalario f
              ON d.CHAPA = f.CHAPA
          WHERE 
              a.TDE_ID_CODIGO = 7    
              ${chapa ? `AND a.CHAPA = '${chapa}'` : ''}
              ${messaque ? `AND a.MESSAQUE = '${messaque}'` : ''}
            
        `);

        const result = consulta.map((item:any) => {
          return {
            CHAPA: item.CHAPA,            
            messaque: item.MESSAQUE,
            totSaque: item.TOTSAQUE,
            TotalSaqueMes: item.TOTSAQUE - item.TOTSAQUEESTCANC - item.VLDEVOLUCAO,          
          };
        });
      
        return result;
       

      
    } catch (error) {
      console.error('Error during query execution:', error);
      throw error; // Propaga o erro para tratamento adicional
    }
  }

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
  // private applyFilters(query, params: FindAllParams) {
  //   if (params.CHAPA) {
  //     query.andWhere('a.CHAPA = :chapa', { chapa: params.CHAPA });
  //   }

  //   if (params.messaque) {
  //     query.andWhere('a.MESSAQUE = :messaque', { messaque: params.messaque });
  //   }

  //   if (params.page && params.limit) {
  //     const page = params.page;
  //     const limit = params.limit;
  //     const skip = (page - 1) * limit;
  //     query.skip(skip).take(limit);
  //   }

  //   return query;
  // }

  // async findAll(params: FindAllParams): Promise<SaqueMesEntity[]> {
  //   const searchParams: FindOptionsWhere<SaqueMesEntity> = {};

  //   if (params.CHAPA) {
  //     searchParams['CHAPA'] = params.CHAPA;
  //   }
  //   if (params.MESSAQUE) {
  //     searchParams['MESSAQUE'] = params.MESSAQUE;
  //   }

  //   if (params.page && params.limit) {
  //     const page = params.page;
  //     const limit = params.limit;
  //     const skip = (page - 1) * limit;

  //     return await this.saqueMes.find({
  //       where: searchParams,
  //       skip,
  //       take: limit,
  //     });
  //   }

  //   return await this.saqueMes.find({
  //     where: searchParams,
  //   });
  // }

  // Método público para buscar todos os registros
  // async findAll(params: FindAllParams): Promise<SaqueMesDto[]> {
  //   const query = this.createBaseQueryBuilder();
  //   this.applyFilters(query, params);

  //   const result = await query.getRawMany();
  //   return result;
  // }

  // Método público para buscar um registro específico
  // async findOne(chapa: string, messaque: string): Promise<SaqueMesDto | null> {

    

  //   // const query = this.createBaseQueryBuilder()
  //   //   .andWhere('a.CHAPA = :chapa', { chapa })
  //   //   .andWhere('a.MESSAQUE = :messaque', { messaque })
  //   //   .limit(1);

  //   // const result = await query.getRawOne();
  //   // if (!result) {
  //   //   throw new HttpException('Registro não encontrado', HttpStatus.NOT_FOUND);
  //   // }

  //   // result.TotalSaqueMes = result.totSaque - result.totSaqueEstCanc - result.vlDevolucao;

  //   // return result;
  // }
}
