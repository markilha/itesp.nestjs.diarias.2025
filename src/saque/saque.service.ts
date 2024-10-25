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
        dataSaida: consulta.REQ_DTSAIDA,
        horaSaida: consulta.REQ_HSAIDA,
        dataChegada: consulta.REQ_DTRET,
        horaChegada: consulta.REQ_HRET,
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
  private async buscarConsulta(sqeIdCodigo: number): Promise<any> {
    const consulta = await this.saqueRepository.query(queryPrestacao, [sqeIdCodigo]);

    if (!consulta?.length) {
      throw new HttpException('Saque não encontrado', HttpStatus.NOT_FOUND);
    }

    return consulta[0];
  }

  private async buscarItinerario(reqIdCodigo: number) {
    try {
      return await this.itinerarioService.findUltimo(reqIdCodigo);
    } catch (error) {
      console.error('Erro ao buscar itinerário:', error);
      return null;
    }
  }

  private async buscarUfesp(dataSaida: string): Promise<number> {
    const { ufeValor } = await this.ufespService.findValueByDate(dataSaida);
    return ufeValor;
  }

  private async buscarUfespCargo(cargo: string): Promise<number> {
    const UFESPcargo = await this.despesaDiaria.findOne(cargo);
    return Number(UFESPcargo?.dtdValorMax);
  }

  private async calcularDiarias(
    consulta: any,
    itinerario: any,
    UFESP: number,
    UFESPcargoValor: number,
    destino: Destino,
  ) {
    try {
      const itiDataHora = getDateTimeParams(consulta, itinerario);

      const { diariaIntegral, diariaParcial, diaraPorc } =
        calcQuantDiariaIntegralParcialPorcen(itiDataHora);

      const pacote = Number(consulta.REQ_PACOTE);

      const calcDiaraInial = calcularDiariaValores(
        UFESP,
        UFESPcargoValor,
        destino,
        pacote,
        consulta.REQ_INTEGRAL,
        consulta.REQ_PARCIAL > 0 ? 1 : 0,
        consulta.REQ_HRET,
      );

      const calcDiaraRetorn = calcularDiariaValores(
        UFESP,
        UFESPcargoValor,
        destino,
        pacote,
        diariaIntegral,
        diariaParcial,
        itiDataHora.horaChegada,
      );

      return {
        calcDiaraInial,
        calcDiaraRetorn,
        diariaIntegral,
        diariaParcial,
        diaraPorc,
      };
    } catch (error) {
      console.error('Erro ao calcular diárias:', error);
      throw new HttpException('Erro ao calcular diárias', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private calcularExtornosEDevolucoes(
    calcDiaraInial: DiariaCalculadaDto,
    calcDiaraRetorn: DiariaCalculadaDto,
  ) {
    const { VL_EXTORNO: vlExtornoIntegral, VL_DEVOLUCAO: vlDevolucaoIntegral } = calcularValores(
      calcDiaraInial.VL_DIARIA_INTEGRAL,
      calcDiaraRetorn.VL_DIARIA_INTEGRAL,
    );

    const { VL_EXTORNO: vlExtornParcial, VL_DEVOLUCAO: vlDevolucaoParcial } = calcularValores(
      calcDiaraInial.VL_DIARIA_PARCIAL,
      calcDiaraRetorn.VL_DIARIA_PARCIAL,
    );

    return {
      vlExtornoIntegral,
      vlExtornParcial,
      vlDevolucaoIntegral,
      vlDevolucaoParcial,
    };
  }

  private async buscarDadosNecessarios(consulta: any) {
    try {
      const [itinerario, UFESP, UFESPcargoValor] = await Promise.all([
        this.buscarItinerario(consulta.REQ_ID_CODIGO).catch((error) => {
          throw new HttpException(
            'Erro ao buscar itinerário: ' + error.message,
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }),
        this.buscarUfesp(consulta.REQ_DTSAIDA).catch((error) => {
          throw new HttpException(
            'Erro ao buscar valor UFESP: ' + error.message,
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }),
        this.buscarUfespCargo(consulta.CARGO).catch((error) => {
          throw new HttpException(
            'Erro ao buscar UFESP do cargo: ' + error.message,
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }),
      ]);

      return { itinerario, UFESP, UFESPcargoValor };
    } catch (error) {
      // Propaga o erro específico para ser tratado no nível superior
      throw error instanceof HttpException
        ? error
        : new HttpException(
            'Erro ao buscar dados necessários para prestação',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
    }
  }

  //BUSCAR TODOS OS SAQUES
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
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findPrestacao(params: FindParamsSaque): Promise<PrestacaoDto> {
    let destino: Destino | null = null;
    try {
      const consulta = await this.buscarConsulta(params.SQE_ID_CODIGO);

      if (!consulta) {
        throw new HttpException('Saque não encontrado', HttpStatus.NOT_FOUND);
      }

      const { itinerario, UFESP, UFESPcargoValor } = await this.buscarDadosNecessarios(consulta);

      try {
        destino = verificarDestino(consulta.MUN_ID_CODIGO) as Destino;
      } catch (error) {
        throw new HttpException('Destino não encontrado', HttpStatus.NOT_FOUND);
      }

      const STATUS = RetonaStatus(
        consulta.SQE_EFETIVO,
        consulta.SQE_TIPOSAQUE,
        consulta.PRA_ATIVO,
        consulta.SQE_DTPREST,
        consulta.SQE_VLPREST,
      );

      const { calcDiaraInial, calcDiaraRetorn, diariaIntegral, diariaParcial, diaraPorc } =
        await this.calcularDiarias(
          consulta,
          itinerario,
          UFESP,
          UFESPcargoValor,
          destino as Destino,
        );

      const { vlExtornoIntegral, vlExtornParcial, vlDevolucaoIntegral, vlDevolucaoParcial } =
        this.calcularExtornosEDevolucoes(calcDiaraInial, calcDiaraRetorn);

      return new PrestacaoDto({
        NOME: consulta.NOME,
        REQ_ID_CODIGO: consulta.REQ_ID_CODIGO,
        SQE_ID_CODIGO: consulta.SQE_ID_CODIGO,
        CHAPA: consulta.CHAPA,
        SQE_DTPREST: consulta.SQE_DTPREST,
        SQE_VLPREST: consulta.IRR_VALOR_PREST,
        REQ_DTREQ: consulta.REQ_DTREQ,
        TRA_DESCRICAO: consulta.TRA_DESCRICAO,
        NME_MUNIC: consulta.NME_MUNIC,
        REG_DESCRICAO: consulta.REG_DESCRICAO,
        MUN_CIDADE: consulta.MUN_CIDADE,
        DES_LOCAL: consulta.DES_LOCAL,
        REQ_DTSAIDA: consulta.REQ_DTSAIDA,
        REQ_DTRET: consulta.REQ_DTRET,
        REQ_HSAIDA: consulta.REQ_HSAIDA,
        REQ_HRET: consulta.REQ_HRET,
        REQ_INTEGRAL: Number(consulta.REQ_INTEGRAL) || 0,
        REQ_PARCIAL: consulta.REQ_PARCIAL > 0 ? 1 : 0,
        REQ_PACOTE: Number(consulta.REQ_PACOTE) === 0 ? 'S' : 'N',
        REQ_GOVERNADOR: consulta.REQ_GOVERNADOR,
        REQ_MOTIVO: consulta.REQ_MOTIVO,
        CTR_STATUS: consulta.CTR_STATUS,
        STATUS,
        ITI_DTSAIDA: itinerario?.ITI_DTSAIDA,
        ITI_HSAIDA: itinerario?.ITI_HSAIDA,
        ITI_DTCHEGADA: itinerario?.ITI_DTCHEGADA,
        ITI_HCHEGADA: itinerario?.ITI_HCHEGADA,
        SQE_VLSAQUE: Number(consulta.SQE_VLSAQUE) || 0,
        INTREAL: diariaIntegral,
        PARREAL: diariaParcial,
        VLINTPREV: calcDiaraInial.VL_DIARIA_INTEGRAL,
        VLPARPREV: calcDiaraInial.VL_DIARIA_PARCIAL,
        VLINTREAL: calcDiaraRetorn.VL_DIARIA_INTEGRAL,
        VLPARREAL: calcDiaraRetorn.VL_DIARIA_PARCIAL,
        VLBASE: calcDiaraRetorn.VL_DIARIA_BASE,
        VLPREST: calcDiaraRetorn.VL_DIARIA_TOTAL,
        VLDIARIA: calcDiaraRetorn.VL_DIARIA,
        PORCDIARIARETORNO: diaraPorc,
        VLCOMPLEMENTARINTEGRAL: vlExtornoIntegral,
        VLCOMPLEMENTARPARCIAL: vlExtornParcial,
        VLDEVOLUCAOINTEGRAL: vlDevolucaoIntegral,
        VLDEVOLUCAOPARCIAL: vlDevolucaoParcial,
        PRA_ATIVO: consulta.PRA_ATIVO,
        UFESP,
        TRA_ID_CODIGO: consulta.TRA_ID_CODIGO,
      });
    } catch (error) {
      console.error('Erro ao buscar prestação:', error);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
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
