import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  FindParamsSaque,
  RetNumSaque,
  SaqueDto,
  PrestacaoDto,
  SolitarDto,
  InsS009SaqueDto,
  DateTimeParams,
} from './saque.dto';

import { SaqueEntity } from 'src/database/db_oracle/entities/saque.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { calcularValores } from 'src/util/calculo_extorno';
import { formatDates } from 'src/util/formatStarDateEndDate';
import { ItinirarioService } from 'src/itinirario/itinirario.service';
import {
  calcQuantDiariaIntegralParcialPorcen,
  calcularDiariaValores,
} from 'src/util/calculo_dia_retorno';
import { Destino } from 'src/util/diariaDto';
import { UfespService } from 'src/ufesp/ufesp.service';
import { DespesadiariaService } from 'src/despesadiaria/despesadiaria.service';
import { verificarDestino } from 'src/util/verificaDestino';
import { DataUtils } from 'src/util/DataUtils';

import { MotivodiariaService } from 'src/motivodiaria/motivodiaria.service';
import { retornoItinerarioDto } from 'src/itinirario/itinerarioDto';
import * as oracledb from 'oracledb';
import { DiariaCalculadaDto } from './saque.dto';
import { queryPrestacao, querySaque } from 'src/util/variaveis/querys';
import { getObjectValues } from 'src/util/arrays/retornaArrayObj';
import { RetonaStatus } from 'src/util/variaveis/statusPrestacao';

function getDateTimeParams(consulta: any, itinerario: any): DateTimeParams {
  return consulta.TRA_ID_CODIGO === 1
    ? {
        dataSaida: itinerario.ITI_DTSAIDA,
        horaSaida: itinerario.ITI_HSAIDA,
        dataChegada: itinerario.ITI_DTCHEGADA,
        horaChegada: itinerario.ITI_HCHEGADA,
      }
    : {
        dataSaida: consulta[0].REQ_DTSAIDA,
        horaSaida: consulta[0].REQ_HSAIDA,
        dataChegada: consulta[0].REQ_DTRET,
        horaChegada: consulta[0].REQ_HRET,
      };
}

@Injectable()
export class SaqueService {
  constructor(
    @InjectRepository(SaqueEntity, 'oracleConnection')
    private saqueRepository: Repository<SaqueEntity>,
    private motivoDiaria: MotivodiariaService,
    private itinerarioService: ItinirarioService,
    private ufespService: UfespService,
    private despesaDiaria: DespesadiariaService,
  ) {}

