import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { autorizaEntity } from '../database/db_oracle/entities/autoriza.entity';
import {
  AutorizarPendenteParams,
  AutorizarRecursoDto,
  CarreagaSetorDto,
  filtroAutoriacao,
  FindAllParams,
} from './autorizaDto';

import { AuthUserDto } from 'src/auth/use.auth.Dto';
import { enumCodSecao, permissaoCargo } from 'src/util/enums/cargo';
import { sqls } from 'src/util/crudOracle/consultas';
import { updates } from 'src/util/crudOracle/updates';
import { inserts } from 'src/util/crudOracle/inserts';
import { procedures } from 'src/util/crudOracle/procedures';
import { PpessoaService } from 'src/ppessoa/ppessoa.service';
import { filtrarSetorLike } from 'src/util/permissao/porSecao';
import { parseToNumber } from 'src/util/converter_float';
import { autorizaSelect } from 'src/util/selects/autoriza';
import { enumStsIdCodigo } from 'src/util/enums/sts_id_codigo';

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
      const regionalId = params.regionalId;

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

      if (regionalId) {
        filteredCountQueryBuilder
          .addFrom('FINANCEIRO.S009_ITENSREQREC', 'A')
          .addFrom('FINANCEIRO.V009_FUNCSALARIO', 'B')
          .andWhere('A.ITE_ID_CODIGO = autoriza.ITE_ID_CODIGO')
          .andWhere('B.CHAPA = A.CHAPA')
          .andWhere('B.REG_ID_CODIGO = :regionalId', { regionalId });

        dataQueryBuilder
          .addFrom('FINANCEIRO.S009_ITENSREQREC', 'A')
          .addFrom('FINANCEIRO.V009_FUNCSALARIO', 'B')
          .andWhere('A.ITE_ID_CODIGO = autoriza.ITE_ID_CODIGO')
          .andWhere('B.CHAPA = A.CHAPA')
          .andWhere('B.REG_ID_CODIGO = :regionalId', { regionalId });
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

  //TODO: FILTRAR RECURSOS
  async findRecursos(
    user: AuthUserDto,
    params: filtroAutoriacao,
  ): Promise<{ data: any[]; total: number; totalFiltrado: number }> {
    try {
      //Dados usuarios logado
      let filtro = true;
      const chapa = params.chapa || user.chapa;
      const { PERMISSAO, CODSECAO } = await this.ppessoaService.find({ chapa: chapa });
      const page = params.page || 1;
      const limit = params.limit || 1000;
      const offset = (page - 1) * limit;

      // Query para obter o total SEM filtros
      const totalQuery = `
        SELECT COUNT(*) AS total FROM FINANCEIRO.S009_ITENSREQREC
      `;
      const totalResult = await this.autorizaRepository.manager.query(totalQuery);
      const total = totalResult[0]?.TOTAL || 0;

      // Query principal
      let query = autorizaSelect;
      const queryParams: any = {};
      const conditions: string[] = [];

      // Filtro por chapa
      if (params.chapa) {
        conditions.push(`A.CHAPA = :chapa`);
        queryParams['chapa'] = params.chapa;
        filtro = false;
      }

      // filtro por código do saque
      if (params.saque) {
        conditions.push(`B.SQE_ID_CODIGO  = :sqeidcodigo`);
        queryParams['sqeidcodigo'] = params.saque;
        filtro = false;
      }
      // friltro por requisição
      if (params.requisicao) {
        conditions.push(`D.REQ_ID_CODIGO = :requisicao`);
        queryParams['requisicao'] = params.requisicao;
        filtro = false;
      }

      // filtro por regional
      if (params.regional) {
        conditions.push('UPPER( J.REG_DESCRICAO) LIKE UPPER(:regional)');
        queryParams['regional'] = `%${params.regional}%`;
        filtro = false;
      }

      // filtro por setor
      if (params.setor) {
        conditions.push('UPPER( G.DESCRICAO) LIKE UPPER(:setor)');
        queryParams['setor'] = `%${params.setor}%`;
        filtro = false;
      }

      // if (sqeefetivo) {
      //   const stsIds = sqeefetivo.split(',').map((id) => `'${id.trim()}'`); // Adiciona aspas simples em cada valor
      //   conditions.push(`B.SQE_EFETIVO IN (${stsIds.join(', ')})`); // Junta os valores corretamente
      //   filtro = false;
      // }

      if (params.status) {
        let statusResult = '';
        switch (params.status.trim()) {
          case 'Aprovada':
            statusResult = 'S';
            break;
          case 'Negada':
            statusResult = 'N';
            break;
          case 'Finalizada':
            statusResult = 'F';
            break;
          case 'Pendente':
            statusResult = 'A';
            conditions.push(`A.STS_ID_CODIGO = ${enumStsIdCodigo.AGUARD_APROV_CHEFE_IMEDIATO}`);
            break;
          default:
            statusResult = 'P';
            break;
        }
        conditions.push(`A.IRR_RECURSO = :status`);
        queryParams['status'] = statusResult;
        filtro = false;
      }

      // filtra conforme a permissão do usuario
      if (filtro) {
        const pesquisa = filtrarSetorLike(PERMISSAO, CODSECAO, 'C.CODSECAO');
        if (pesquisa) {
          conditions.push(pesquisa);
          if (PERMISSAO === permissaoCargo.GTCAMPO) {
            queryParams['chapalogado'] = chapa;
          }
        } else {
          conditions.push(`A.CHAPA = :chapa`);
          queryParams['chapa'] = chapa;
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

      if (!result || result.length === 0) {
        return {
          total: 0,
          totalFiltrado: 0,
          data: [],
        };
      }

      const data = result.map((item: any) => ({
        ...item,
        TIPO: 'Viagem',
        VL_DEVOLUCAO: parseFloat(
          (parseToNumber(item.SQE_VLSAQUE) - parseToNumber(item.SQE_VLPREST)).toFixed(2),
        ),
      }));

      const totalFiltrado = result.length;

      return {
        total,
        totalFiltrado,
        data,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  //TODO: Seleciona aprova pendente
  async selAprovaPendente(user: AuthUserDto, params: AutorizarPendenteParams): Promise<any> {
    try {
      const queryParams: any = {};
      const conditions: string[] = [];
      // const { CODSECAO } = await this.ppessoaService.find({ chapa: user.chapa });

      let sql = `
      SELECT 
        a.pra_id_codigo,
        a.dir_id_codigo,
        a.codsecao,
        a.descricao
        FROM financeiro.v009_itensreqrec a
        WHERE a.sts_id_codigo = 5
        AND a.irr_recurso = 'A'
    `;

      if (params.prazo) {
        conditions.push(`a.pra_id_codigo = :prazo`);
        queryParams['prazo'] = params.prazo;
      }

      // JUNTAR CONDIÇÕES
      if (conditions.length > 0) {
        sql += ' AND ' + conditions.join(' AND ');
      }

      //   if (tipo === 1) {
      //   sql += `
      //     AND a.codsecao <> :gerencia
      //     AND a.codsecao LIKE :setor
      //   `;
      //   binds.gerencia = desc;
      //   binds.setor = desc.substring(0, 12) + '%';
      // } else if (tipo === 2) {
      //   sql += `
      //     AND a.codsecao <> :diretoria
      //     AND a.dir_id_codigo = :dir
      //   `;
      //   binds.diretoria = dmExtCodDiretoria;
      //   binds.dir = desc;
      // }

      //agrupa por diretorias
      sql += `
      GROUP BY 
        a.pra_id_codigo,
        a.dir_id_codigo,
        a.codsecao,
        a.descricao
    `;

      const result = await this.autorizaRepository.manager.query(sql, queryParams);

      return result;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  //TODO: CARREGA SETORES
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
    // let updateUsuReq = `
    //   UPDATE TRANSPORTE.S001_USUREQ SET
    //   CHAPA = :par2,
    //   USU_MOV = :par3
    //   WHERE REQ_ID_CODIGO = :par1
    //   AND CHAPA = :par2`

    // let updateStatusRequisicao = `
    //   Update Transporte.S001_REQUISICAO Set
    //   REQ_STATUS=:par2
    //   where REQ_id_codigo=:par1
    //   `

    try {
      await this.autorizaRepository.manager.transaction(async (transactionalEntityManager) => {
        // Atualizar o status do item para autorizado
        await transactionalEntityManager.query(updates.updateAutorizaItem, [
          parseToNumber(params.VALOR),
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

            // Se não houver usureq, insere um novo
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
}
