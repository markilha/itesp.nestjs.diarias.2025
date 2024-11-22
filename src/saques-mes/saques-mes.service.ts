import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { returnDevolucaoDto, returnTransferenciaDto, SaqueMesDto } from './saque-mesDto';
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

      const result = consulta.map((item: any) => {
        return {
          CHAPA: item.CHAPA,
          messaque: item.MESSAQUE,
          totSaque: item.TOTSAQUE,
          TotalSaqueMes: item.TOTSAQUE - item.TOTSAQUEESTCANC - item.VLDEVOLUCAO,
        };
      });

      return result;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findDevolucaoMes(chapa: string, messaque: string): Promise<returnDevolucaoDto[]> {
    const consulta = await this.saqueMes.query(`
      SELECT 
        A.tde_id_codigo,
        A.CHAPA,
        A.mesdev,
        Sum(A.EXT_VALOR) As VlDevolucao
      From Financeiro.V009_Devolucaomes A
      where A.MesDEv = A.Messaque 
      AND
        a.TDE_ID_CODIGO = 7    
        ${chapa ? `AND a.CHAPA = '${chapa}'` : ''}
        ${messaque ? `AND a.MESSAQUE = '${messaque}'` : ''}
      Group By A.TDE_ID_CODIGO, A.CHAPA, A.MESDEV
      `);

    return consulta.map((item: any) => {
      return {
        CHAPA: item.CHAPA,
        TDE_ID_CODIGO: item.TDE_ID_CODIGO,
        MESDEV: item.MESDEV,
        VLDEVOLUCAO: item.VLDEVOLUCAO,
      };
    });
  }

  async findTransferenciaMes(chapa: string, messaque: string): Promise<returnTransferenciaDto[]> {
    try {
      const consulta = await this.saqueMes.query(`
        SELECT 
        TO_CHAR(TO_DATE(A.SQE_DTPEDIDO, 'DD/MM/YY HH24:MI:SS'), 'YY/MM') AS MesPed,
          B.CHAPA,        
          SUM(A.SQE_VLSAQUE) AS VLTOTAL
        FROM 
          S009_Saque A
        JOIN 
          S009_ITENSREQREC B 
        ON 
          A.ITE_ID_CODIGO = B.ITE_ID_CODIGO
        WHERE 
          A.SQE_TIPOSAQUE = 'N' 
        AND A.SQE_EFETIVO IN ('T')
         ${chapa ? `AND B.CHAPA = '${chapa}'` : ''}
         ${messaque ? `AND TO_CHAR(TO_DATE(A.SQE_DTPEDIDO, 'DD/MM/YY HH24:MI:SS'), 'YY/MM') = '${messaque}'` : ''}
        GROUP BY 
          B.CHAPA,
          TO_CHAR(TO_DATE(A.SQE_DTPEDIDO, 'DD/MM/YY HH24:MI:SS'), 'YY/MM')
        ORDER BY  MesPed DESC
        `);

      return consulta;
    } catch (error) {   
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Método privado para construir a query base
  // private createBaseQueryBuilder() {
  //   return this.saqueMes
  //     .createQueryBuilder('a')
  //     .select([
  //       'd.CHAPA AS chapa',
  //       'd.NOME AS nome',
  //       'e.DESCRICAO AS descricao',
  //       'f.FUNCAO AS funcao',
  //       'a.MESSAQUE AS messaque',
  //       "STR_TO_DATE(a.MESSAQUE, '%m/%Y') AS messaque2",
  //       'a.TotSaque AS totSaque',
  //       'IFNULL(b.TotSaqueEstCanc, 0) AS totSaqueEstCanc',
  //       'c.mesdev AS mesDev',
  //       'IFNULL(c.vl_devolucao, 0) AS vlDevolucao',
  //       'IFNULL(f.SALARIO, 0) AS salario',
  //     ])
  //     .leftJoin(
  //       'v009_saqueestcanc_mes',
  //       'b',
  //       'a.CHAPA = b.CHAPA AND a.MESSAQUE = b.MESSAQUE AND a.TDE_ID_CODIGO = b.TDE_ID_CODIGO',
  //     )
  //     .leftJoin(
  //       'v009_devoltot_mes',
  //       'c',
  //       'a.CHAPA = c.chapa AND a.MESSAQUE = c.mesdev AND a.TDE_ID_CODIGO = c.tde_id_codigo',
  //     )
  //     .innerJoin('pfunc', 'd', 'a.CHAPA = d.CHAPA')
  //     .innerJoin('psecao', 'e', 'd.CODSECAO = e.CODIGO')
  //     .leftJoin('v009_funcsalario', 'f', 'd.CHAPA = f.CHAPA')
  //     .where('a.TDE_ID_CODIGO = :codigo', { codigo: 7 });
  // }
}