  async findAll(params: FindParamsSaque): Promise<SaqueDto[]> {
    try {
      const chapa = params.CHAPA;
      const orderByField = params.orderBy || 'a.SQE_DTPEDIDO';
      const orderDirection = params.orderDirection || 'ASC';

      const page = params.page || 1;
      const itemsPerPage = params.limit || 100;
      const offset = (page - 1) * itemsPerPage;

      const filterConditions: string[] = [];
      const filterValues: any[] = [];

      // Adiciona o filtro de CHAPA
      filterConditions.push('b.CHAPA = :chapa');
      filterValues.push(chapa);

      // Verifica e adiciona cada filtro dinamicamente
      if (params.SQE_ID_CODIGO) {
        filterConditions.push('a.SQE_ID_CODIGO = :SQE_ID_CODIGO');
        filterValues.push(params.SQE_ID_CODIGO);
      }
      if (params.REQ_ID_CODIGO) {
        filterConditions.push('d.REQ_ID_CODIGO = :REQ_ID_CODIGO');
        filterValues.push(params.REQ_ID_CODIGO);
      }
      if (params.STS_DESCRICAO) {
        filterConditions.push('b.STS_DESCRICAO = :STS_DESCRICAO');
        filterValues.push(params.STS_DESCRICAO);
      }
      if (params.REQ_STATUS) {
        filterConditions.push('d.REQ_STATUS = :REQ_STATUS');
        filterValues.push(params.REQ_STATUS);
      }

      // Verifica se as datas foram fornecidas e adiciona os filtros
      if (params.startDate && params.endDate) {
        const prestDate = params.usePrestDate === 'true';
        const dataColumn = prestDate ? 'a.SQE_DTPREST' : 'a.SQE_DTSAQUE';
        // Formata as datas de entrada
        const { startDate, endDate } = formatDates(params.startDate, params.endDate) || {};
        // Adiciona a condição de filtro com o formato de data correto
        filterConditions.push(
          `TO_DATE(
          CASE 
            WHEN LENGTH(${dataColumn}) = 8 THEN ${dataColumn} || ' 00:00:00' -- Para o formato DD/MM/YY
            ELSE ${dataColumn}
          END,
          'DD/MM/YYYY HH24:MI:SS'
        ) BETWEEN TO_DATE(TRIM(:startDate), 'DD/MM/YYYY HH24:MI:SS') 
        AND TO_DATE(TRIM(:endDate), 'DD/MM/YYYY HH24:MI:SS')`,
        );

        // Adiciona os valores de filtro
        filterValues.push(startDate);
        filterValues.push(endDate);
      }

      const result = await this.saqueRepository.query(
        querySaque(filterConditions, orderByField, orderDirection),
        [...filterValues, offset, itemsPerPage],
      );

      let consulta = result.map((item: any) => {
        // Calcular valores de extorno e devolução
        const { VL_DEVOLUCAO, VL_EXTORNO } = calcularValores(item.SQE_VLSAQUE, item.SQE_VLPREST);

        const STATUS = RetonaStatus(
          item.SQE_EFETIVO,
          item.SQE_TIPOSAQUE,
          item.PRA_ATIVO,
          item.SQE_DTPREST,
          item.SQE_VLPREST,
        );

        return new SaqueDto({
          SQE_ID_CODIGO: item.SQE_ID_CODIGO,
          SQE_DTPEDIDO: item.SQE_DTPEDIDO,
          SQE_DTSAQUE: item.SQE_DTSAQUE,
          SQE_VLSAQUE: Number(item.SQE_VLSAQUE) || 0,
          SQE_VLPREST: Number(item.SQE_VLPREST) || 0,
          RRE_ID_CODIGO: item.RRE_ID_CODIGO,
          ITE_ID_CODIGO: item.ITE_ID_CODIGO,
          SQE_DTPREST: item.SQE_DTPREST,
          NOME: item.NOME,
          REQ_ID_CODIGO: item.REQ_ID_CODIGO,
          TDE_DESCRICAO: item.TDE_DESCRICAO,
          STS_DESCRICAO: item.STS_DESCRICAO,
          REQ_DTREQ: item.REQ_DTREQ,
          REQ_STATUS: item.REQ_STATUS,
          CHAPA: item.CHAPA,
          VL_COMPLEMENTAR: VL_EXTORNO,
          VL_EXTORNO: VL_DEVOLUCAO,
          STATUS,
          SQE_EFETIVO: item.SQE_EFETIVO,
          PRA_ATIVO: item.PRA_ATIVO,
        });
      });

      // Filtros adicionais
      if (params.STATUS) {
        consulta = consulta.filter((item: any) => item.STATUS === params.STATUS);
      }

      return consulta;
    } catch (error) {
      console.error('Erro na consulta findSaque:', error);
      throw new HttpException('Erro ao buscar Saques', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findPrestacao(params: FindParamsSaque): Promise<any> {
    try {
      const sqeIdCodigo = params.SQE_ID_CODIGO;
      let UFESP = 0;
      let itinerario: retornoItinerarioDto;
      let UFESPcargoValor = 0;
      let destino = '';
      let pacote = 0;
      let calcDiaraRetorn: DiariaCalculadaDto;
      let calcDiaraInial: DiariaCalculadaDto;
      let valdevolintegral = 0;
      let valordevolparcial = 0;

      const consulta = await this.saqueRepository.query(queryPrestacao, [sqeIdCodigo]);

      if (!consulta || consulta.length === 0) {
        throw new HttpException('Saque não encontrado', HttpStatus.NOT_FOUND);
      }

      pacote = Number(consulta[0].REQ_PACOTE);

      const STATUS = RetonaStatus(
        consulta[0].SQE_EFETIVO,
        consulta[0].SQE_TIPOSAQUE,
        consulta[0].PRA_ATIVO,
        consulta[0].SQE_DTPREST,
        consulta[0].SQE_VLPREST,
      );

      try {
        itinerario = await this.itinerarioService.findUltimo(consulta[0].REQ_ID_CODIGO);
      } catch (error) {
        console.error('Erro ao buscar itinerário:', error);
      }

      // Busca o valor da UFESP na data da requisição
      try {
        UFESP = (await this.ufespService.findValueByDate(consulta[0].REQ_DTSAIDA)).ufeValor || 0;
      } catch (error) {
        console.error('Erro ao buscar UFESP:', error);
      }

      // Busca o indice da UFESP do cargo do usuário
      try {
        const UFESPcargo = await this.despesaDiaria.findOne(consulta[0].CARGO);
        UFESPcargoValor = Number(UFESPcargo?.dtdValorMax) || 0;
      } catch (error) {
        throw new HttpException('Erro ao buscar UFESP do cargo', HttpStatus.INTERNAL_SERVER_ERROR);
      }

      //buscar destino
      try {
        destino = verificarDestino(consulta[0].MUN_ID_CODIGO);
      } catch (error) {
        throw new HttpException('Erro ao destino da viagem', HttpStatus.INTERNAL_SERVER_ERROR);
      }

      // Calcular diárias
      const itiDataHora = getDateTimeParams(consulta[0], itinerario);

      const { diariaIntegral, diariaParcial, diaraPorc } =
        calcQuantDiariaIntegralParcialPorcen(itiDataHora);

      //CALCULO DIARIA INICAL
      calcDiaraInial = calcularDiariaValores(
        UFESP,
        UFESPcargoValor,
        destino as Destino,
        pacote,
        consulta[0].REQ_INTEGRAL,
        consulta[0].REQ_PARCIAL > 0 ? 1 : 0,
        consulta[0].REQ_HRET,
      );

      //CALCULO DIRIA RETORNO
      calcDiaraRetorn = calcularDiariaValores(
        UFESP,
        UFESPcargoValor,
        destino as Destino,
        pacote,
        diariaIntegral,
        diariaParcial,
        itiDataHora.horaChegada,
      );

      let vlestornointegral =
        calcDiaraRetorn.VL_DIARIA_INTEGRAL - calcDiaraInial.VL_DIARIA_INTEGRAL;
      let vlestornoparcial = calcDiaraRetorn.VL_DIARIA_PARCIAL - calcDiaraInial.VL_DIARIA_PARCIAL;

      if (vlestornointegral < 0) {
        valdevolintegral = Math.abs(vlestornointegral);
        vlestornointegral = 0;
      }
      if (vlestornoparcial < 0) {
        valordevolparcial = Math.abs(vlestornoparcial);
        vlestornoparcial = 0;
      }

      return new PrestacaoDto({
        NOME: consulta[0].NOME,
        REQ_ID_CODIGO: consulta[0].REQ_ID_CODIGO,
        SQE_ID_CODIGO: consulta[0].SQE_ID_CODIGO,
        CHAPA: consulta[0].CHAPA,
        SQE_DTPREST: consulta[0].SQE_DTPREST,
        SQE_VLPREST: consulta[0].IRR_VALOR_PREST,
        REQ_DTREQ: consulta[0].REQ_DTREQ,
        TRA_DESCRICAO: consulta[0].TRA_DESCRICAO,
        NME_MUNIC: consulta[0].NME_MUNIC,
        REG_DESCRICAO: consulta[0].REG_DESCRICAO,
        MUN_CIDADE: consulta[0].MUN_CIDADE,
        DES_LOCAL: consulta[0].DES_LOCAL,
        REQ_DTSAIDA: consulta[0].REQ_DTSAIDA,
        REQ_DTRET: consulta[0].REQ_DTRET,
        REQ_HSAIDA: consulta[0].REQ_HSAIDA,
        REQ_HRET: consulta[0].REQ_HRET,
        REQ_INTEGRAL: Number(consulta[0].REQ_INTEGRAL) || 0,
        REQ_PARCIAL: consulta[0].REQ_PARCIAL > 0 ? 1 : 0,
        REQ_PACOTE: pacote === 0 ? 'S' : 'N',
        REQ_GOVERNADOR: consulta[0].REQ_GOVERNADOR,
        REQ_MOTIVO: consulta[0].REQ_MOTIVO,
        CTR_STATUS: consulta[0].CTR_STATUS,
        STATUS: STATUS,
        // ITINERARIO
        ITI_DTSAIDA: itinerario.ITI_DTSAIDA,
        ITI_HSAIDA: itinerario.ITI_HSAIDA,
        ITI_DTCHEGADA: itinerario.ITI_DTCHEGADA,
        ITI_HCHEGADA: itinerario.ITI_HCHEGADA,
        // DIARIAS-QUANTIDADE
        SQE_VLSAQUE: Number(consulta[0].SQE_VLSAQUE) || 0,
        INTREAL: diariaIntegral,
        PARREAL: diariaParcial,
        //DIARIA-VALORES
        VLINTPREV: calcDiaraInial.VL_DIARIA_INTEGRAL,
        VLPARPREV: calcDiaraInial.VL_DIARIA_PARCIAL,
        VLINTREAL: calcDiaraRetorn.VL_DIARIA_INTEGRAL,
        VLPARREAL: calcDiaraRetorn.VL_DIARIA_PARCIAL,

        VLBASE: calcDiaraRetorn.VL_DIARIA_BASE,
        VLPREST: calcDiaraRetorn.VL_DIARIA_TOTAL,
        VLCOMPLEMENTARINT: vlestornointegral,
        VLCOMPLEMENTARPAR: vlestornoparcial,
        VLDEVOLUCAOINT: valdevolintegral,
        VLDEVOLUCAOPAR: valordevolparcial,
        VLDIARIA: calcDiaraRetorn.VL_DIARIA,
        PORCDIARIARETORNO: diaraPorc,
        //PARAMETROS
        PRA_ATIVO: consulta[0].PRA_ATIVO,
        UFESP: UFESP,
        TRA_ID_CODIGO: consulta[0].TRA_ID_CODIGO,
      });
    } catch (error) {
      console.error('Erro na consulta findSaque:', error);
      return new HttpException('Erro ao buscar Saques', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  //SOlicitar saque

  async solicitarSaque(params: SolitarDto): Promise<RetNumSaque> {
    try {
      const MD = await this.motivoDiaria.findOne(params.chapa, params.reqIdCodigo);
      if (!MD) {
        throw new HttpException('Diária de viagem não encontrada', HttpStatus.NOT_FOUND);
      }

      const saqueDto = new InsS009SaqueDto({
        par1: 'REEMBOLSO',
        par2: 'S',
        par3: '7',
        par4: MD.ITE_ID_CODIGO,
        par5: MD.RRE_ID_CODIGO,
        par6: MD.DIR_ID_CODIGO,
        par7: null,
        par8: null,
        par9: MD.MDI_VALOR,
        par10: 'N',
        par11: 'S',
        par12: null,
        par13: null,
        par14: null,
        par15: null,
        par16: null,
        par17: params.reqIdCodigo,
        par18: DataUtils.formatDateToString(MD.REQ_DTSAIDA),
        par19: MD.REQ_HSAIDA,
        par20: DataUtils.formatDateToString(MD.REQ_DTRET),
        par21: MD.REQ_HRET,
        par22: MD.REQ_INTEGRAL,
        par23: MD.REQ_PARCIAL,
        par24: null,
        par25: null,
        par26: MD.REQ_PACOTE,
        par27: MD.REQ_GOVERNADOR,
        par28: MD.REQ_MOTIVO,
        par29: MD.REQ_STATUS,
        par30: params.diariaIntegral,
        par31: params.diariaParcial,
        par32: params.diariaBase,
      });

      const valuesArray = getObjectValues(saqueDto);

      const query = `
      CALL INS_S009_SAQUE(
        :par1, :par2, TO_CHAR(:par3), :par4, :par5, :par6, :par7, :par8, :par9, :par10,
        :par11, :par12, :par13, :par14, :par15, :par16, :par17, TO_DATE(:par18, 'DD-MM-YYYY'), 
        :par19, TO_DATE(:par20, 'DD-MM-YYYY'), :par21, :par22, :par23, :par24,
        :par25, :par26, :par27, :par28, :par29, :par30, :par31, :par32, :id
      )
    `;

      const result = await this.saqueRepository.query(query, [
        ...valuesArray,
        { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
      ]);

      return { sqeIdCodigo: result[0] };
    } catch (error) {
      console.error('Erro ao solicitar saque:', error);
      throw new HttpException(
        `Erro ao solicitar saque: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
