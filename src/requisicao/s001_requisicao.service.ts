import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Between, FindOptionsWhere, In, MoreThanOrEqual, Raw, Repository } from 'typeorm';
import {
  FindAllAutorizadasParams,
  FindAllParams,
  findMesParams,
  RequisDto,
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
import { startOfMonth, endOfMonth, format } from 'date-fns';
import { BIND_IN } from 'oracledb';

@Injectable()
export class S001RequisicaoService {
  constructor(
    @InjectRepository(RequisicaoEntity, 'oracleConnection')
    private requisicaoRepository: Repository<RequisicaoEntity>,
    private ufespService: UfespService,
    private SaquesMesService: SaquesMesService,
    private itinirarioService: ItinirarioService,
  ) {}

  private async buscarItinerario(reqIdCodigo: number) {
    try {
      return await this.itinirarioService.findUltimo(reqIdCodigo);
    } catch (error) {
      return null;
    }
  }

  async find(params: FindAllParams): Promise<ReturnRequisicaoDto[]> {
    try {
      const searchParams: FindOptionsWhere<RequisicaoEntity> = {};
      const fields = ['reqIdCodigo', 'codMunicipio', 'reqStatus', 'chapa'];
      fields.forEach((field) => {
        if (params[field]) {
          searchParams[field] = params[field];
        }
      });

      const order: { [key: string]: 'ASC' | 'DESC' } = {};
      if (params.orderBy) {
        order[params.orderBy] = params.orderDirection === 'DESC' ? 'DESC' : 'ASC';
      } else {
        order['reqIdCodigo'] = 'ASC';
      }

      let requisicoes: RequisicaoEntity[];

      if (params.page && params.limit) {
        const page = params.page;
        const limit = params.limit;
        const skip = (page - 1) * limit;

        requisicoes = await this.requisicaoRepository.find({
          where: searchParams,
          skip,
          take: limit,
          order,
          relations: ['destino', 'funcSalario', 'funcSalario.despesaDiaria'],
        });
      } else {
        requisicoes = await this.requisicaoRepository.find({
          where: searchParams,
          order,
          relations: ['destino', 'funcSalario', 'funcSalario.despesaDiaria'],
        });
      }
      if (!requisicoes || requisicoes.length === 0) {
        return [];
      }

      const results = await Promise.all(
        requisicoes.map((requisicao) => this.processRequisicao(requisicao, params.chapa)),
      );

      return results;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private async processRequisicao(
    requisicao: RequisicaoEntity,
    chapa: string,
  ): Promise<ReturnRequisicaoDto> {
    try {
      let UFESP = 0;
      let saqueMes = 0;
      let salarioAtual = 0;
      let UFESPcargoValor = 0;
      let salario50PorcentoNumber = 0;
      let saqueSalario = null;
      let saldoRestante = 0;
      let destino = '' as Destino;
      let qtdIntegral = null;
      let qtdParcial = null;

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
        saqueMes = Number(saqueSalario[0]?.TotalSaqueMes) || 0;
      } catch (error) {
        logger.error(`Erro ao buscar saque do mês para chapa (${requisicao.chapa}): `, error);
      }

      // Busca o valor do salário atual e do salário 50%
      try {
        UFESPcargoValor = Number(requisicao?.funcSalario?.despesaDiaria?.dtdValorMax) || 0;
        salarioAtual = requisicao?.funcSalario?.salario || 0;
        salario50PorcentoNumber = calcularSalario50(salarioAtual);
      } catch (error) {
        logger.error(`Erro ao buscar dados do funcionário (${requisicao.chapa}): `, error);
      }

      // Busca o destino da viagem
      try {
        destino = verificarDestino(requisicao?.destino?.municipio?.munIdCodigo) as Destino;
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
        iti = await this.buscarItinerario(requisicao.reqIdCodigo);
      } else {
        iti.ITI_DTSAIDA = DataUtils.converterStringParaData(requisicao.reqDtSaida);
        iti.ITI_HSAIDA = requisicao.reqHSaida;
        iti.ITI_DTCHEGADA = DataUtils.converterStringParaData(requisicao.reqDtReq);
        iti.ITI_HCHEGADA = requisicao.reqHRet;
      }

      try {
        qtdIntegral = calcularDiariaIntegral(
          iti.ITI_DTSAIDA,
          iti.ITI_HSAIDA,
          iti.ITI_DTCHEGADA,
          iti.ITI_HCHEGADA,
        );
        qtdParcial = calcularDiariaParcial(iti.ITI_HCHEGADA);
      } catch (error) {
        console.log(error);
      }

      // Retorna o DTO
      return new ReturnRequisicaoDto({
        reqIdCodigo: requisicao.reqIdCodigo,
        chapa: requisicao.chapa,
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
        desLocal: requisicao.destino.desLocal,
        desMunIdCodigo: requisicao.destino.munIdCodigo,
        desMunNme: requisicao.destino?.municipio?.munCidade,
        diariaIntegral: diarias?.VL_DIARIA_INTEGRAL || 0,
        diariaParcial: diarias?.VL_DIARIA_PARCIAL || 0,
        diariaBase: diarias?.VL_DIARIA_BASE || 0,
        saqueMes: saqueMes,
        valorSolicitado: diarias?.VL_DIARIA_TOTAL || 0,
        salario50Porcento: salario50PorcentoNumber,
        saldoDisponivel: saldoRestante,
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
      logger.error(`REQUISIÇÃO : ${requisicao.regIdCodigo}`, error);
      return new ReturnRequisicaoDto(requisicao);
    }
  }

  async findAllAprovadas(params: FindAllAutorizadasParams): Promise<RequisDto[]> {
    try {
      const searchParams: FindOptionsWhere<RequisicaoEntity> = {};
      const pageNumber = params.page ?? 1;
      const pageSize = params.limit ?? 10;
      const skip = (pageNumber - 1) * pageSize;

      searchParams['reqStatus'] = In([
        'AUTORIZADA PELO DIRETOR',
        'AUTORIZADA PELO DIRETOR EXECUTIVO',
      ]);
      searchParams['reqDtReq'] = MoreThanOrEqual('2008-01-01');

      const order: { [key: string]: 'ASC' | 'DESC' } = {};
      if (params.orderBy) {
        order[params.orderBy] = params.orderDirection === 'DESC' ? 'DESC' : 'ASC';
      } else {
        order['reqIdCodigo'] = 'ASC';
      }

      if (params.chapa) {
        searchParams['chapa'] = params.chapa;
      }

      const requisicao = await this.requisicaoRepository.find({
        where: searchParams,
        skip,
        take: params.limit,
        order,
      });

      return requisicao.map((reqv) => new RequisDto(reqv));
    } catch (error) {
      throw new HttpException(
        'Erro ao buscar requisições aprovadas',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findMesAtual(params: findMesParams): Promise<RequisDto[]> {
    try {
      // Formata as datas no mesmo padrão que está no banco
      const inicioMes = format(startOfMonth(new Date()), 'dd/MM/yyyy 00:00:00');
      const fimMes = format(endOfMonth(new Date()), 'dd/MM/yyyy 23:59:59');  
      
      const requisicao = await this.requisicaoRepository.find({
        where: {
          reqStatus: In(['AUTORIZADA PELO DIRETOR', 'AUTORIZADA PELO DIRETOR EXECUTIVO']),
          chapa: params.chapa,
          reqDtReq: Raw((alias) => 
            `TO_DATE(${alias}, 'DD/MM/YYYY HH24:MI:SS') BETWEEN TO_DATE('${inicioMes}', 'DD/MM/YYYY HH24:MI:SS') AND TO_DATE('${fimMes}', 'DD/MM/YYYY HH24:MI:SS')`
          ),
        },
      });
      return requisicao.map((reqv) => new RequisDto(reqv));
    } catch (error) {    
      throw new HttpException(
        'Erro ao buscar requisições aprovadas',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
