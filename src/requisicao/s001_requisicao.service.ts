import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { FindOptionsWhere, In, MoreThanOrEqual, Repository } from 'typeorm';
import {
  FindAllAutorizadasParams,
  FindAllParams,
  findMesParams,
  findPendentesParams,
  ListSaqueParams,
  requiPendente,
  RequisDto,
  requiTotal,
  ReturnRequisicaoDto,
} from './requisicao.dto';
import { UfespService } from '../ufesp/ufesp.service';
import { verificarDestino } from '../util/verificaDestino';
import { Destino } from 'src/util/diariaDto';
import { SaquesMesService } from '../saques-mes/saques-mes.service';
import { formatDateToYYMM } from '../util/formatoYYMM';
import {
  calcularDiariaIntegral,
  calcularDiariaParcial,
  calcularDiariaValores,
} from '../util/calculo_dia_retorno';
import { ItinirarioService } from '../itinirario/itinirario.service';
import { calcularSalario50 } from '../util/variaveis/calculo_50';
import { logger } from '../util/savelogs/SaveLogs';
import { RequisicaoEntity } from '../database/db_oracle/entities/requisicao.entity';
import { retornoItinerarioDto } from '../itinirario/itinerarioDto';
import { DataUtils } from '../util/DataUtils';
import { startOfMonth, endOfMonth, format, addMonths, parse, isDate } from 'date-fns';
import { naotrabService } from '../naotrab/naotrab.service';
import { calcularPeriodo } from '../util/calcula_periodo';
import { AuthUserDto } from '../auth/use.auth.Dto';
import { PpessoaService } from '../ppessoa/ppessoa.service';
import { filtrarSetorLike } from 'src/util/permissao/porSecao';
import { gerarFiltroStatus } from 'src/util/gerarFiltro';

@Injectable()
export class S001RequisicaoService {
  constructor(
    @InjectRepository(RequisicaoEntity, 'oracleConnection')
    private requisicaoRepository: Repository<RequisicaoEntity>,
    private ufespService: UfespService,
    private SaquesMesService: SaquesMesService,
    private itinirarioService: ItinirarioService,
    private naotrabservice: naotrabService,
    private ppessoaService: PpessoaService,
  ) {}

  private async buscarItinerario(reqIdCodigo: number) {
    try {
      return await this.itinirarioService.findUltimo(reqIdCodigo);
    } catch (error) {
      console.log(`Erro ao buscar itinerário: ${error.message}`);
      return null;
    }
  }

