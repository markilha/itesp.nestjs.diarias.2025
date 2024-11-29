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
  ParamsPendente,
  ParamsCancela,
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

import {
  RetonaPrestacaoStatus,
  RetornaSaquePendentes,
} from '../util/variaveis/statusSaquePrestacao';
import { ReqnumerarioService } from '../reqnumerario/reqnumerario.service';

import { reembolsoService } from '../reembolso/reembolso.service';
import { reqtransService } from '../reqtrans/reqtrans.service';
import { FuncsalarioService } from '../funcsalario/funcsalario.service';
import { DataUtils } from '../util/DataUtils';
import { extornoService } from '../extorno/extorno.service';
import { itensreqrecService } from '../itensreqrec/itensreqrec.service';
import { destinoService } from '../destino/destino.service';
import { formatDate } from 'date-fns';
import { naotrabService } from '../naotrab/naotrab.service';
import { documentosService } from 'src/documentos/documento.service';
import { docsEntity } from 'src/database/db_mysql/entities/docs.entity';
import {
  SelecionaPendencia,
  SelecionaPendencias,
  selecionaSaquePendente,
} from '../util/selects/saques';

import {
  SelecionaAgrupaRec,
  SelecionaItensRecurso,
  SelecionaRequisicao,
  selecionaUltimoPrazo,
} from 'src/util/selects/itensRecurso';
import { itensreqrecEntity } from 'src/database/db_oracle/entities/itensreqrec.entity';
import * as oraccledb from 'oracledb';
import { obterParametros } from 'src/util/obterParametros_sqeefetivo';
import { AuthUserDto } from 'src/auth/use.auth.Dto';

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
    private destinoService: destinoService,
    private naotrabservice: naotrabService,
    private documentosService: documentosService,
  ) {}

  private async buscarConsulta(sqeIdCodigo: number): Promise<any> {
    const saque = await this.findOne(sqeIdCodigo);

    const itensreq = await this.itensreqrecService.findOne(saque.iteIdCodigo);

    const reqnumerario = await this.reqnumerarioService.findOne(saque.sqeIdCodigo);

    const reqtrans = await this.reqtransService.findOne(reqnumerario.REQ_ID_CODIGO);

    const destino = await this.destinoService.findOne(reqnumerario.REQ_ID_CODIGO);

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
      REQ_STATUS: reqtrans.REQ_STATUS,
      REQ_DTSAIDA: reqtrans.REQ_DTSAIDA,
      REQ_HSAIDA: reqtrans.REQ_HSAIDA,
      REQ_DTRET: reqtrans.REQ_DTRET,
      REQ_HRET: reqtrans.REQ_HRET,
      REQ_PACOTE: Number(reqtrans.REQ_PACOTE),
      REQ_INTEGRAL: reqtrans.REQ_INTEGRAL,
      REQ_PARCIAL: reqtrans.REQ_PARCIAL,
      TRA_ID_CODIGO: reqtrans.TRA_ID_CODIGO,
      REQ_MOTIVO: reqtrans.REQ_MOTIVO,
      MUN_ID_CODIGO: destino.MUN_ID_CODIGO,
      DES_LOCAL: destino.DES_LOCAL,
      MUN_CIDADE: reqtrans?.muni?.nmeMunic,
      NME_MUNIC: reqtrans?.muni?.nmeMunic,
      TRA_DESCRICAO: reqtrans?.transmeio?.traDescricao,
      REG_DESCRICAO: reqtrans?.regional?.REG_DESCRICAO,
    };

    return saquedto;
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
      let calcDiaraInial = null;
      let calcDiaraRetorn = null;

      const itiDataHora = getDateTimeParams(consulta, itinerario);
      const nt = await this.naotrabservice.totalDiariaNaoTrabalhada(consulta.REQ_ID_CODIGO);

      const diariaNaoTrabalhada = nt.total || 0;

      const { diariaIntegral, diariaParcial, diaraPorc } = calcQuantDiariaIntegralParcialPorcen(
        itiDataHora,
        diariaNaoTrabalhada,
      );

      const pacote = Number(consulta.REQ_PACOTE);

      calcDiaraInial = calcularDiariaValores(
        UFESP,
        UFESPcargoValor,
        destino,
        pacote,
        consulta.REQ_INTEGRAL,
        consulta.REQ_PARCIAL > 0 ? 1 : 0,
        consulta.REQ_HRET,
      );

      calcDiaraRetorn = calcularDiariaValores(
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
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
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
          throw new HttpException('Erro ao buscar itinerário: ', HttpStatus.INTERNAL_SERVER_ERROR);
        }),

        this.buscarUfesp(consulta.REQ_DTSAIDA).catch((error) => {
          throw new HttpException(
            'Requisição anterior a 10/08/2009, ufesp não encontrada: ',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }),
        this.buscarUfespCargo(consulta.CHAPA).catch((error) => {
          throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
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
      const itemsPerPage = params.limit || 500;
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

      let consulta = await Promise.all(
        result.map(async (item: any) => {
          // Calcular valores de extorno e devolução
          const { VL_DEVOLUCAO, VL_EXTORNO } = calcularValores(item.SQE_VLSAQUE, item.SQE_VLPREST);

          // Busca documentos
          let docs: docsEntity[] | null = null;
          try {
            docs = await this.documentosService.findBySQE_ID_CODIGO(item.SQE_ID_CODIGO);
          } catch (error) {}

          // Obter status
          const STATUS_PREST = RetonaPrestacaoStatus(
            item.SQE_EFETIVO,
            item.SQE_TIPOSAQUE,
            item.PRA_ATIVO,
            item.SQE_DTPREST,
            item.SQE_VLPREST,
          );

          const STATUS_SAQUE = RetornaSaquePendentes(
            item.SQE_EFETIVO,
            item.SQE_TIPOSAQUE,
            item.PRA_ATIVO,
          );

          //Obter status do saque

          // Retorna a estrutura do objeto
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
            SQE_EFETIVO: item.SQE_EFETIVO,
            PRA_ATIVO: item.PRA_ATIVO,
            SQE_TIPOSAQUE: item.SQE_TIPOSAQUE === 'N' ? 'Diária' : '',
            STATUS_SAQUE,
            STATUS_PREST,           
            ID_DOC: docs && docs[0] ? docs[0].ID_DOC : null,
            ORIGINAL_NAME: docs && docs[0] ? docs[0].ORIGINAL_NAME : null,
          });
        }),
      );

      
      // Filtros adicionais
      if (params.STATUS_PREST) {
        consulta = consulta.filter((item: any) => item.STATUS_PREST === params.STATUS_PREST);
      }

      if (params.STATUS_SAQUE) {
        consulta = consulta.filter(
          (item: any) => item.STATUS_SAQUE && item.STATUS_SAQUE === params.STATUS_SAQUE
        );
      }

      return {
        data: consulta,
        total: totalCount,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findPrestacao(params: FindParamsSaque): Promise<PrestacaoDto> {
    let destino: Destino | null = null;
    try {
      const consulta = await this.buscarConsulta(params.SQE_ID_CODIGO);

      if (!consulta) {
        throw new HttpException(
          `Saque com codigo: ${params.SQE_ID_CODIGO} não encontrado`,
          HttpStatus.NOT_FOUND,
        );
      }

      const { itinerario, UFESP, UFESPcargoValor } = await this.buscarDadosNecessarios(consulta);

      try {
        destino = verificarDestino(consulta.MUN_ID_CODIGO) as Destino;
      } catch (error) {
        throw new HttpException('Destino não encontrado', HttpStatus.NOT_FOUND);
      }

      const STATUS = RetonaPrestacaoStatus(
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
  async solicitarSaque(params: SolitarDto, user: AuthUserDto): Promise<any> {
    try {
      if (!params.reqIdCodigo) {
        throw new HttpException('Requisição não informada', HttpStatus.INTERNAL_SERVER_ERROR);
      }
      const valorSaque = params.diariaIntegral + params.diariaParcial;
      if (valorSaque <= 0) {
        throw new HttpException(
          'Valor do Saque não pode ser Zero',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      const funcionario = await this.funcsalarioService.findByCodigo(params.chapa);

      const prazo = await this.saqueRepository.query(selecionaUltimoPrazo, [
        funcionario.regIdCodigo,
      ]);

      const where = `and A.Chapa =:NChapa and A.RRE_ID_CODIGO=:NREQ and A.TDE_ID_CODIGO=:TIPODESP AND A.IRR_RECURSO='S'`;
      const ItensReqRec = await this.saqueRepository.query(`${SelecionaItensRecurso} ${where}`, [
        params.chapa,
        prazo[0].RRE_ID_CODIGO,
        7,
      ]);

      let itemRecurso: itensreqrecEntity;

      if (ItensReqRec.length == 0) {
        const PAR1 = null; //ITE_ID_CODIGO
        const PAR2 = prazo[0].RRE_ID_CODIGO; //RRE_ID_CODIGO
        const PAR3 = prazo[0].DIR_ID_CODIGO; //DIR_ID_CODIGO
        const PAR4 = null; //ORI_ID_CODIGO
        const PAR5 = null; //FPA_ID_CODIGO
        const PAR6 = '7'; //STS_ID_CODIGO = 7 - Diária
        const PAR7 = '7'; //TDE_ID_CODIGO
        const PAR8 = params.chapa; //CHAPA
        const PAR9 = 1; //CODCOLIGADA
        const PAR10 = '0'; //IRR_VALOR_SOL
        const PAR11 = DataUtils.formatarDataAtualString(); //IRR_DATA_SOL
        const PAR12 = null; //IRR_VALOR_CONC
        const PAR13 = DataUtils.formatarDataAtualString(); //IRR_DATA_CONC
        const PAR14 = ''; //IRR_VALOR_PREST
        const PAR15 = ''; //IRR_DATA_PREST
        const PAR16 = ''; //IRR_JUSTIFICA
        const PAR17 = 'S'; //IRR_RECURSO
        const PAR18 = null; //IRR_VALOR_AUT
        const PAR19 = null; //IRR_VLRECEBIDO
        const PAR20 = null; //IRR_SALDO
        const PAR21 = null; //IRR_COMPLEMENTO
        const PAR22 = null; //IRR_VLREGIONAL
        const IDITE = { type: oraccledb.NUMBER, dir: oraccledb.BIND_OUT };

        const req = await this.saqueRepository.query(
          `
          BEGIN
            FINANCEIRO.INS_S009_ITENSREQREC(:PR1, :PR2, :PR3, :PR4, :PR5, :PR6 , :PR7, :PR8, :PR9, :PR10, :PR11, :PR12, :PR13, :PR14, :PR15, :PR16, :PR17, :PR18, :PR19, :PR20, :PR21, :PR22, :IDITE);
          END;
          `,
          [PAR1, PAR2, PAR3, PAR4, PAR5, PAR6, PAR7, PAR8, PAR9, PAR10, PAR11, PAR12, PAR13, PAR14, PAR15, PAR16, PAR17, PAR18, PAR19, PAR20, PAR21, PAR22, IDITE], //prettier-ignore
        );

        itemRecurso = await this.itensreqrecService.findOne(req[0]);

        const where = `
        And A.DIR_ID_CODIGO=:CODDIR
        And A.RRE_ID_CODIGO=:CODREQ
        And A.TDE_ID_CODIGO=:CODDESP
        `;

        const agrupamento = await this.saqueRepository.query(`${SelecionaAgrupaRec} ${where}`, [
          itemRecurso.DIR_ID_CODIGO,
          itemRecurso.RRE_ID_CODIGO,
          itemRecurso.TDE_ID_CODIGO,
        ]);

        if (agrupamento.length == 0) {
          const PAR1 = null; //AGS_ID_CODIGO
          const PAR2 = itemRecurso.RRE_ID_CODIGO; //RRE_ID_CODIGO
          const PAR3 = itemRecurso.DIR_ID_CODIGO; //DIR_ID_CODIGO
          const PAR4 = itemRecurso.TDE_ID_CODIGO; //TDE_ID_CODIGO
          const PAR5 = '7'; //STS_ID_CODIGO
          const PAR6 = 0; //AGS_VALOR_SOLIC
          const PAR7 = 0; //AGS_VALOR_CONC
          const PAR8 = 0; //AGS_VALOR_PREST
          const PAR9 = DataUtils.formatarDataAtualString(); //AGS_OBSERVA
          const PAR10 = 'S'; //AGS_RECURSO

          await this.saqueRepository.query(
            `
        BEGIN
          FINANCEIRO.INS_S009_AGRUPARECURSO(:PR1, :PR2, :PR3, :PR4, :PR5, :PR6 , :PR7, :PR8, :PR9, :PR10);
        END;
        `,
            [PAR1, PAR2, PAR3, PAR4, PAR5, PAR6, PAR7, PAR8, PAR9, PAR10], //prettier-ignore
          );
        }
      } else {
        itemRecurso = ItensReqRec[0];
      }

      const requisicao = await this.reqtransService.findOne(params.reqIdCodigo);

      const PAR1 = 'N'; //SQE_TIPOSAQUE
      const PAR2 = 'S'; //RECURSO SOLICITADO
      const PAR3 = '7'; //tipo de despesa
      const PAR4 = itemRecurso.ITE_ID_CODIGO; //ITE_ID_CODIGO
      const PAR5 = itemRecurso.RRE_ID_CODIGO; //RRE_ID_CODIGO
      const PAR6 = itemRecurso.DIR_ID_CODIGO; //DIR_ID_CODIGO
      const PAR7 = ''; //SQE_VLPREST
      const PAR8 = null; //SQE_DTPREST
      const PAR9 = valorSaque; //SQE_VLSAQUE
      const PAR10 = 'N'; //SQE_TIPOSAQUE
      const PAR11 = 'T'; //SQE_EFETIVO
      const PAR12 = 'N'; //SQE_TERCEIRO
      const PAR13 = null; //PES_ID_CODIGO
      const PAR14 = null; //PES_PESSOA
      const PAR15 = 47; //STS_ID_CODIGO
      const PAR16 = user.chapa; //SQE_USUARIO
      const PAR17 = params.reqIdCodigo; //REQ_ID_CODIGO

      const PAR18 = null; //RNU_DTINICIO
      const PAR19 = null; //RNU_HORAINICIO
      const PAR20 = null; //RNU_DTFIM
      const PAR21 = null; //RNU_HORAFIM
      const PAR22 = requisicao.REQ_INTEGRAL;
      const PAR23 = requisicao.REQ_PARCIAL;
      const PAR24 = null; //RNU_PARREAL
      const PAR25 = null; //RNU_PARREAL

      const PAR26 = requisicao.REQ_PACOTE === '0' ? 'S' : 'N'; //REQ_PACOTE
      const PAR27 = requisicao.REQ_GOVERNADOR; //REQ_GOVERNADOR
      const PAR28 = ''; //RRE_JUSTIFICATIVA
      const PAR29 = 'SAQUE AGUARDANDO TRANSFERENCIA'; //S001_REQUISICAO.REQ_STATUS
      const PAR30 = null; //RNU_VLINTEGRAL
      const PAR31 = null; //RNU_VLPARCIAL
      const PAR32 = null; //RNU_VLBASE
      const ID = { type: oraccledb.NUMBER, dir: oraccledb.BIND_OUT };

      const insSaque = await this.saqueRepository.query(
        `
        BEGIN
          FINANCEIRO.INS_S009_SAQUE(
          :PR1, :PR2, :PR3, :PR4, :PR5, :PR6 , :PR7, :PR8, :PR9, :PR10, :PR11, :PR12,
          :PR13, :PR14, :PR15, :PR16, :PR17, :PR18, :PR19, :PR20, :PR21, :PR22,
          :PR23, :PR24, :PR25, :PR26, :PR27, :PR28, :PR29, :PR30, :PR31, :PR32, :ID);         
        END;
        `,
        [PAR1, PAR2, PAR3, PAR4, PAR5, PAR6, PAR7, PAR8, PAR9, PAR10, PAR11, PAR12,
         PAR13, PAR14, PAR15, PAR16, PAR17, PAR18, PAR19, PAR20, PAR21, PAR22,
         PAR23, PAR24, PAR25, PAR26, PAR27,PAR28,PAR29,PAR30,PAR31,PAR32,ID], //prettier-ignore
      );

      return { sqeIdCodigo: insSaque[0] };

      // const MD = await this.motivoDiaria.findOne(params.chapa, params.reqIdCodigo);

      // const newId = await this.lastId();

      // const saqueDto = new SaqueDto({
      //   sqeIdCodigo: newId,
      //   iteIdCodigo: MD.ITE_ID_CODIGO,
      //   rreIdCodigo: MD.RRE_ID_CODIGO,
      //   dirIdCodigo: MD.DIR_ID_CODIGO,
      //   fpaIdCodigo: 1,
      //   stsIdCodigo: 1,
      //   sqeDtSaque: null,
      //   sqeVlPrest: null,
      //   sqeDtPrest: null,
      //   sqeVlSaque: MD.MDI_VALOR,
      //   sqeTipoSaque: PAR10,
      //   sqeEfetivo: PAR2,
      //   sqeDtPedido: DataUtils.formatarDataAtual(),
      //   sqeLote: null,
      //   sqeAnoLote: null,
      //   sqeTerceiro: null,
      //   pesIdCodigo: null,
      //   pesPessoa: null,
      //   sqeUsuario: null,
      //   sqeEmpenho: null,
      //   sqeListaSiafem: null,
      // });

      // try {
      //  // await this.saqueRepository.insert(saqueDto);
      // } catch (error) {
      //   throw new HttpException(
      //     `Erro ao inserir saque: ${error.message}`,
      //     HttpStatus.INTERNAL_SERVER_ERROR,
      //   );
      // }

      // const lastINumerario = await this.reqnumerarioService.findLast();

      // try {
      //   const lastIdNum = lastINumerario;
      //   const newIdNum = lastIdNum + 1;
      //   const numerario = new ReqnumerarioDto({
      //     RNU_ID_CODIGO: newIdNum,
      //     SQE_ID_CODIGO: newId,
      //     REQ_ID_CODIGO: params.reqIdCodigo,
      //     ITE_ID_CODIGO: MD.ITE_ID_CODIGO,
      //     RRE_ID_CODIGO: MD.RRE_ID_CODIGO,
      //     DIR_ID_CODIGO: MD.DIR_ID_CODIGO,
      //     RNU_DTINICIO: MD.REQ_DTSAIDA,
      //     RNU_HORAINICIO: MD.REQ_HSAIDA,
      //     RNU_DTFIM: MD.REQ_DTRET,
      //     RNU_HORAFIM: MD.REQ_HRET,
      //     RNU_INTPREV: String(MD.REQ_INTEGRAL) || null,
      //     RNU_PARPREV: String(MD.REQ_PARCIAL) || null,
      //     RNU_INTREAL: null,
      //     RNU_PARREAL: null,
      //     RNU_MOTIVO: MD.REQ_MOTIVO,
      //     RNU_PACOTE: MD.REQ_PACOTE,
      //     RNU_GOVERNADOR: MD.REQ_GOVERNADOR,
      //     RNU_VLINTEGRAL: params.diariaIntegral,
      //     RNU_VLPARCIAL: params.diariaParcial,
      //     RNU_VLBASE: params.diariaBase,
      //   });
      //   await this.reqnumerarioService.create(numerario);
      // } catch (error) {
      //   throw new HttpException(
      //     `Erro ao inserir numerário: ${error.message}`,
      //     HttpStatus.INTERNAL_SERVER_ERROR,
      //   );
      // }

      // // /*JUSTIFICATIVA*/
      // let rresaque = null;
      // if (PAR2 === 'S') {
      //   rresaque = newId;
      // }
      // await this.reembolsoService.inseriReembolso({
      //   RRE_ID_CODIGO: MD.RRE_ID_CODIGO,
      //   DIR_ID_CODIGO: MD.DIR_ID_CODIGO,
      //   ITE_ID_CODIGO: MD.ITE_ID_CODIGO,
      //   SQE_ID_CODIGO: newId,
      //   RRE_JUSTIFICATIVA: MD.REQ_MOTIVO,
      //   RRE_SAQUE: rresaque,
      // });

      // //   /*REQUISIÇÃO DE TRANSPORTE*/
      // if (PAR10 === 'N' && PAR3 === '7' && PAR2 === 'S') {
      //   await this.reqtransService.updateStatus(params.reqIdCodigo, 'RECURSO SOLICITADO');
      // }

      // return { sqeIdCodigo: newId };
    } catch (error) {
      console.error(error);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
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

  async updateDataPrestacao(sqeIdCodigo: number, sqeDtPrest: string) {
    const saque = await this.findOne(sqeIdCodigo);
    this.saqueRepository.merge(saque, { sqeDtPrest });
    return await this.saqueRepository.save(saque);
  }

  async selecionaSaquePendentes(params: ParamsPendente): Promise<any> {
    try {
      let where = '';
      let paramsWhere = [];

      if (params.RRE_ID_CODIGO) {
        where = SelecionaPendencia;
        paramsWhere = [params.CHAPA, params.RRE_ID_CODIGO];
      } else {
        where = SelecionaPendencias;
        paramsWhere = [params.CHAPA];
      }
      const result = await this.saqueRepository.query(
        `${selecionaSaquePendente} ${where}`,
        paramsWhere,
      );
      if (result.length > 0) {
        return result;
      } else {
        throw new HttpException('Nenhum saque pendente encontrado', HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException('Ocorreu erro ao buscar pendentes', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async cancelarSaque(params: ParamsCancela) {
    try {
      let grava = 0;
      let gsaque = 0;
      const saque = await this.findOne(params.SQE_ID_CODIGO);

      if (saque.sqeEfetivo === 'S' || saque.sqeEfetivo === 'E' || saque.sqeEfetivo === 'P') {
        throw new HttpException(
          'O Saque efetuado pelo Financeiro, não permitido exclusão!',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (saque.sqeEfetivo === 'D') {
        gsaque = 1;
        const itens = await this.itensreqrecService.findOne(saque.iteIdCodigo);
        const updateValor = itens.IRR_VALOR_PREST - saque.sqeVlPrest;
        itens.IRR_VALOR_PREST = updateValor;
        try {
          await this.itensreqrecService.update(itens);
        } catch (error) {
          grava = 1;
        }
      }

      const PR1 = saque.sqeIdCodigo;
      const PR2 = saque.sqeEfetivo;
      const PR3 = saque.sqeTipoSaque;
      const PR4 = saque.sqeVlPrest;
      const PR5 = saque.sqeDtPrest;
      const PR6 = saque.sqeUsuario;

      if (grava === 0) {
        try {
          await this.saqueRepository.query(
            `
            BEGIN
              FINANCEIRO.DELCASC_S009_SAQUE(:PR1, :PR2, :PR3, :PR4, :PR5, :PR6);
            END;
            `,
            [PR1, PR2, PR3, PR4, PR5, PR6],
          );
        } catch (error) {
          grava = 1;
        }
      }

      if (grava === 0) {
        return { message: 'Exclusão realizada com Sucesso!' };
      }
      if (grava === 1) {
        if (gsaque === 1) {
          return { message: 'Problema na operação, chame o Suporte Técnico!' };
        }
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
