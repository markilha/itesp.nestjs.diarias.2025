import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RequisicaoEntity } from 'src/database/db_mysql/entities/requisicao.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { FindAllParams, ReturnRequisicaoDto, RequisicaoDto } from './requisicao.dto';

import {} from './returnRequisicao.dto';
import { UfespService } from 'src/ufesp/ufesp.service';
import { PcargoService } from 'src/pcargo/pcargo.service';
import { FuncsalarioService } from 'src/funcsalario/funcsalario.service';
import { DiariaService } from 'src/util/diaria.service';
import { verificarDestino } from 'src/util/verificaDestino';
import { Destino } from 'src/util/diariaDto';
import { SaquesMesService } from 'src/saques-mes/saques-mes.service';
import { DespesadiariaService } from 'src/despesadiaria/despesadiaria.service';
import { formatDateToYYMM } from 'src/util/formatoYYMM';

@Injectable()
export class S001RequisicaoService {
  constructor(
    @InjectRepository(RequisicaoEntity, 'mysqlConnection')
    private requisicaoRepository: Repository<RequisicaoEntity>,
    private ufespService: UfespService,
    private funcSalarioService: FuncsalarioService,
    private diariaCalculada: DiariaService,
    private SaquesMesService: SaquesMesService,
    private despesaDiaria: DespesadiariaService,
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

      // Configuração da ordenação baseada na query string
      const order: { [key: string]: 'ASC' | 'DESC' } = {};
      if (params.orderBy) {
        // Verifica se o campo de ordenação está presente e define a direção
        order[params.orderBy] = params.orderDirection === 'DESC' ? 'DESC' : 'ASC';
      } else {
        // Ordenação padrão se nenhum parâmetro for passado
        order['reqIdCodigo'] = 'ASC'; // Padrão: ordenar por 'reqIdCodigo'
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
          relations: ['transmeio', 'destino', 'destino.municipio'],
        });
      } else {
        requisicoes = await this.requisicaoRepository.find({
          where: searchParams,
          order,
          relations: ['transmeio', 'destino', 'destino.municipio'],
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
      const saqueSalario = await this.SaquesMesService.findOne(chapa, formatoYYMM);
      console.log(saqueSalario);

      const saqueMes = Number(saqueSalario?.totSaque) || 0;

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
      const diarias = this.diariaCalculada.calcularDiaria(
        UFESP,
        UFESPcargoValor,
        destino as Destino,
        requisicao.reqPacote || 0,
        reqIntegral,
        reqParcial > 0 ? 1 : 0,
        requisicao.reqHRet,
      );

      const totalParcial = diarias?.diariaParcial40 + diarias?.diariaParcial20 || 0;
      const totalIntegral = diarias?.diariaIntegral || 0;
      const ValorSolicitado = totalParcial + totalIntegral || 0;

      const salario50Porcento = salarioAtual / 2 || 0;
      const salario50PorcentoFormatado = salario50Porcento > 0 ? salario50Porcento.toFixed(2) : 0;
      const salario50PorcentoNumber = Number(salario50PorcentoFormatado);

      let saldoRestante = salario50PorcentoNumber - (saqueMes + ValorSolicitado);
      saldoRestante = Number(saldoRestante ? saldoRestante.toFixed(2) : 0);

      return new ReturnRequisicaoDto(
        requisicao,
        diarias?.diariaIntegral,
        totalParcial,
        diarias?.diariaBase,
        saqueMes,
        ValorSolicitado,
        salario50PorcentoNumber,
        saldoRestante,
      );
    } catch (error) {
      console.error(`Erro ao calcular diária: ${requisicao.regIdCodigo}`, error);
      return new ReturnRequisicaoDto(requisicao);
    }
  }
}