  //TODO: FIND PRESTAÇÃO DE CONTA
  async find(params: FindAllParams, user: AuthUserDto): Promise<any> {
    try {
      let filtro = true;
      const conditions: string[] = [`r.REQ_DTSAIDA >= TO_DATE('2009-08-10', 'YYYY-MM-DD')`];

      //filtrar por chapa
      if (params.chapa) {
        conditions.push(`r.CHAPA = '${params.chapa}'`);
        filtro = false;
      }

      // Adiciona outras condições de busca
      if (params.reqIdCodigo) {
        conditions.push(`r.REQ_ID_CODIGO = ${params.reqIdCodigo}`);
        filtro = false;
      }

      // filtra por municipio
      if (params.codMunicipio) {
        conditions.push(`r.COD_MUNICIPIO = ${params.codMunicipio}`);
        filtro = false;
      }

      // filtar por status
      if (params.reqStatus) {
        conditions.push(`r.REQ_STATUS = '${params.reqStatus}'`);
        filtro = false;
      }

      // Define ordenação - garantindo que sempre tenha o prefixo da tabela
      let orderBy = params.orderBy || 'REQ_ID_CODIGO';
      // Adiciona o prefixo 'r.' apenas se ainda não tiver um prefixo
      if (!orderBy.includes('.')) {
        orderBy = `r.${orderBy}`;
      }
      const orderDirection = params.orderDirection === 'DESC' ? 'DESC' : 'ASC';

      // FILTRO POR SETOR
      const { PERMISSAO, CODSECAO } = await this.ppessoaService.find({ chapa: user.chapa });

      if (filtro) {
        const pesquisa = filtrarSetorLike(PERMISSAO, CODSECAO, 'fs.CODSECAO', user.chapa);
        if (pesquisa) {
          conditions.push(pesquisa);
        } else {
          conditions.push(`r.CHAPA = '${user.chapa}'`);
        }
      }

      const query = `
      SELECT * FROM (
        SELECT 
          t.*, 
          ROWNUM as rnum 
        FROM (
          SELECT
            r.REQ_ID_CODIGO AS "reqIdCodigo", 
            r.COD_MUNICIP AS "codMunicipio",
            r.REQ_DTREQ AS "reqDtReq",
            r.REQ_DTSAIDA AS "reqDtSaida",
            r.REQ_MOTORISTA AS "reqMotorista",
            r.REQ_HSAIDA AS "reqHSaida",
            r.REQ_HRET AS "reqHRet",
            r.REQ_MOTIVO AS "reqMotivo",
            r.REQ_KM AS "reqKm",
            r.REQ_STATUS AS "reqStatus",
            r.REQ_DIARIA AS "reqDiaria",
            r.REQ_INTEGRAL AS "reqIntegral",
            r.REQ_PARCIAL AS "reqParcial",
            r.REQ_ESPECIAL AS "reqEspecial",
            r.TRA_ID_CODIGO AS "traIdCodigo",
            r.NME_MUNIC AS "nmeMunic",
            r.REG_DESCRICAO AS "regDescricao",
            r.TRA_DESCRICAO AS "traDescricao",
            r.CHAPA AS "chapa", 
            r.REQ_PACOTE AS "reqPacote",
            r.REQ_GOVERNADOR AS "reqGovernador",
            fs.NOME AS "nome",
            fs.salario AS "salario",            
            d.MUN_ID_CODIGO AS "munIdCodigo",
            d.DES_LOCAL AS "desLocal",   
            m.MUN_CIDADE AS "munCidade",
            dd.DTD_VALOR_MAX AS "dtdValorMax",
            fs.CODSECAO AS "codsecao",
            pp.cpf  AS "cpf"
          FROM FINANCEIRO.V009_REQUISICAO r
          LEFT JOIN TRANSPORTE.S001_DESTINO d ON r.REQ_ID_CODIGO = d.REQ_ID_CODIGO    
          LEFT JOIN TRANSPORTE.S001_MUNIC_DETRAN m ON d.MUN_ID_CODIGO = m.MUN_ID_CODIGO
          LEFT JOIN FINANCEIRO.V009_funcsalario fs ON r.CHAPA = fs.CHAPA
          LEFT JOIN FINANCEIRO.V009_DESPESADIARIA dd ON fs.CARGO = dd.CARGO
          LEFT JOIN RM.PPESSOA pp ON fs.CHAPA = pp.CODUSUARIO 
          WHERE ${conditions.join(' AND ')}
          ORDER BY ${orderBy} ${orderDirection}
        ) t
        WHERE ROWNUM <= :maxRow
      ) WHERE rnum >= :minRow
      `;

      const parameters: any = {};

      const page = params.page || 1;
      const limit = params.limit || 1000;
      const offset = (page - 1) * limit;

      parameters.minRow = offset + 1;
      parameters.maxRow = offset + limit;

      // Executa a query
      const requisicoes = await this.requisicaoRepository.manager.query(query, parameters);
      console.log(requisicoes);

      const results = await Promise.all(
        requisicoes.map((requisicao: any) => this.processRequisicao(requisicao)),
      );

      //Consulta para contar o total de registros
      const countQuery = `
        SELECT COUNT(*) as total
        FROM FINANCEIRO.V009_REQUISICAO r
        LEFT JOIN TRANSPORTE.S001_DESTINO d ON r.REQ_ID_CODIGO = d.REQ_ID_CODIGO    
        LEFT JOIN TRANSPORTE.S001_MUNIC_DETRAN m ON d.MUN_ID_CODIGO = m.MUN_ID_CODIGO
        LEFT JOIN FINANCEIRO.V009_funcsalario fs ON r.CHAPA = fs.CHAPA
        LEFT JOIN FINANCEIRO.V009_DESPESADIARIA dd ON fs.CARGO = dd.CARGO
        WHERE ${conditions.join(' AND ')}
      `;

      const totalResult = await this.requisicaoRepository.manager.query(countQuery);

      return {
        total: totalResult[0]?.TOTAL || 0,
        data: results,
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // TODO: CALCULO DA DIARIA DA REQUISIÇÃO
  private async processRequisicao(requisicao: any): Promise<ReturnRequisicaoDto> {
    try {
      let UFESP = 0;
      let saqueMes = 0;
      let salarioAtual = 0;
      let UFESPcargoValor = 0;
      let salario50PorcentoNumber = 0;
      let saqueSalario = null;
      let saldoRestante = 0;
      let destino = '' as Destino;
      let qtdIntegral = 0;
      let qtdParcial = 0;

      // Busca o valor da UFESP na data da requisição
      try {
        UFESP = (await this.ufespService.findValueByDate(requisicao.reqDtSaida)).ufeValor || 0;
      } catch (error) {
        logger.error(`Erro ao buscar valor da ufesp (${requisicao.chapa}): `, error);
      }

      // Busca o valor do saque do mês
      try {
        const formatoYYMM = formatDateToYYMM(requisicao.reqDtSaida);
        saqueSalario = await this.SaquesMesService.findOne(requisicao.chapa, formatoYYMM);
        saqueMes = Number(saqueSalario[0]?.totalrealmes) || 0;
      } catch (error) {
        logger.error(`Erro ao buscar saque do mês para chapa (${requisicao.chapa}): `, error);
      }

      // Busca o valor do salário atual e do salário 50%
      try {
        UFESPcargoValor = Number(requisicao?.dtdValorMax) || 0;
        salarioAtual = requisicao?.salario || 0;
        salario50PorcentoNumber = calcularSalario50(salarioAtual);
      } catch (error) {
        logger.error(`Erro ao buscar dados do funcionário (${requisicao.chapa}): `, error);
      }

      // Busca o destino da viagem
      try {
        destino = verificarDestino(requisicao.munIdCodigo) as Destino;
      } catch (error) {
        logger.error(`Erro ao buscar o destino da viagem(${requisicao.chapa}): `, error);
      }

      // Cálculo das diárias
      const diarias = calcularDiariaValores(
        UFESP,
        UFESPcargoValor,
        destino,
        requisicao.reqPacote || 0,
        requisicao.reqIntegral || 0,
        requisicao.reqParcial > 0 ? 1 : 0,
        requisicao.reqHRet,
      );

      // Calcula o saldo restante
      try {
        saldoRestante = salario50PorcentoNumber - (saqueMes + (diarias?.VL_DIARIA_TOTAL || 0));
        saldoRestante = parseFloat(saldoRestante.toFixed(2)) || 0;
      } catch (error) {
        logger.error(`Erro ao buscar dados do funcionário (${requisicao.chapa}): `, error);
      }

      let iti = new retornoItinerarioDto();

      if (requisicao.traIdCodigo === 1) {
        iti = await this.buscarItinerario(Number(requisicao.reqIdCodigo));
      } else {
        iti.ITI_DTSAIDA = requisicao.reqDtSaida;
        iti.ITI_HSAIDA = requisicao.reqHSaida;
        iti.ITI_DTCHEGADA = DataUtils.converterStringParaData(requisicao.reqDtReq);
        iti.ITI_HCHEGADA = requisicao.reqHRet;
      }

      const naotrab = await this.naotrabservice.totalDiariaNaoTrabalhada(requisicao.reqIdCodigo);
      const nt = naotrab?.total || 0;

      try {
        if (!iti.ITI_DTSAIDA || !iti.ITI_HSAIDA || !iti.ITI_DTCHEGADA || !iti.ITI_HCHEGADA) {
          qtdIntegral = 0;
          qtdParcial = 0;
        } else {
          qtdIntegral = calcularDiariaIntegral(
            iti.ITI_DTSAIDA,
            iti.ITI_HSAIDA,
            iti.ITI_DTCHEGADA,
            iti.ITI_HCHEGADA,
            nt,
          );
          qtdParcial = calcularDiariaParcial(iti.ITI_HCHEGADA);
        }
      } catch (error) {
        console.log(`Requisição ${requisicao.reqIdCodigo}: `, error.message);
      }

      // Retorna o DTO
      return new ReturnRequisicaoDto({
        reqIdCodigo: requisicao.reqIdCodigo,
        chapa: requisicao.chapa,
        nome: requisicao.nome,
        cpf: requisicao.cpf,
        salario: requisicao.salario,
        salario50Porcento: salario50PorcentoNumber,
        saldoDisponivel: saldoRestante,
        saqueMes: saqueMes,
        oriMunicipio: requisicao.nmeMunic,
        reqDtReq: requisicao.reqDtReq,
        reqDtSaida: requisicao.reqDtSaida,
        reqHSaida: requisicao.reqHSaida,
        reqDtRetorno: requisicao.reqDtReq,
        reqMotivo: requisicao.reqMotivo,
        reqHRet: requisicao.reqHRet,
        reqKm: requisicao.reqKm,
        reqStatus: requisicao.reqStatus,
        reqIntegral: Number(requisicao.reqIntegral) || 0,
        reqParcial: requisicao.reqParcial > 0 ? 1 : 0,
        reqEspecial: Number(requisicao.reqEspecial) || 0,
        reqPacote: requisicao.reqPacote === 1 ? 'N' : 'S',
        reqGovernador: requisicao.reqGovernador,
        desLocal: requisicao.desLocal,
        desMunIdCodigo: requisicao.munIdCodigo,
        desMunNme: requisicao.munCidade,
        diariaIntegral: diarias?.VL_DIARIA_INTEGRAL || 0,
        diariaParcial: diarias?.VL_DIARIA_PARCIAL || 0,
        diariaBase: diarias?.VL_DIARIA_BASE || 0,
        valorSolicitado: diarias?.VL_DIARIA_TOTAL || 0,
        regDescricao: requisicao.regDescricao,
        traDescricao: requisicao.traDescricao,
        diariaParcPorc: diarias?.PARPERC || 0,
        vlDiaria: diarias?.VL_DIARIA || 0,
        ITI_DTSAIDA: iti.ITI_DTSAIDA,
        ITI_HSAIDA: iti.ITI_HSAIDA,
        ITI_DTCHEGADA: iti.ITI_DTCHEGADA,
        ITI_HCHEGADA: iti.ITI_HCHEGADA,
        diariaIntegralChegada: qtdIntegral,
        diariaParcialChegada: qtdParcial,
      });
    } catch (error) {
      logger.error(`erro REQUISIÇÃO : ${requisicao.regIdCodigo}`, error);
      return new ReturnRequisicaoDto(requisicao);
    }
  }

  async findOne(sqeIdCodigo: number) {
    try {
      const result = await this.requisicaoRepository
        .createQueryBuilder('r')
        .where('r.SQE_ID_CODIGO = :sqeIdCodigo', { sqeIdCodigo })
        .andWhere('ROWNUM = 1')
        .getRawOne();
      if (!result) {
        throw new Error('Saque não encontrado');
      }
      return result;
    } catch (error) {
      console.error(error);
      throw new HttpException('Prestação não encontrada', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  //TODO: Busca requisições aprovadas
  async findAllAprovadas(params: FindAllAutorizadasParams, user: AuthUserDto): Promise<any> {
    try {
      const pageNumber = params.page ?? 1;
      const pageSize = params.limit ?? 500;
      const startRow = (pageNumber - 1) * pageSize + 1;
      const endRow = pageNumber * pageSize;
      const searchParams: FindOptionsWhere<RequisicaoEntity> = {};

      // Filtro de data
      searchParams['reqDtSaida'] = MoreThanOrEqual(new Date('2009-08-10'));

      // Filtro de STATUS
      if (params.reqstatus) {
        let reqStatusArray: string[] = [];
        reqStatusArray = params.reqstatus.split(',').map((status) => status.trim());
        searchParams['reqStatus'] = In(reqStatusArray);
      } else {
        // Filtro de status
        searchParams['reqStatus'] = In([
          'AUTORIZADA PELO DIRETOR',
          'AUTORIZADA PELO DIRETOR EXECUTIVO',
        ]);
      }

      // Ordenação
      const orderColumn = params.orderBy || 'reqIdCodigo';
      const orderDirection = params.orderDirection === 'DESC' ? 'DESC' : 'ASC';

      const queryBuilder = this.requisicaoRepository
        .createQueryBuilder('r')
        .select([
          'r.REQ_ID_CODIGO AS "reqIdCodigo"',
          'r.COD_MUNICIP AS "codMunicipio"',
          'r.REQ_DTREQ AS "reqDtReq"',
          'r.REQ_DTSAIDA AS "reqDtSaida"',
          'r.REQ_MOTORISTA AS "reqMotorista"',
          'r.REQ_HSAIDA AS "reqHSaida"',
          'r.REQ_HRET AS "reqHRet"',
          'r.REQ_MOTIVO AS "reqMotivo"',
          'r.REQ_KM AS "reqKm"',
          'r.REQ_STATUS AS "reqStatus"',
          'fs.salario AS "salario"',
          'fs.nome AS "nome"',
          'fs.chapa AS "chapa"',
          'fs.codsecao AS "codsecao"',
        ])
        .leftJoin('r.funcSalario', 'fs')
        .where(searchParams);

      if (params.nome) {
        queryBuilder.andWhere('LOWER(fs.nome) LIKE LOWER(:nome)', {
          nome: `%${params.nome}%`,
        });
      }

      //FILTRO POR SETOR
      const { PERMISSAO, CODSECAO } = await this.ppessoaService.find({
        chapa: user?.chapa ?? params?.chapa,
      });

      const pesquisa = filtrarSetorLike(PERMISSAO, CODSECAO, 'fs.codsecao');
      if (params.chapa) {
        queryBuilder.andWhere('r.chapa = :chapa', { chapa: params.chapa });
      } else {
        if (pesquisa) {
          queryBuilder.andWhere(pesquisa, { chapa: user.chapa });
        } else {
          queryBuilder.andWhere('r.chapa = :chapa', { chapa: user.chapa });
        }
      }

      // Ordenação
      queryBuilder.orderBy(`r.${orderColumn}`, orderDirection);

      // Paginação
      const paginatedQuery = `
        SELECT * FROM (
          SELECT a.*, ROWNUM rnum FROM (
            ${queryBuilder.getQuery()}
          ) a WHERE ROWNUM <= ${endRow}
        ) WHERE rnum >= ${startRow}
      `;

      const parameters = Object.values(queryBuilder.getParameters());
      const result = await this.requisicaoRepository.query(paginatedQuery, parameters);

      // Retornar RequisDto
      return result.map((reqv) => {
        return new RequisDto({
          chapa: reqv.chapa,
          reqIdCodigo: reqv.reqIdCodigo,
          reqStatus: reqv.reqStatus,
          reqDtReq: reqv.reqDtReq,
          nome: reqv.nome,
          codsecao: reqv.codsecao,
        });
      });
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Erro ao buscar requisições aprovadas',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  //TODO: Busca requisições aprovadas no mes atual

  async findMesAtual(params: findMesParams, user: AuthUserDto): Promise<RequisDto[]> {
    try {
      const chapa = params.chapa ? params.chapa : user.chapa;
      const filterConditions = [];
      const filterValues = [];

      // Verifica se a data fornecida está no formato adequado
      const dataatual = params.dataAtual ? params.dataAtual : new Date();
      let inicioMes: string;
      let fimMes: string;
      // Tenta formatar as datas corretamente
      try {
        const parsedData = parse(format(dataatual, 'yyyy-MM-dd'), 'yyyy-MM-dd', new Date());
        if (isDate(parsedData)) {
          const inicio = format(addMonths(startOfMonth(parsedData), 1), 'dd/MM/yyyy 00:00:00');
          const fim = format(addMonths(endOfMonth(parsedData), 1), 'dd/MM/yyyy 00:00:00');
          inicioMes = inicio;
          fimMes = fim;
        } else {
          // Se a data estiver no formato incorreto, usa a data atual
          const hoje = new Date();
          inicioMes = format(addMonths(startOfMonth(hoje), 1), 'dd/MM/yyyy 00:00:00');
          fimMes = format(addMonths(endOfMonth(hoje), 1), 'dd/MM/yyyy 00:00:00');
        }
      } catch (e) {
        // Caso ocorra erro ao formatar, usa a data atual como fallback
        console.error('Erro ao formatar data:', e);
        const hoje = new Date();
        inicioMes = format(addMonths(startOfMonth(hoje), 1), 'dd/MM/yyyy 00:00:00');
        fimMes = format(addMonths(endOfMonth(hoje), 1), 'dd/MM/yyyy 00:00:00');
      }
      filterConditions.push(`
        TO_DATE(A.REQ_DTREQ, 'DD/MM/YYYY HH24:MI:SS') 
        BETWEEN 
        TO_DATE('${inicioMes}', 'DD/MM/YYYY HH24:MI:SS')
        AND 
        TO_DATE('${fimMes}', 'DD/MM/YYYY HH24:MI:SS')
      `);

      // Filtro de STATUS
      if (params.REQ_STATUS) {
        const reqStatusArray = gerarFiltroStatus(params.REQ_STATUS, 'a.REQ_STATUS');
        filterConditions.push(reqStatusArray);
      } else {
        filterConditions.push(
          `a.REQ_STATUS IN ('AUTORIZADA PELO DIRETOR', 'AUTORIZADA PELO DIRETOR EXECUTIVO')`,
        );
      }

      // FILTRO POR SETOR
      const { PERMISSAO, CODSECAO } = await this.ppessoaService.find({ chapa: chapa });
      const pesquisa = filtrarSetorLike(PERMISSAO, CODSECAO, 'C.CODSECAO');
      if (pesquisa) {
        filterConditions.push(pesquisa);
        filterValues.push(user.chapa);
      } else {
        filterConditions.push('b.CHAPA = :chapa');
        filterValues.push(chapa);
      }

      const query = `
      SELECT
        A.REQ_ID_CODIGO as REQ_ID_CODIGO,
        A.REQ_STATUS as REQ_STATUS,
        A.REQ_DTREQ as REQ_DTREQ,
        B.CHAPA as CHAPA,
        C.CODSECAO as CODSECAO
      from
        Transporte.S001_Requisicao A,
        Transporte.S001_Usureq B,
        Rm.Pfunc C
      Where
        A.REQ_ID_CODIGO = B.REQ_ID_CODIGO
        and
        B.CHAPA = C.CHAPA     
      AND
        ${filterConditions.join(' AND ')}
    `;
      // console.log('query', query);

      const requisicao = await this.requisicaoRepository.query(query, filterValues);

      const retornoRequi = requisicao.map((requis) => {
        const newdate = DataUtils.converterStringParaData(requis?.REQ_DTREQ);

        const periodo = calcularPeriodo(newdate);
        return new RequisDto({
          chapa: requis?.CHAPA,
          reqIdCodigo: requis?.REQ_ID_CODIGO,
          reqStatus: requis?.REQ_STATUS,
          reqDtReq: requis?.REQ_DTREQ,
          periodoAprovacao: periodo,
        });
      });

      return retornoRequi;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        `Erro buscar requisições aprovadas: ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Busca requisições pendentes
  async findPendentes(user: AuthUserDto, params: findPendentesParams): Promise<requiTotal> {
    try {
      const filterConditions = [];
      const filterValues: Record<string, any> = {};

      // Dados do usuário logado
      const { PERMISSAO, CODSECAO } = await this.ppessoaService.find({ chapa: user.chapa });
      const pesquisa = filtrarSetorLike(PERMISSAO, CODSECAO, 'b.CODSECAO');

      // Se não tem permissão de chefia, retorna apenas os dados do usuário logado
      if (params.chapa) {
        filterConditions.push('b.CHAPA = :chapa');
        filterValues.chapa = params.chapa;
      } else {
        if (pesquisa) {
          filterConditions.push(pesquisa);
          filterValues.chapa = user.chapa;
        } else {
          filterConditions.push('b.CHAPA = :chapa');
          filterValues.chapa = user.chapa;
        }
      }

      // Filtro por data de início
      if (params.dataInicio) {
        filterConditions.push("d.REQ_DTSAIDA >= TO_DATE(:dataInicio, 'YYYY-MM-DD')");
        filterValues.dataInicio = params.dataInicio;
      }

      // Filtro por data final
      if (params.dataFinal) {
        filterConditions.push("d.REQ_DTSAIDA <= TO_DATE(:dataFinal, 'YYYY-MM-DD')");
        filterValues.dataFinal = params.dataFinal;
      }

      if (params.prazoAtivo) {
        filterConditions.push('b.PRA_ATIVO = :prazoAtivo');
        filterValues.prazoAtivo = params.prazoAtivo;
      } else {
        filterConditions.push("b.PRA_ATIVO = 'N'");
      }

      const stringQuery = ` 
        SELECT    
          a.SQE_ID_CODIGO as SQE_ID_CODIGO, 
          d.REQ_ID_CODIGO as SQE_ID_CODIGO,
          d.REQ_DTSAIDA ,   
          d.REQ_DTRET,    
          a.SQE_EFETIVO as SQE_EFETIVO,
          a.SQE_TIPOSAQUE as SQE_TIPOSAQUE,
          a.SQE_DTSAQUE as SQE_DTSAQUE,
          a.SQE_VLSAQUE as SQE_VLSAQUE,
          a.SQE_DTPREST ,     
          b.CHAPA as CHAPA,     
          b.PRA_ATIVO as PRA_ATIVO,
          b.CODSECAO   
        FROM FINANCEIRO.s009_saque a
        INNER JOIN FINANCEIRO.V009_ITENSREQREC b ON a.ITE_ID_CODIGO = b.ITE_ID_CODIGO 
        INNER JOIN FINANCEIRO.s009_reqnumerario c ON a.SQE_ID_CODIGO = c.SQE_ID_CODIGO
        INNER JOIN TRANSPORTE.s001_requisicao d ON c.REQ_ID_CODIGO = d.REQ_ID_CODIGO 
        WHERE a.SQE_TIPOSAQUE = 'N'        
        AND a.SQE_EFETIVO IN ('S', 'C', 'R', 'E')
        AND (a.SQE_DTPREST IS NULL OR a.SQE_VLPREST = 0)
        AND d.REQ_DTSAIDA >= TO_DATE('2009-08-10', 'YYYY-MM-DD')
        AND ${filterConditions.join(' AND ')}
        ORDER BY d.REQ_DTSAIDA DESC  
        `;
      const consulta = await this.requisicaoRepository.query(
        stringQuery,
        Object.values(filterValues),
      );

      const retorno = consulta.map((req) => {
        const periodo = calcularPeriodo(req.REQ_DTRET);

        return new requiPendente({
          CHAPA: req.CHAPA,
          SQE_ID_CODIGO: req.SQE_ID_CODIGO,
          REQ_ID_CODIGO: req.REQ_ID_CODIGO,
          REQ_DTRET: req.REQ_DTRET,
          periodopendente: periodo,
        });
      });

      return {
        data: retorno,
        total: retorno.length || 0,
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findListaSaque(user: AuthUserDto, params: ListSaqueParams): Promise<any> {
    try {
      const filterConditions = [];
      const filterValues: Record<string, any> = {};

      if (params.REQ_ID_CODIGO) {
        filterConditions.push(`su.REQ_ID_CODIGO = :REQ_ID_CODIGO`);
        filterValues.REQ_ID_CODIGO = params.REQ_ID_CODIGO;
      }

      // Filtro por data de início
      if (params.dataInicio) {
        filterConditions.push(`r.REQ_DTSAIDA >= TO_DATE(:dataInicio, 'YYYY-MM-DD')`);
        filterValues.dataInicio = params.dataInicio;
      }
      // Filtro por data final
      if (params.dataFinal) {
        filterConditions.push(`r.REQ_DTSAIDA <= TO_DATE(:dataFinal, 'YYYY-MM-DD')`);
        filterValues.dataFinal = params.dataFinal;
      }

      const offset = (params.page - 1) * (params.limit ?? 1);
      const limit = offset + (params.limit ?? 1);

      filterValues.selection = offset + limit;
      filterValues.offset = offset;

      const filters = filterConditions.length > 0 ? `${filterConditions.join(' AND ')}` : '';

      const stringQuery = `
      SELECT 
        CODUSUARIO, 
        NOME, 
        CPF, 
        SALARIO, 
        REQ_ID_CODIGO
        FROM (
          SELECT pagination.*, ROWNUM AS rn
          FROM (
            SELECT 
              p.CODUSUARIO, 
              p.NOME, 
              p.CPF, 
              pf.SALARIO, 
              su.REQ_ID_CODIGO
            FROM RM.PPESSOA p
            INNER JOIN RM.PFUNC pf ON pf.CHAPA = p.CODUSUARIO
            INNER JOIN TRANSPORTE.S001_USUREQ su ON p.CODUSUARIO = su.CHAPA
            INNER JOIN TRANSPORTE.S001_REQUISICAO r ON r.REQ_ID_CODIGO = su.REQ_ID_CODIGO
            WHERE ${filters}
            ORDER BY pf.SALARIO DESC
          ) pagination
          WHERE ROWNUM <= (:selection)
        )
        WHERE rn > :offset
      `;

      const consulta = await this.requisicaoRepository.query(
        stringQuery,
        Object.values(filterValues),
      );
      return {
        data: consulta,
        total: consulta.length ?? 0,
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
