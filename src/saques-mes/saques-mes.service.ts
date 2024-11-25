import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import {
  ExtratoDto,
  returnDevolucaoDto,
  returnTransferenciaDto,
  SaqueMesDto,
} from './saque-mesDto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SaqueMesEntity } from '../database/db_oracle/entities/saqueMes.entity';
import { formatDateToYYMM } from 'src/util/formatoYYMM';
import { DataUtils } from 'src/util/DataUtils';
import { calcularTotalPorYYMM } from 'src/util/variaveis/calcula_total_mes';

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

  async findExtrato(chapa: string): Promise<ExtratoDto[]> {
    try {
      const consulta = await this.saqueMes.query(`
        SELECT DISTINCT
          B.ITE_ID_CODIGO,
          B.CHAPA AS CHAPA,
          B.IRR_DATA_CONC AS DT_CONCEDIDO,    
          (C.SALARIO * 0.5) AS SQE_MES,  
          B.IRR_VALOR_CONC AS VL_CONCEDIDO,
          B.IRR_VALOR_PREST AS VL_PRESTADO,
        CASE
            WHEN (B.IRR_VALOR_PREST - B.IRR_VALOR_CONC) < 0 THEN 0
            ELSE (B.IRR_VALOR_PREST - B.IRR_VALOR_CONC)
        END AS VL_COMPREMENTO,
          CASE
            WHEN (B.IRR_VALOR_PREST - B.IRR_VALOR_CONC) > 0 THEN 0
            ELSE (B.IRR_VALOR_CONC - B.IRR_VALOR_PREST)
        END AS VL_DEVOLUCAO       
        FROM 
            FINANCEIRO.S009_SAQUE A
        INNER JOIN 
            FINANCEIRO.S009_ITENSREQREC B 
            ON A.ITE_ID_CODIGO = B.ITE_ID_CODIGO
        INNER JOIN 
            FINANCEIRO.V009_FUNCSALARIO C 
            ON B.CHAPA = C.CHAPA
        WHERE 
            B.CHAPA = ${chapa}        
        ORDER BY B.ITE_ID_CODIGO DESC
        `);

      const dados: ExtratoDto[] = [
        {
          ITE_ID_CODIGO: 1,
          DT_CONCEDIDO: '15/01/2023 10:43:16',
          SQE_MES: 0,
          VL_CONCEDIDO: 200,
          VL_PRESTADO: 0,
          VL_COMPREMENTO: 50,
          VL_DEVOLUCAO: 20,
          SQE_RESTANTE: 0,
          SQE_EFET_MES: 0,
        },
        {
          ITE_ID_CODIGO: 2,
          DT_CONCEDIDO: '25/01/2023 15:20:00',
          SQE_MES: 0,
          VL_CONCEDIDO: 300,
          VL_PRESTADO: 0,
          VL_COMPREMENTO: 30,
          VL_DEVOLUCAO: 50,
          SQE_RESTANTE: 0,
          SQE_EFET_MES: 0,
        },
        {
          ITE_ID_CODIGO: 3,
          DT_CONCEDIDO: '10/12/2023 09:00:00',
          SQE_MES: 0,
          VL_CONCEDIDO: 400,
          VL_PRESTADO: 0,
          VL_COMPREMENTO: 40,
          VL_DEVOLUCAO: 100,
          SQE_RESTANTE: 0,
          SQE_EFET_MES: 0,
        },
      ];

      const result = Promise.all(
        consulta.map(async (item: any) => {
          let dataNow = null;
          let formatoYYMM = null;
          let saquemes = 0;

          if (item.DT_CONCEDIDO) {
            dataNow = DataUtils.converterStringParaData(item.DT_CONCEDIDO);
            formatoYYMM = formatDateToYYMM(dataNow);
            saquemes = calcularTotalPorYYMM(consulta, formatoYYMM) || 0;
          }

          return {
            ITE_ID_CODIGO: item.ITE_ID_CODIGO,
            DT_CONCEDIDO: item.DT_CONCEDIDO,
            SQE_MES: item.SQE_MES,
            VL_CONCEDIDO: item.VL_CONCEDIDO,
            VL_PRESTADO: item.VL_PRESTADO,
            VL_COMPREMENTO: item.VL_COMPREMENTO,
            VL_DEVOLUCAO: item.VL_DEVOLUCAO,
            SQE_EFET_MES: saquemes,
            SQE_RESTANTE: Number((item.SQE_MES - saquemes).toFixed(2)) || 0
          };
        }),
      );

      return result;
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
