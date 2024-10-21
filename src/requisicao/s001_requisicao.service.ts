import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RequisicaoEntity } from 'src/database/db_mysql/entities/requisicao.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { FindAllParams, ReturnRequisicaoDto } from './requisicao.dto';

import { UfespService } from 'src/ufesp/ufesp.service';
import { verificarDestino } from 'src/util/verificaDestino';
import { Destino } from 'src/util/diariaDto';
import { SaquesMesService } from 'src/saques-mes/saques-mes.service';
import { formatDateToYYMM } from 'src/util/formatoYYMM';
import { calcularDiariaValores } from 'src/util/calculo_dia_retorno';
import { ItinirarioService } from 'src/itinirario/itinirario.service';
import { retornoItinerarioDto } from 'src/itinirario/itinerarioDto';
import { calcularSalario50 } from 'src/util/variaveis/calculo_50';
import { logger } from 'src/util/savelogs/SaveLogs';

@Injectable()
export class S001RequisicaoService {
  constructor(
    @InjectRepository(RequisicaoEntity, 'mysqlConnection')
    private requisicaoRepository: Repository<RequisicaoEntity>,
    private ufespService: UfespService,
    private SaquesMesService: SaquesMesService,
    private itinirarioService: ItinirarioService,
  ) {}

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

      const formatoYYMM = formatDateToYYMM(requisicao.reqDtSaida);

      // Busca o valor do saque do mês
      try {
        saqueSalario = await this.SaquesMesService.findOne(chapa, formatoYYMM);
      } catch (error) {
        logger.error(`Erro ao buscar saque do mês para chapa (${chapa}): `, error);
      }

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
        saqueMes = Number(saqueSalario?.totSaque) || 0;
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
      });
    } catch (error) {
      console.warn(`REQUISIÇÃO : ${requisicao.regIdCodigo}`, error);
      logger.error(`REQUISIÇÃO : ${requisicao.regIdCodigo}`, error);
      return new ReturnRequisicaoDto(requisicao);
    }
  }
}
