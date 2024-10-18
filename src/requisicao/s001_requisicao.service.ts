import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RequisicaoEntity } from 'src/database/db_mysql/entities/requisicao.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { FindAllParams, ReturnRequisicaoDto } from './requisicao.dto';

import {} from './returnRequisicao.dto';
import { UfespService } from 'src/ufesp/ufesp.service';

import { FuncsalarioService } from 'src/funcsalario/funcsalario.service';

import { verificarDestino } from 'src/util/verificaDestino';
import { Destino } from 'src/util/diariaDto';
import { SaquesMesService } from 'src/saques-mes/saques-mes.service';
import { DespesadiariaService } from 'src/despesadiaria/despesadiaria.service';
import { formatDateToYYMM } from 'src/util/formatoYYMM';
import { calcularDiariaValores } from 'src/util/calculo_dia_retorno';
import { ItinirarioService } from 'src/itinirario/itinirario.service';
import { retornoItinerarioDto } from 'src/itinirario/itinerarioDto';

@Injectable()
export class S001RequisicaoService {
  constructor(
    @InjectRepository(RequisicaoEntity, 'mysqlConnection')
    private requisicaoRepository: Repository<RequisicaoEntity>,
    private ufespService: UfespService,
    private funcSalarioService: FuncsalarioService,
    private SaquesMesService: SaquesMesService,
    private despesaDiaria: DespesadiariaService,
    private itinirarioService: ItinirarioService,
  ) {}

  async findAll(params: FindAllParams): Promise<ReturnRequisicaoDto[]> {
    try {
      const searchParams: FindOptionsWhere<RequisicaoEntity> = {};
      if (params.reqIdCodigo) {
        searchParams.reqIdCodigo = params.reqIdCodigo;
      }
      if (params.codMunicipio) {
        searchParams.codMunicipio = params.codMunicipio;
      }
      if (params.reqStatus) {
        searchParams.reqStatus = params.reqStatus;
      }
      if (params.chapa) {
        searchParams.chapa = params.chapa;
      }
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
          relations: [ 'destino'],
        });
      } else {
        requisicoes = await this.requisicaoRepository.find({
          where: searchParams,
          order,
          relations: ['destino'],
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
      const formatoYYMM = formatDateToYYMM(requisicao.reqDtSaida);

      // Busca o valor do saque do usuário no mês da requisição
      let saqueMes = 0;
      try {
        const saqueSalario = await this.SaquesMesService.findOne(chapa, formatoYYMM);
        saqueMes = Number(saqueSalario?.totSaque) || 0;
      } catch (error) {
        console.warn(`Erro ao buscar saque do mês para chapa ${chapa}:`, error);
      }

      // Busca o valor da UFESP na data da requisição
      const UFESP = (await this.ufespService.findValueByDate(requisicao.reqDtSaida)).ufeValor || 0;

      // Busca o salário do usuário
      const user = await this.funcSalarioService.findByCodigo(chapa);
      const salarioAtual = user?.salario || 0;

      // Busca o indice da UFESP do cargo do usuário
      const UFESPcargo = await this.despesaDiaria.findOne(user.cargo);
      const UFESPcargoValor = Number(UFESPcargo?.dtdValorMax) || 0;

      // Busca o valor da diária base do usuário
      const reqIntegral = Number(requisicao.reqIntegral) || 0;
      const reqParcial = Number(requisicao.reqParcial) || 0;
      const destino = verificarDestino(requisicao?.destino?.municipio?.munIdCodigo);

      // Calcula as diárias com base no UFESP, cargo, destino e outras informações da requisição.
      const diarias = calcularDiariaValores(
        UFESP,
        UFESPcargoValor,
        destino as Destino,
        requisicao.reqPacote || 0,
        reqIntegral,
        reqParcial > 0 ? 1 : 0,
        requisicao.reqHRet,
      );

      const totalParcial = diarias?.VL_DIARIA_PARCIAL_20 + diarias?.VL_DIARIA_PARCIAL_40 || 0;
      const totalIntegral = diarias?.VL_DIARIA_INTEGRAL || 0;
      const ValorSolicitado = totalParcial + totalIntegral || 0;
      const dirariaBase = diarias?.VL_DIARIA_BASE || 0;
      const vlDiaria = diarias?.VL_DIARIA || 0;

      let diariaParcPorc = 0;

      if (diarias?.VL_DIARIA_PARCIAL_20 > 0) {
        diariaParcPorc = 20;
      } else if (diarias?.VL_DIARIA_PARCIAL_40 > 0) {
        diariaParcPorc = 40;
      }

      const salario50Porcento = salarioAtual / 2 || 0;
      const salario50PorcentoFormatado = salario50Porcento > 0 ? salario50Porcento.toFixed(2) : 0;
      const salario50PorcentoNumber = Number(salario50PorcentoFormatado);

      let saldoRestante = salario50PorcentoNumber - (saqueMes + ValorSolicitado);
      saldoRestante = Number(saldoRestante ? saldoRestante.toFixed(2) : 0);

      let itinirario = new retornoItinerarioDto();
      itinirario = await this.itinirarioService.findUltimo(requisicao.reqIdCodigo);

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
        desLocal: requisicao.destino?.desLocal ?? null,
        desMunIdCodigo: requisicao.destino?.municipio?.munIdCodigo ?? 0,
        desMunNme: requisicao.destino?.municipio?.munCidade ?? '',
        diariaIntegral: totalIntegral,
        diariaParcial: totalParcial,
        diariaBase: dirariaBase,
        saqueMes: saqueMes,
        valorSolicitado: ValorSolicitado,
        salario50Porcento: salario50PorcentoNumber,
        saldoDisponivel: saldoRestante,
        regDescricao: requisicao.regDescricao,
        traDescricao: requisicao.traDescricao,
        diariaParcPorc: diariaParcPorc,
        vlDiaria: vlDiaria,
      });


    } catch (error) {
      console.error(`Erro ao gerar lista : ${requisicao.regIdCodigo}`, error);
      return new ReturnRequisicaoDto(requisicao);
    }
  }
}
