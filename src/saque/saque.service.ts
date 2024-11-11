import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  FindParamsSaque,
  RetNumSaque,
  SaqueDto,
  PrestacaoDto,
  SolitarDto,
  DateTimeParams,
  returnSaqueDto,
  buscarSaqueDto,
} from './saque.dto';

import { SaqueEntity } from '../database/db_oracle/entities/saque.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { calcularValores } from '../util/calculo_extorno';
import { formatDates } from '../util/formatStarDateEndDate';
import { ItinirarioService } from '../itinirario/itinirario.service';
import {
  calcQuantDiariaIntegralParcialPorcen,
  calcularDiariaValores,
} from '../util/calculo_dia_retorno';
import { Destino } from '../util/diariaDto';
import { UfespService } from '../ufesp/ufesp.service';
import { DespesadiariaService } from '../despesadiaria/despesadiaria.service';
import { verificarDestino } from '../util/verificaDestino';

import { MotivodiariaService } from '../motivodiaria/motivodiaria.service';

import { DiariaCalculadaDto } from './saque.dto';
import { querySaque, querySaqueCount } from '../util/variaveis/querys';

import { RetonaStatus } from '../util/variaveis/statusPrestacao';
import { ReqnumerarioService } from '../reqnumerario/reqnumerario.service';
import { ReqnumerarioDto } from '../reqnumerario/reqnumerarioDto';
import { reembolsoService } from '../reembolso/reembolso.service';
import { reqtransService } from '../reqtrans/reqtrans.service';
import { FuncsalarioService } from '../funcsalario/funcsalario.service';
import { DataUtils } from '../util/DataUtils';
import { extornoService } from '../extorno/extorno.service';
import { itensreqrecService } from 'src/itensreqrec/itensreqrec.service';
import { S001RequisicaoService } from 'src/requisicao/s001_requisicao.service';
import { destinoService } from 'src/destino/destino.service';
import { formatDate } from 'date-fns';
import { naotrabService } from 'src/naotrab/naotrab.service';

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
    private reqtransService: reqtransService,
    private reembolsoService: reembolsoService,
    private funcsalarioService: FuncsalarioService,
    private extornoService: extornoService,
    private itensreqrecService: itensreqrecService,
    private reqnumerarioService: ReqnumerarioService,
    private requisicaoService: S001RequisicaoService,
    private destinoService: destinoService,
    private naotrabservice: naotrabService,
  ) {}

  private async buscarConsulta(sqeIdCodigo: number): Promise<any> {
    const saque = await this.findOne(sqeIdCodigo);
    const itensreq = await this.itensreqrecService.findOne(saque.iteIdCodigo);
    const reqnumerario = await this.reqnumerarioService.findOne(saque.sqeIdCodigo);
    const requisicao = await this.requisicaoService.findOne(reqnumerario.REQ_ID_CODIGO);
    const destino = await this.destinoService.findOne(requisicao.reqIdCodigo);

    const saquedto: buscarSaqueDto = {
      SQE_ID_CODIGO: saque.sqeIdCodigo,
      SQE_DTPEDIDO: saque.sqeDtPedido,
      SQE_EFETIVO: saque.sqeEfetivo,
      SQE_TIPOSAQUE: saque.sqeTipoSaque,
      SQE_VLSAQUE: saque.sqeVlSaque,
      CHAPA: itensreq.CHAPA,
      NOME: itensreq.NOME,
      TDE_DESCRICAO: itensreq.TDE_DESCRICAO,
      STS_DESCRICAO: itensreq.STS_DESCRICAO,
      PRA_ATIVO: itensreq.PRA_ATIVO,
      REQ_ID_CODIGO: reqnumerario.REQ_ID_CODIGO,
      RNU_ID_CODIGO: reqnumerario.RNU_ID_CODIGO,
      REQ_STATUS: requisicao.reqStatus,
      REQ_DTSAIDA: requisicao.reqDtSaida,
      REQ_HSAIDA: requisicao.reqHSaida,
      REQ_DTRET: requisicao.reqDtReq,
      REQ_HRET: requisicao.reqHRet,
      REQ_PACOTE: requisicao.reqPacote,
      REQ_INTEGRAL: requisicao.reqIntegral,
      REQ_PARCIAL: requisicao.reqParcial,
      TRA_ID_CODIGO: requisicao.traIdCodigo,
      REQ_MOTIVO: requisicao.reqMotivo,
      MUN_ID_CODIGO: destino.MUN_ID_CODIGO,
      DES_LOCAL: destino.DES_LOCAL,
      MUN_CIDADE: requisicao.nmeMunic,
      TRA_DESCRICAO: requisicao.traDescricao,
      NME_MUNIC: requisicao.nmeMunic,
      REG_DESCRICAO: requisicao.regDescricao,
    };

    return saquedto;

    // let consulta = await this.saqueRepository.query(queryPrestacao, [sqeIdCodigo]);

    // return consulta[0];
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

  private async buscarUfespCargo(chapa: string): Promise<number> {
    const funcsalario = await this.funcsalarioService.findByCodigo(chapa);
    if (!funcsalario) {
      throw new HttpException('Funcionário não encontrado', HttpStatus.NOT_FOUND);
    }

    const UFESPcargo = await this.despesaDiaria.findOne(funcsalario.cargo);
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
      const nt = await this.naotrabservice.totalDiariaNaoTrabalhada(consulta.REQ_ID_CODIGO);
      const diariaNaoTrabalhada = nt.total || 0;
      const { diariaIntegral, diariaParcial, diaraPorc } = calcQuantDiariaIntegralParcialPorcen(
        itiDataHora,
        diariaNaoTrabalhada,
      );
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
        this.buscarUfespCargo(consulta.CHAPA).catch((error) => {
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
  async findAll(params: FindParamsSaque): Promise<any> {
    try {
      // total de registros por params.chapa

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

      const count = await this.saqueRepository.query(
        querySaqueCount(filterConditions),
        filterValues,
      );
      const totalCount = count[0]?.TOTAL_REGISTROS || 0;

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

        return new returnSaqueDto({
          SQE_ID_CODIGO: item.SQE_ID_CODIGO,
          SQE_DTPEDIDO: DataUtils.converterParaData(item.SQE_DTPEDIDO),
          SQE_DTSAQUE: DataUtils.converterParaData(item.SQE_DTSAQUE),
          SQE_VLSAQUE: Number(item.SQE_VLSAQUE) || 0,
          SQE_VLPREST: Number(item.SQE_VLPREST) || 0,
          RRE_ID_CODIGO: item.RRE_ID_CODIGO,
          ITE_ID_CODIGO: item.ITE_ID_CODIGO,
          SQE_DTPREST: DataUtils.converterParaData(item.SQE_DTPREST),
          NOME: item.NOME,
          REQ_ID_CODIGO: item.REQ_ID_CODIGO,
          TDE_DESCRICAO: item.TDE_DESCRICAO,
          STS_DESCRICAO: item.STS_DESCRICAO,
          REQ_DTREQ: DataUtils.converterParaData(item.REQ_DTREQ),
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
      return {
        data: consulta,
        total: totalCount,
      };
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

      let justificativa = '';

      // Tenta encontrar o extorno sem quebrar se não encontrar
      try {
        const extorno = await this.extornoService.findOneOrFail(params.SQE_ID_CODIGO);
        justificativa = extorno?.EXT_JUSTIFICA || justificativa;
      } catch (error) {}

      // Tenta encontrar o reembolso sem quebrar se não encontrar
      try {
        const reembolso = await this.reembolsoService.findone(params.SQE_ID_CODIGO);
        justificativa = reembolso?.RRE_JUSTIFICATIVA || justificativa;
      } catch (error) {}

      return new PrestacaoDto({
        NOME: consulta.NOME,
        REQ_ID_CODIGO: consulta.REQ_ID_CODIGO,
        SQE_ID_CODIGO: consulta.SQE_ID_CODIGO,
        RNU_ID_CODIGO: consulta.RNU_ID_CODIGO,
        CHAPA: consulta.CHAPA,
        SQE_DTPREST: consulta.SQE_DTPREST,
        SQE_VLPREST: consulta.IRR_VALOR_PREST,
        REQ_DTREQ: DataUtils.converterParaData(consulta.REQ_DTREQ),
        TRA_DESCRICAO: consulta.TRA_DESCRICAO,
        NME_MUNIC: consulta.NME_MUNIC,
        REG_DESCRICAO: consulta.REG_DESCRICAO,
        MUN_CIDADE: consulta.MUN_CIDADE,
        DES_LOCAL: consulta.DES_LOCAL,
        REQ_DTSAIDA: formatDate(consulta.REQ_DTSAIDA, 'yyyy-mm-dd 00:00:00'),
        REQ_DTRET: consulta.REQ_DTRET,
        REQ_HSAIDA: consulta.REQ_HSAIDA,
        REQ_HRET: consulta.REQ_HRET,
        REQ_INTEGRAL: Number(consulta.REQ_INTEGRAL) || 0,
        REQ_PARCIAL: consulta.REQ_PARCIAL,
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
        PARREAL: calcDiaraRetorn.PARPERC,
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
        JUSTIFICATIVA: justificativa,
        TOTALCOMPLEMENTAR: vlExtornoIntegral + vlExtornParcial,
        TOTALDEVOLUCAO: vlDevolucaoIntegral + vlDevolucaoParcial,
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  //Buscar ultimo id
  async lastId(): Promise<number> {
    try {
      const lastIdResult = await this.saqueRepository.query(
        `SELECT MAX(SQE_ID_CODIGO) as lastId FROM S009_SAQUE`,
      );
      return lastIdResult[0]?.LASTID + 1 || 0;
    } catch (error) {
      console.error('Erro ao buscar último ID:', error);
      throw new HttpException('Erro ao buscar último ID', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  //SOlicitar saque
  async solicitarSaque(params: SolitarDto): Promise<RetNumSaque> {
    try {
      const PAR2 = 'S';
      const PAR3 = '7';
      const PAR10 = 'N';
      const MD = await this.motivoDiaria.findOne(params.chapa, params.reqIdCodigo);

      const newId = await this.lastId();

      const saqueDto = new SaqueDto({
        sqeIdCodigo: newId,
        iteIdCodigo: MD.ITE_ID_CODIGO,
        rreIdCodigo: MD.RRE_ID_CODIGO,
        dirIdCodigo: MD.DIR_ID_CODIGO,
        fpaIdCodigo: 1,
        stsIdCodigo: 1,
        sqeDtSaque: null,
        sqeVlPrest: null,
        sqeDtPrest: null,
        sqeVlSaque: MD.MDI_VALOR,
        sqeTipoSaque: PAR10,
        sqeEfetivo: PAR2,
        sqeDtPedido: DataUtils.formatarDataAtual(),
        sqeLote: null,
        sqeAnoLote: null,
        sqeTerceiro: null,
        pesIdCodigo: null,
        pesPessoa: null,
        sqeUsuario: null,
        sqeEmpenho: null,
        sqeListaSiafem: null,
      });

      try {
        await this.saqueRepository.insert(saqueDto);
      } catch (error) {
        throw new HttpException(
          `Erro ao inserir saque: ${error.message}`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      const lastINumerario = await this.reqnumerarioService.findLast();

      try {
        const lastIdNum = lastINumerario;
        const newIdNum = lastIdNum + 1;
        const numerario = new ReqnumerarioDto({
          RNU_ID_CODIGO: newIdNum,
          SQE_ID_CODIGO: newId,
          REQ_ID_CODIGO: params.reqIdCodigo,
          ITE_ID_CODIGO: MD.ITE_ID_CODIGO,
          RRE_ID_CODIGO: MD.RRE_ID_CODIGO,
          DIR_ID_CODIGO: MD.DIR_ID_CODIGO,
          RNU_DTINICIO: MD.REQ_DTSAIDA,
          RNU_HORAINICIO: MD.REQ_HSAIDA,
          RNU_DTFIM: MD.REQ_DTRET,
          RNU_HORAFIM: MD.REQ_HRET,
          RNU_INTPREV: String(MD.REQ_INTEGRAL) || null,
          RNU_PARPREV: String(MD.REQ_PARCIAL) || null,
          RNU_INTREAL: null,
          RNU_PARREAL: null,
          RNU_MOTIVO: MD.REQ_MOTIVO,
          RNU_PACOTE: MD.REQ_PACOTE,
          RNU_GOVERNADOR: MD.REQ_GOVERNADOR,
          RNU_VLINTEGRAL: params.diariaIntegral,
          RNU_VLPARCIAL: params.diariaParcial,
          RNU_VLBASE: params.diariaBase,
        });
        await this.reqnumerarioService.create(numerario);
      } catch (error) {
        throw new HttpException(
          `Erro ao inserir numerário: ${error.message}`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      // /*JUSTIFICATIVA*/
      let rresaque = null;
      if (PAR2 === 'S') {
        rresaque = newId;
      }
      await this.reembolsoService.inseriReembolso({
        RRE_ID_CODIGO: MD.RRE_ID_CODIGO,
        DIR_ID_CODIGO: MD.DIR_ID_CODIGO,
        ITE_ID_CODIGO: MD.ITE_ID_CODIGO,
        SQE_ID_CODIGO: newId,
        RRE_JUSTIFICATIVA: MD.REQ_MOTIVO,
        RRE_SAQUE: rresaque,
      });

      //   /*REQUISIÇÃO DE TRANSPORTE*/
      if (PAR10 === 'N' && PAR3 === '7' && PAR2 === 'S') {
        await this.reqtransService.updateStatus(params.reqIdCodigo, 'RECURSO SOLICITADO');
      }

      return { sqeIdCodigo: newId };
    } catch (error) {
      throw new HttpException(
        `Erro ao solicitar saque: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(sqeIdCodigo: number): Promise<SaqueDto> {
    try {
      const result = await this.saqueRepository.findOneOrFail({
        where: {
          sqeIdCodigo,
        },
      });
      return result;
    } catch (error) {
      throw new HttpException('Saque não encontrado', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateEfetivo(sqeidcodigo: number, efetivo: string): Promise<SaqueDto> {
    const saque = await this.findOne(sqeidcodigo);
    saque.sqeEfetivo = efetivo;
    await this.saqueRepository.save(saque);
    return saque;
  }
}
