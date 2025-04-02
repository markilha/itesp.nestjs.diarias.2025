import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { autorizaEntity } from '../database/db_oracle/entities/autoriza.entity';
import { AutorizarRecursoDto, CarreagaSetorDto, FindAllParams } from './autorizaDto';

import { EnumAutorizacao } from 'src/util/enums/autorizacao';
import { AuthUserDto } from 'src/auth/use.auth.Dto';
import { enumCodSecao, permissaoCargo } from 'src/util/enums/cargo';
import { sqls } from 'src/util/crudOracle/consultas';
import { updates } from 'src/util/crudOracle/updates';
import { inserts } from 'src/util/crudOracle/inserts';
import { procedures } from 'src/util/crudOracle/procedures';
import { PpessoaService } from 'src/ppessoa/ppessoa.service';
import { filtrarSetorLike } from 'src/util/permissao/porSecao';

@Injectable()
export class autorizaService {
  constructor(
    @InjectRepository(autorizaEntity, 'oracleConnection')
    private autorizaRepository: Repository<autorizaEntity>,
    private ppessoaService: PpessoaService,
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
      const solicitante = params.SOLICITANTE;

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

      if (solicitante) {
        filteredCountQueryBuilder.andWhere(
          'UPPER(autoriza.AUT_SOLICITA) LIKE UPPER(:solicitante)',
          {
            solicitante: `%${solicitante}%`,
          },
        );
        dataQueryBuilder.andWhere('UPPER(autoriza.AUT_SOLICITA) LIKE UPPER(:solicitante)', {
          solicitante: `%${solicitante}%`,
        });
      }
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
      //Dados usuarios logado
      const { PERMISSAO, CODSECAO } = await this.ppessoaService.find({ chapa: user.chapa });

      const page = params.page || 1;
      const limit = params.limit || 1000;
      const offset = (page - 1) * limit;
      const chapa = params.CHAPA;
      const sqeidcodigo = params.SQE_ID_CODIGO;
      const dirIdCodigo = params.DIR_ID_CODIGO;
      const status = params.STATUS;
      const stsIdCodigo = params.STS_ID_CODIGO;
      const sqeefetivo = params.SQE_EFETIVO;
      const codigosecao = params.CODSECAO;
      const requisicao = params.REQ_ID_CODIGO;

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
      if (requisicao) {
        conditions.push(`D.REQ_ID_CODIGO = :requisicao`);
        queryParams['requisicao'] = requisicao;
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

      if (codigosecao) {
        conditions.push(`C.CODSECAO LIKE  :CODSE
        `);
        queryParams['CODSE'] = codigosecao + '%';
      } else {
        const pesquisa = filtrarSetorLike(PERMISSAO, CODSECAO, 'C.CODSECAO');
        if (pesquisa) {
          conditions.push(pesquisa);
          queryParams['chapalogado'] = user.chapa;
        }
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

  async carregarSetores(user: AuthUserDto): Promise<{ data: CarreagaSetorDto[] }> {
    try {
      const { PERMISSAO: permissao, CODSECAO: codigosecao } = await this.ppessoaService.find({
        chapa: user.chapa,
      });

      const chapalogado = user.chapa;

      //MOCK DIRETORIA
      // const codigosecao = enumCodSecao.DIRETOR_EXECUTIVO;
      // const permissao = permissaoCargo.DIRETOR_EXECUTIVO as number;

      // Query principal com filtros
      let query = `SELECT a.* FROM RM.PSecao a WHERE LENGTH(a.CODIGO) = 18`;
      const queryParams: any = {};

      //DIRETORIA EXECUTIVA  OU DE - Financeiro
      const conditions: string[] = [];

      ///////////////////////////////////////////SETOR/////////////////////////////////////////////////////////
      //DIRETORIA EXECUTIVA  OU DE - Financeiro
      if (
        permissao === permissaoCargo.DIRETOR_EXECUTIVO ||
        permissao === permissaoCargo.CHEFE_GABINETE ||
        (permissao === permissaoCargo.FINANCEIRO_TESOURARIA &&
          [enumCodSecao.GABINETE_DIRETORIA_EXECUTIVA, enumCodSecao.DIRETOR_EXECUTIVO].includes(
            codigosecao as enumCodSecao,
          ))
      ) {
        conditions.push(`a.CODIGO LIKE '1.1.%' OR a.CODIGO LIKE '1.6.%'`);
      } else if (
        (permissao === permissaoCargo.FINANCEIRO_TESOURARIA &&
          ['1.2.01.05.01.00.00', enumCodSecao.DIRETORIA_ADJUNTA_FINANCAS_RECURSOS_HUMANOS].includes(
            codigosecao,
          )) ||
        permissao === permissaoCargo.DIRETOR_ADJUNTO ||
        permissao === permissaoCargo.ASSISTENTE ||
        ['1.2.01.05.01.00.00', enumCodSecao.DIRETORIA_ADJUNTA_FINANCAS_RECURSOS_HUMANOS].includes(
          codigosecao,
        )
      ) {
        conditions.push(
          `a.CODIGO != '${enumCodSecao.DIRETOR_EXECUTIVO}' and a.CODIGO LIKE '${codigosecao.substring(0, 5)}%'`,
        );
      } else if (
        permissao === permissaoCargo.GERENTE ||
        permissao === permissaoCargo.RESP_TEC_TRANSPORTE ||
        permissao === permissaoCargo.RESP_TECNICO ||
        permissao === permissaoCargo.ASSESSORIA_OUVIDORIA
      ) {
        conditions.push(`a.CODIGO LIKE :SETOR`);
        queryParams['SETOR'] = codigosecao;
      } else if (permissao === permissaoCargo.GTCAMPO) {
        conditions.push(
          `a.CODIGO IN (SELECT e.codsecao FROM rm.psubstchefe e WHERE e.chapasubst = :chapa AND e.datafim >= SYSDATE)`,
        );
        queryParams['chapa'] = chapalogado;
      }

      //JUNTAR CONDIÇÕES
      if (conditions.length > 0) {
        query += ` AND ` + conditions.join(' AND ');
      }
      // Adiciona ORDER BY corretamente
      query += ` ORDER BY a.DESCRICAO`;

      // Executa a query principal
      const result = await this.autorizaRepository.manager.query(query, queryParams);

      const carregarCombo = result.map((row) => ({
        CODIGO: row.CODIGO ?? row.codigo,
        SETOR: row.DESCRICAO ?? row.descricao,
      }));

      if (
        permissao === permissaoCargo.GERENTE ||
        permissao === permissaoCargo.RESP_TECNICO ||
        permissao === permissaoCargo.RESP_TEC_TRANSPORTE ||
        permissao === permissaoCargo.ASSESSORIA_OUVIDORIA
      ) {
        return carregarCombo[0];
      } else if (permissao === permissaoCargo.GTCAMPO && carregarCombo.length > 1) {
        return carregarCombo;
      } else if (permissao === permissaoCargo.GTCAMPO) {
        return carregarCombo[0];
      }

      return carregarCombo;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async autorizarNega(params: AutorizarRecursoDto, user: AuthUserDto) {
    try {
      await this.autorizaRepository.manager.transaction(async (transactionalEntityManager) => {
        // Atualizar o status do item para autorizado
        await transactionalEntityManager.query(updates.updateAutorizaItem, [
          params.NEGADA ? 0 : params.VALOR,
          params.NEGADA ? 'N' : 'S',
          params.ITE_ID_CODIGO,
        ]);

        await transactionalEntityManager.query(procedures.INS_S009_AUDITAPLANEJA, [
          params.ITE_ID_CODIGO,
          params.RRE_ID_CODIGO,
          params.DIR_ID_CODIGO,
          user.login,
          params.NEGADA ? 'N' : 'S',
        ]);
        // Buscar diárias não analisadas
        const Auxiliar2 = await transactionalEntityManager.query(sqls.selecionaDiariasAnalizadas, [
          params.ITE_ID_CODIGO,
        ]);

        if (Auxiliar2?.length > 0) {
          for (const aux2 of Auxiliar2) {
            await transactionalEntityManager.query(updates.updateUsuReq, [
              aux2.CHAPA,
              params.NEGADA ? 'N' : 'O',
              aux2.REQ_ID_CODIGO,
            ]);
            // Verificar usureq transporte
            const Qr_UsuReq = await transactionalEntityManager.query(sqls.selecionaUsureq, [
              aux2.REQ_ID_CODIGO,
            ]);
            if (Qr_UsuReq?.length === 0) {
              const DmExt = await transactionalEntityManager.query(sqls.SelecionaAutoriza, [
                aux2.REQ_ID_CODIGO,
              ]);
              const autoriza = Number(DmExt[0].AUT_NIVEL) + 1;

              await transactionalEntityManager.query(inserts.insertAutorizaTransporte, [
                aux2.REQ_ID_CODIGO,
                user.login,
                params.NEGADA ? 'N' : 'S',
                params.NEGADA ? 'NEGADO - DIRETOR' : 'AUTORIZADA - FINANCEIRO',
                autoriza,
              ]);
            }
            // upadate status da requisição de tranporte
            await transactionalEntityManager.query(updates.updateStatusRequisicao, [
              aux2.REQ_ID_CODIGO,
              params.NEGADA ? 'PLANEJAMENTO NAO AUTORIZADO' : 'ANALISANDO',
            ]);
            // NÃO HOUVE APROVAÇÃO NO ITEM
            if (
              aux2.mdi_chefe === '' ||
              aux2.mdi_diretor === '' ||
              aux2.mdi_chefe === 'N' ||
              aux2.mdi_diretor === 'N'
            ) {
              const motivo = await transactionalEntityManager.query(sqls.SelMotivoDiaria, [
                aux2.MDI_ID_CODIGO,
              ]);

              const quemAutorizouNegou = params.NEGADA ? 'N' : 'S';

              if (
                permissaoCargo.FINANCEIRO_TESOURARIA ||
                permissaoCargo.DIRETOR_ADJUNTO ||
                permissaoCargo.DIRETOR_EXECUTIVO
              ) {
                const query = `
                UPDATE FINANCEIRO.S009_MOTIVODIARIA
                SET  MDI_DIRETOR = :PAR1
                WHERE MDI_ID_CODIGO = :PAR2;
                `;
                await transactionalEntityManager.query(query, [
                  quemAutorizouNegou,
                  motivo.MDI_ID_CODIGO,
                ]);
              } else {
                const query = `
                UPDATE FINANCEIRO.S009_MOTIVODIARIA
                SET  MDI_CHEFE = :PAR1
                WHERE MDI_ID_CODIGO = :PAR2;
                `;
                await transactionalEntityManager.query(query, [
                  quemAutorizouNegou,
                  motivo.MDI_ID_CODIGO,
                ]);
              }
            }
          }
        }
      });

      if (params.NEGADA) {
        return { message: 'Recurso negado com sucesso' };
      }

      return { message: 'Recurso autorizado com sucesso' };
    } catch (error) {
      throw new HttpException(
        `Erro ao autorizar recurso para o item ${params.ITE_ID_CODIGO}: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // async filtrarSetorLike(permissao: number, codigosecao: string) {
  //   try {
  //     //DIRETORIA EXECUTIVA  OU DE - Financeiro
  //     if (
  //       permissao === permissaoCargo.DIRETOR_EXECUTIVO ||
  //       permissao === permissaoCargo.CHEFE_GABINETE ||
  //       (permissao === permissaoCargo.FINANCEIRO_TESOURARIA &&
  //         [enumCodSecao.GABINETE_DIRETORIA_EXECUTIVA, enumCodSecao.DIRETOR_EXECUTIVO].includes(
  //           codigosecao as enumCodSecao,
  //         ))
  //     ) {
  //       return `C.CODSECAO LIKE '1.1.%' OR  C.CODSECAO LIKE '1.6.%'`;
  //     } else if (
  //       (permissao === permissaoCargo.FINANCEIRO_TESOURARIA &&
  //         ['1.2.01.05.01.00.00', enumCodSecao.DIRETORIA_ADJUNTA_FINANCAS_RECURSOS_HUMANOS].includes(
  //           codigosecao,
  //         )) ||
  //       permissao === permissaoCargo.DIRETOR_ADJUNTO ||
  //       permissao === permissaoCargo.ASSISTENTE ||
  //       ['1.2.01.05.01.00.00', enumCodSecao.DIRETORIA_ADJUNTA_FINANCAS_RECURSOS_HUMANOS].includes(
  //         codigosecao,
  //       )
  //     ) {
  //       return `C.CODSECAO != '${enumCodSecao.DIRETOR_EXECUTIVO}' and  C.CODSECAO LIKE '${codigosecao.substring(0, 5)}%'`;
  //     } else if (
  //       permissao === permissaoCargo.GERENTE ||
  //       permissao === permissaoCargo.RESP_TEC_TRANSPORTE ||
  //       permissao === permissaoCargo.RESP_TECNICO ||
  //       permissao === permissaoCargo.ASSESSORIA_OUVIDORIA
  //     ) {
  //       return `C.CODSECAO LIKE :SETOR`;
  //     } else if (permissao === permissaoCargo.GTCAMPO) {
  //       return `C.CODSECAO IN (SELECT e.codsecao FROM rm.psubstchefe e WHERE e.chapasubst = :chapalogado AND e.datafim >= SYSDATE)`;
  //     }
  //     return null;
  //   } catch (error) {
  //     throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
  //   }
  // }
}
