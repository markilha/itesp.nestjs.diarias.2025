import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { autorizaEntity } from '../database/db_oracle/entities/autoriza.entity';
import { FindAllParams } from './autorizaDto';

import { EnumAutorizacao } from 'src/util/enums/autorizacao';
import { AuthUserDto } from 'src/auth/use.auth.Dto';
import { permissaoCargo } from 'src/util/enums/cargo';

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
        total: totalCount,
        totalFiltrado: filteredCount,
        data: consulta,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findRecursos(
    user: AuthUserDto,
    params: FindAllParams,
  ): Promise<{ data: any[]; total: number; totalFiltrado: number }> {
    try {
      //userLogado
      const codigosecao = user.codsecao;
      const chapalogado = user.chapa;
      //const permissao = user.permissao;

      //const chapalogado = '000825';
      const permissao = Number('12');

      const page = params.page || 1;
      const limit = params.limit || 1000;
      const offset = (page - 1) * limit;

      const chapa = params.CHAPA;
      const sqeidcodigo = params.SQE_ID_CODIGO;
      const dirIdCodigo = params.DIR_ID_CODIGO;
      const status = params.STATUS;
      const stsIdCodigo = params.STS_ID_CODIGO;
      const sqeefetivo = params.SQE_EFETIVO;

      // Query para obter o total SEM filtros
      const totalQuery = `
        SELECT COUNT(*) AS total FROM FINANCEIRO.S009_ITENSREQREC
      `;
      const totalResult = await this.autorizaRepository.manager.query(totalQuery);
      const total = totalResult[0]?.TOTAL || 0;

      // Query principal com filtros
      let query = `
        SELECT * FROM (
          SELECT 
            B.SQE_ID_CODIGO AS "SQE_ID_CODIGO",
            B.SQE_EFETIVO AS "SQE_EFETIVO",
            B.SQE_DTPEDIDO,
            D.REQ_ID_CODIGO AS "REQ_ID_CODIGO",
            C.NOME AS "NOME",
            C.CODSECAO AS "CODSECAO",
            E.CPF AS "CPF",
            B.SQE_VLSAQUE AS "SQE_VLSAQUE",
            B.SQE_VLPREST AS "SQE_VLPREST",          
            A.IRR_VLDEVOLUCAO AS "IRR_VLDEVOLUCAO",
            A.IRR_COMPLEMENTO AS "IRR_COMPLEMENTO",          
            A.IRR_DATA_SOL AS "IRR_DATA_SOL",
            A.STS_ID_CODIGO AS "STS_ID_CODIGO",   
            F.STS_DESCRICAO AS "STS_DESCRICAO", 
            H.DESCRICAO AS DIRETORIA,
            G.DESCRICAO AS SETOR,           
            CASE 
              WHEN A.IRR_RECURSO = '${EnumAutorizacao.APROVADA}' THEN 'Aprovada'
              WHEN A.IRR_RECURSO = '${EnumAutorizacao.NEGADA}' THEN 'Negada'
              WHEN A.IRR_RECURSO = '${EnumAutorizacao.FINALIZADA}' THEN 'Finalizada'
              ELSE 'Pendente'
            END AS "STATUS",
            ROW_NUMBER() OVER (ORDER BY B.SQE_ID_CODIGO DESC) AS ROW_NUM
          FROM FINANCEIRO.S009_ITENSREQREC A  
          JOIN FINANCEIRO.S009_SAQUE B ON A.ITE_ID_CODIGO = B.ITE_ID_CODIGO
          JOIN RM.PFUNC C ON A.CHAPA = C.CHAPA
          JOIN FINANCEIRO.S009_REQNUMERARIO D ON B.SQE_ID_CODIGO = D.SQE_ID_CODIGO
          JOIN RM.PPESSOA E ON A.CHAPA = E.CODUSUARIO
          JOIN FINANCEIRO.S009_STATUS F ON A.STS_ID_CODIGO = F.STS_ID_CODIGO    
          JOIN RM.PSECAO G ON C.CODSECAO = G.CODIGO   
          JOIN FINANCEIRO.V009_DiretoriaGeral H ON A.DIR_ID_CODIGO = H.DIR_ID_CODIGO
      `;
      const queryParams: any = {};

      //FILTRAR POR SETOR

      //DIRETORIA EXECUTIVA  OU DE - Financeiro
      const conditions: string[] = [];

      if (chapa) {
        conditions.push(`A.CHAPA = :chapa`);
        queryParams['chapa'] = chapa;
      }
      if (sqeidcodigo) {
        conditions.push(`B.SQE_ID_CODIGO  = :sqeidcodigo`);
        queryParams['sqeidcodigo'] = sqeidcodigo;
      }

      if (dirIdCodigo) {
        conditions.push(`A.DIR_ID_CODIGO = :dirIdCodigo`);
        queryParams['dirIdCodigo'] = dirIdCodigo;
      }
      if (stsIdCodigo) {
        conditions.push(`A.STS_ID_CODIGO = :stsIdCodigo`);
        queryParams['stsIdCodigo'] = stsIdCodigo;
      }

      if (sqeefetivo) {
        const stsIds = sqeefetivo.split(',').map((id) => `'${id.trim()}'`); // Adiciona aspas simples em cada valor
        conditions.push(`B.SQE_EFETIVO IN (${stsIds.join(', ')})`); // Junta os valores corretamente
      }

      if (status) {
        let statusResult = '';
        switch (status.trim()) {
          case 'Aprovada':
            statusResult = 'S';
            break;
          case 'Negada':
            statusResult = 'N';
            break;
          case 'Finalizada':
            statusResult = 'F';
            break;
          default:
            statusResult = 'P';
            break;
        }
        conditions.push(`A.IRR_RECURSO = :status`);
        queryParams['status'] = statusResult;
      }

      ///////////////////////////////////////////SETOR/////////////////////////////////////////////////////////
      //DIRETORIA EXECUTIVA  OU DE - Financeiro
      if (
        permissao === permissaoCargo.DIRETOR_EXECUTIVO ||
        permissao === permissaoCargo.CHEFE_GABINETE
      ) {
        conditions.push(`C.CODSECAO LIKE '1.1.%' OR C.CODSECAO LIKE '1.6.%'`); //prettier-ignore
      }

      //RESPONSÁVEL TÉCNICO DE CAMPO
      if (chapalogado) {
        conditions.push(
          `C.CODSECAO IN (SELECT e.codsecao FROM rm.psubstchefe e WHERE e.chapasubst = :chapa AND e.datafim >= SYSDATE)`,
        );
        queryParams['chapa'] = chapalogado;
      }

      //"leonardo": "1.3.01.06.04.00.00",
      //Diretor Adjunto / Assistente
      if (
        [
          '1.2.00.00.00.00.00',
          '1.3.00.00.00.00.00',
          '1.4.00.00.00.00.00',
          '1.5.00.00.00.00.00',
          '1.2.01.05.01.00.00',
        ].includes(codigosecao)
      ) {
        conditions.push(`C.CODSECAO LIKE '${codigosecao.substring(0, 5)}%'`);

        // Qr_PSecao.SQL.Add('AND NOT A.CODIGO =:DIR AND A.CODIGO LIKE :SETOR');
        // Qr_PSecao.ParamByName('DIR').AsString:=cb_setordir.text;
        // Qr_PSecao.ParamByName('SETOR').AsString:=copy(cb_setordir.text,1,5)+'%';
      }

      //GERENTE
      if (
        [
          '1.2.01.06.01.00.00',
          '1.3.01.06.04.00.00',
          '1.4.01.06.07.00.00',
          '1.4.01.06.08.00.00',
          '1.5.01.06.09.00.00',
          '1.4.01.06.06.00.00',
          '1.5.01.06.10.00.00',
          '1.2.01.06.03.00.00',
          '1.1.01.06.03.00.00',
          '1.1.01.06.00.00.00',
          '1.3.01.06.05.00.00',
          '1.2.01.06.02.00.00',
        ].includes(codigosecao)
      ) {
        conditions.push(`C.CODSECAO=:SETOR`); //prettier-ignore
        queryParams['SETOR'] = codigosecao;
      }

      //RESPONSAVEL TÉCNICO DA SEDE
      if (['inserir codigos sede'].includes(codigosecao)) {
        conditions.push(`C.CODSECAO=:SETOR`); //prettier-ignore
        queryParams['SETOR'] = codigosecao;
      }

      //JUNTAR CONDIÇÕES
      if (conditions.length > 0) {
        query += ` WHERE ` + conditions.join(' AND ');
      }

      //FECHAR QUERY
      query += `
        ) WHERE ROW_NUM BETWEEN :minRow AND :maxRow
        ORDER BY SQE_ID_CODIGO DESC
      `;

      queryParams['minRow'] = offset + 1;
      queryParams['maxRow'] = offset + limit;

      // Executa a query principal
      const result = await this.autorizaRepository.manager.query(query, queryParams);
      const totalFiltrado = result.length;

      return {
        total, // Total sem filtros
        totalFiltrado, // Total com os filtros aplicados
        data: result,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
