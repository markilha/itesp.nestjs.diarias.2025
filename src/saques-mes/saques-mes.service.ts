/* istanbul ignore file */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import {
  ExtratoDto,
  FindParamsExtrato,
  FindPgParams,
  infoPagamentoDto,
  returnDevolucaoDto,
  ReturnExtrato,
  returnTransferenciaDto,
  SaqueMesDto,
} from './saque-mesDto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SaqueMesEntity } from '../database/db_oracle/entities/saqueMes.entity';
import { formatDateToYYMM } from '../util/formatoYYMM';
import { DataUtils } from '../util/DataUtils';
import { calcularTotalPorYYMM } from '../util/variaveis/calcula_total_mes';
import { selects } from '../util/selects/selects';

@Injectable()
export class SaquesMesService {
  constructor(
    @InjectRepository(SaqueMesEntity, 'oracleConnection')
    private saqueMes: Repository<SaqueMesEntity>,
  ) {}

  async findOne(chapa: string, messaque: string): Promise<SaqueMesDto[]> {
    try {
      const whereClause = `WHERE        
        ${chapa ? `a.CHAPA = '${chapa}'` : ''}
        ${messaque ? `AND a.MESSAQUE = '${messaque}'` : ''}
      `;
      const sqlString = `${selects.extratoMes} ${whereClause}`;
      const consulta = await this.saqueMes.query(sqlString);
      const result = consulta.map((item: any) => {
        return {
          nome: item.NOME,
          CHAPA: item.CHAPA,
          descricao: item.DESCRICAO,
          funcao: item.FUNCAO,
          totsqestcanc: item.TOTSAQUEESTCANC,
          mesdev: item.MESDEV,
          salario: item.SALARIO,
          metadesalario: item.METADESALARIO,
          codbancopagto: item.CODBANCOPAGTO,
          codagenciapagto: item.CODAGENCIAPAGTO,
          contapagamento: item.CONTAPAGAMENTO,
          messaque: item.MESSAQUE,
          vldevolucao: item.VLDEVOLUCAO,
          totSaque: item.TOTSAQUE,
          totalrealmes: item.TOTALREALSAQUE,
        };
      });

      return result;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async infoPagamento(params: FindPgParams): Promise<infoPagamentoDto> {
    try {
      const dataNow = params.dataAtual ? params.dataAtual : new Date();
      const formatoYYMM = formatDateToYYMM(dataNow);
      const whereChapa = `WHERE        
      ${params.chapa ? `CHAPA = '${params.chapa}'` : ''}       
    `;
      const funcSalario = await this.saqueMes.query(`${selects.funcSalario} ${whereChapa}`);
      const salario = funcSalario[0]?.SALARIO || 0;
      const metadesalario = salario / 2 || 0;

      const pffunc = await this.saqueMes.query(`${selects.pfunc} ${whereChapa}`);

      //extrato mes
      const whereClause = `WHERE        
        ${params.chapa ? `a.CHAPA = '${params.chapa}'` : ''}  
         ${params.dataAtual ? `AND a.MESSAQUE = '${formatoYYMM}'` : ''} 
      `;
      const sqlString = `${selects.extratoMes} ${whereClause}`;
      const consulta = await this.saqueMes.query(sqlString);
      const totalMes = consulta[0]?.TOTALREALSAQUE || 0;
      const totalDevolucao = consulta[0]?.VLDEVOLUCAO || 0;
      const saldoDisponivel = metadesalario - totalMes || 0;

      const transferenciaMes = await this.findTransferenciaMes(params.chapa, formatoYYMM);
      const totalagruadando = transferenciaMes[0]?.VLTOTAL || 0;

      return new infoPagamentoDto({
        codagenciapagto: pffunc[0]?.CODAGENCIAPAGTO || null,
        codbancopagto: pffunc[0]?.CODBANCOPAGTO || null,
        contapagamento: pffunc[0]?.CONTAPAGAMENTO || null,
        salario: salario,
        metadesalario: metadesalario,
        totalrealmes: totalMes,
        vldevolucao: totalDevolucao,
        totalaguardando: totalagruadando,
        saldodisponivel: DataUtils.arredondar(saldoDisponivel),
      });
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

  async findExtrato(params: FindParamsExtrato): Promise<ReturnExtrato> {
    //filtro entre datas
    try {
      const page = Number(params.page) || 1;
      const limit = Number(params.limit) || 10;
      const starrIndex = (page - 1) * limit;
      const endIndex = starrIndex + limit;
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
            B.CHAPA = ${params.chapa}        
        ORDER BY B.ITE_ID_CODIGO DESC
        `);

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
            SQE_RESTANTE: Number((item.SQE_MES - saquemes).toFixed(2)) || 0,
          };
        }),
      );

      let filtroData: ExtratoDto[] = await result;

      if (params.dataInicio && params.dataFim) {
        const dataInicio = DataUtils.normalizarData(
          DataUtils.converterStringParaData(params.dataInicio),
        );
        const dataFinal = DataUtils.normalizarData(
          DataUtils.converterStringParaData(params.dataFim),
        );
        filtroData = (await result).filter((item) => {
          if (!item.DT_CONCEDIDO) return false;
          const dataConcedido = DataUtils.normalizarData(
            DataUtils.converterStringParaData(item.DT_CONCEDIDO),
          );
          return dataConcedido >= dataInicio && dataConcedido <= dataFinal;
        });
      }

      let paginateData = filtroData;

      if (params.page && params.limit) {
        paginateData = filtroData.slice(starrIndex, endIndex);
      }

      return {
        data: paginateData,
        total: filtroData.length,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
