import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  FindParamsSaque,
  SaqueDto,
  PrestacaoDto,
  SolitarDto,
  DateTimeParams,
  returnSaqueDto,
  buscarSaqueDto,
  ParamsPendente,
  ParamsCancela,
  InsSaqueDto,
  ParamsAltera,
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
import { documentosService } from '../documentos/documento.service';
import { docsEntity } from 'src/database/db_mysql/entities/docs.entity';
import { selecionaSaquePendente } from '../util/selects/saques';

import {
  SelecionaAgrupaRec,
  SelecionaItensRecurso,
  selecionaUltimoPrazo,
} from '../util/selects/itensRecurso';
import { itensreqrecEntity } from '../database/db_oracle/entities/itensreqrec.entity';

import { AuthUserDto } from '../auth/use.auth.Dto';
import { ReqnumerarioDto } from '../reqnumerario/reqnumerarioDto';
import { Role } from '../auth/role.enum';
import { selecionaDocPContasNum, selecionaPrestPendente } from '../util/selects/prestacao';
import * as oraccledb from 'oracledb';
import { PcontasService } from '../pcontas/pcontas.service';
import { PcontasNumService } from '../pcontasnum/pcontasnum.service';
import { ndocumentoService } from '../ndocumento/ndocumento.service';
import { ndocumentoEntity } from '../database/db_oracle/entities/ndocumento.entity';
import { verificaAutorizacao } from '../util/permissao/permissao';
import { permissaoFindAll } from '../util/permissao/permissao';
import { permissaoCargo } from '../util/enums/cargo';

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
    private pcontasService: PcontasService,
    private pcontasnumService: PcontasNumService,
    private ndocumentoService: ndocumentoService,
  ) { }

  private async buscarConsulta(sqeIdCodigo: number): Promise<any> {
    const saque = await this.findOne(sqeIdCodigo);
    const itensreq = await this.itensreqrecService.findOne(saque.iteIdCodigo);
    const reqnumerario = await this.reqnumerarioService.findOne(saque.iteIdCodigo);
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
      MUN_CIDADE: reqtrans?.NME_MUNIC,
      NME_MUNIC: reqtrans?.NME_MUNIC,
      TRA_DESCRICAO: reqtrans?.TRA_DESCRICAO,
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
    try {
      const { ufeValor } = await this.ufespService.findValueByDate(dataSaida);
      return ufeValor;
    } catch (error) {
      console.error('Erro ao buscar ufesp:', error);
      return null;
    }
  }

  private async buscarUfespCargo(chapa: string): Promise<number> {
    const funcsalario = await this.funcsalarioService.findByCodigo(chapa);

    if (!funcsalario) {
      throw new HttpException('Funcionário não encontrado', HttpStatus.NOT_FOUND);
    }

    const UFESPcargo = await this.despesaDiaria.findOne(funcsalario.CARGO);

    return Number(UFESPcargo?.DTD_VALOR_MAX);
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
          console.log(error);
          throw new HttpException('Erro ao buscar itinerário: ', HttpStatus.INTERNAL_SERVER_ERROR);
        }),

        this.buscarUfesp(consulta.REQ_DTSAIDA).catch((error) => {
          console.log(error);
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
      throw error instanceof HttpException
        ? error
        : new HttpException(
          'Erro ao buscar dados necessários para prestação',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
    }
  }

  //BUSCAR TODOS OS SAQUES

  async findAll(params: FindParamsSaque, user: AuthUserDto): Promise<any> {
    try {
      const chapa = user.chapa;
      const orderByField = params.orderBy || 'a.SQE_DTPEDIDO';
      const orderDirection = params.orderDirection || 'ASC';
      const page = params.page || 1;
      const itemsPerPage = params.limit || 1000;
      const offset = (page - 1) * itemsPerPage;

      const filterConditions: string[] = [];
      const filterValues: any[] = [];

      const per = permissaoFindAll(user.permissao);
      if (per) {
        filterConditions.push(
          `SUBSTR(b.CODSECAO, 0, ${per}) = '${user.codsecao.substring(0, per)}'`,
        );
      } else {
        filterConditions.push('b.CHAPA = :chapa');
        filterValues.push(chapa);
      }

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
      if (params.SQE_EFETIVO) {
        filterConditions.push('a.SQE_EFETIVO = :SQE_EFETIVO');
        filterValues.push(params.SQE_EFETIVO);
      }

      const result = await this.saqueRepository.query(
        querySaque(filterConditions, orderByField, orderDirection, true),
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
          if (Number(params?.agreement) === 0) {
            try {
              docs = await this.documentosService.findBySQE_ID_CODIGO(item.SQE_ID_CODIGO);
            } catch (error) {
              console.log(error);
            }
          }
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
            CODSECAO: item.CODSECAO,
            REQ_ID_CODIGO: item.REQ_ID_CODIGO,
            TDE_DESCRICAO: item.TDE_DESCRICAO,
            STS_DESCRICAO: item.STS_DESCRICAO,
            REQ_DTREQ: DataUtils.converterParaData(item.REQ_DTREQ),
            REQ_STATUS: item.REQ_STATUS,
            CHAPA: item.CHAPA,
            STS_SAQUE_CONVENIADO: item.STS_SAQUE_CONVENIADO,
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

      if (params.startDate && params.endDate) {
        //FILTRAR ENTRE DATAS O ARRAY DE OBJETO CONSULTA
        const { startDate, endDate } = formatDates(params.startDate, params.endDate) || {};
        const filtered = consulta.filter((item) => {
          const date = DataUtils.converterStringParaData(item.SQE_DTPEDIDO);
          return (
            date &&
            date >= DataUtils.converterStringParaData(startDate) &&
            date <= DataUtils.converterStringParaData(endDate)
          );
        });

        consulta = filtered;
      }

      // Filtros adicionais
      if (params.STATUS_PREST) {
        consulta = consulta.filter((item: any) => item.STATUS_PREST === params.STATUS_PREST);
      }

      if (params.STATUS_SAQUE) {
        consulta = consulta.filter(
          (item: any) => item.STATUS_SAQUE && item.STATUS_SAQUE === params.STATUS_SAQUE,
        );
      }

      if (params.agreement) {
          consulta = consulta.filter((item: any) => item.STS_SAQUE_CONVENIADO == params.agreement)
      }

      if (params.NOME) {
        const nomeBusca = params.NOME.toUpperCase();
        consulta = consulta.filter(
          (item: any) => item.NOME?.toUpperCase().includes(nomeBusca),
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

  //buscar prestação de conta

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

      if (!itinerario && consulta.TRA_ID_CODIGO === 1) {
        throw new HttpException(
          'Meio de transporte veiculo sem itinerário!!!',
          HttpStatus.NOT_FOUND,
        );
      }

      try {
        destino = verificarDestino(consulta.MUN_ID_CODIGO) as Destino;
      } catch (error) {
        console.log(error);
        throw new HttpException('Destino não encontrado', HttpStatus.NOT_FOUND);
      }

      const STATUS = RetonaPrestacaoStatus(
        consulta.SQE_EFETIVO,
        consulta.SQE_TIPOSAQUE,
        consulta.PRA_ATIVO,
        consulta.SQE_DTPREST,
        consulta.SQE_VLPREST,
      );

      const { calcDiaraInial, calcDiaraRetorn, diariaIntegral, diaraPorc } =
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
      } catch (error) {
        console.log(error);
      }

      // Tenta encontrar o reembolso sem quebrar se não encontrar
      try {
        const reembolso = await this.reembolsoService.findone(params.SQE_ID_CODIGO);
        justificativa = reembolso?.RRE_JUSTIFICATIVA || justificativa;
      } catch (error) {
        console.log(error);
      }

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

  async solicitarSaque(params: SolitarDto, user: AuthUserDto): Promise<any> {
    let Rg_Reembolsar = 1;
    let Rg_TipoSaque = 1;
    let TipoDespesa = '7';
    let semrec = 1;
    let ReembCompl = 1;
    let Rg_Complemento = 1;
    let terceiro = 'N';

    if (user.chapa != params.chapa && !user.roles.includes(Role.SUPERVISOR)) {
      throw new HttpException('Usuário não autorizado', HttpStatus.UNAUTHORIZED);
    }

    if (user.chapa != params.chapa && user.roles.includes(Role.SUPERVISOR)) {
      terceiro = 'S';
    }

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
        funcionario.REG_ID_CODIGO,
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
        const PAR6 = TipoDespesa; //STS_ID_CODIGO = 7 - Diária
        const PAR7 = TipoDespesa; //TDE_ID_CODIGO
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
          const PAR5 = TipoDespesa; //STS_ID_CODIGO
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

      const ID = { type: oraccledb.NUMBER, dir: oraccledb.BIND_OUT };

      const parametros: InsSaqueDto = new InsSaqueDto();

      if (Rg_Reembolsar === 0) {
        parametros.PAR1 = 'S'; // SQE_TIPOSAQUE
      } else {
        parametros.PAR1 = 'N';
      }

      if (semrec >= 1) {
        parametros.PAR2 = 'S'; // RECURSO SOLICITADO
      } else {
        parametros.PAR2 = 'N';
      }

      parametros.PAR3 = TipoDespesa; // tipo de despesa
      parametros.PAR4 = itemRecurso.ITE_ID_CODIGO; // ITE_ID_CODIGO
      parametros.PAR5 = itemRecurso.RRE_ID_CODIGO; // RRE_ID_CODIGO
      parametros.PAR6 = itemRecurso.DIR_ID_CODIGO; // DIR_ID_CODIGO

      if (Rg_Reembolsar === 0 && Rg_TipoSaque === 1 && TipoDespesa === '7') {
        parametros.PAR7 = valorSaque.toString(); // SQE_VLPREST
        parametros.PAR8 = DataUtils.formatarDataAtualString(); // SQE_DTPREST
        parametros.PAR9 = valorSaque; // SQE_VLSAQUE
        parametros.PAR10 = 'N'; // SQE_TIPOSAQUE
        if (semrec >= 1) {
          parametros.PAR11 = 'F'; // /TRANSFERENCIA/Reembolso
          parametros.PAR15 = 45; // STS_ID_CODIGO
        } else {
          parametros.PAR11 = 'D'; // REEMBOLSO
          parametros.PAR15 = 32; // STS_ID_CODIGO
        }
      } else {
        parametros.PAR7 = ''; // SQE_VLPREST
        parametros.PAR8 = null; // SQE_DTPREST
        parametros.PAR9 = valorSaque; // SQE_VLSAQUE
        if (Rg_TipoSaque === 0) {
          parametros.PAR10 = 'R'; // SQE_TIPOSAQUE
        } else if (Rg_TipoSaque === 1) {
          parametros.PAR10 = 'N'; // SQE_TIPOSAQUE
        }
        if (Rg_Reembolsar === 0 && semrec >= 1 && TipoDespesa === '7') {
          parametros.PAR11 = 'K'; // /TRANSFERENCIA/Reembolso
          parametros.PAR15 = 61; // STS_ID_CODIGO
        } else if (Rg_Reembolsar === 0 && semrec >= 1 && ReembCompl === 1) {
          parametros.PAR11 = 'B'; //Aguardando Transferência para Complemento-Reembolso'
          parametros.PAR15 = 51; // STS_ID_CODIGO
        } else if (Rg_Reembolsar === 0 && semrec >= 1) {
          parametros.PAR11 = 'F'; //Aguardando Transferência para Reembolso'
          parametros.PAR15 = 45; // STS_ID_CODIGO
        } else if (Rg_Reembolsar === 0) {
          parametros.PAR11 = 'R'; //Aguardando documentos/relatório para efetuar Pagamento
          parametros.PAR15 = 29; // STS_ID_CODIGO
        } else if (Rg_Complemento === 1 && semrec >= 1) {
          parametros.PAR11 = 'T'; // Aguardando Transferência para saque
          parametros.PAR15 = 47; // STS_ID_CODIGO
        } else if (Rg_Complemento === 1) {
          parametros.PAR11 = 'A'; // Aguardado Saque
          parametros.PAR15 = 25; // STS_ID_CODIGO
        } else if (Rg_Complemento === 0 && semrec >= 1) {
          parametros.PAR11 = 'V'; //Aguardando Transferência para Complemento
          parametros.PAR15 = 46; // STS_ID_CODIGO
        } else if (Rg_Complemento === 0) {
          parametros.PAR11 = 'C'; //Viagem-Complemento
          parametros.PAR15 = 27; // STS_ID_CODIGO
        }

        //PAGAMENTO PARA TERCEIRO
        parametros.PAR12 = terceiro;
        parametros.PAR13 = null; // PES_PESSOA
        parametros.PAR14 = null; // PES_ID_CODIGO
        parametros.PAR16 = user.chapa; // SQE_USUARIO

        //**** REQUISIÇÃO DE NUMERARIO
        if (Rg_TipoSaque === 1) {
          parametros.PAR17 = params.reqIdCodigo; // REQ_ID_CODIGO
          if (Rg_Reembolsar === 0 && Rg_TipoSaque === 1 && TipoDespesa === '7') {
            if (requisicao.TRA_ID_CODIGO !== 1) {
              parametros.PAR18 = requisicao.REQ_DTSAIDA; // RNU_DTINICIO
              parametros.PAR19 = requisicao.REQ_HSAIDA; // RNU_HORAINICIO
              parametros.PAR20 = requisicao.REQ_DTRET; // RNU_DTFIM
              parametros.PAR21 = requisicao.REQ_HRET; // RNU_HORAFIM
            } else {
              // parametros.PAR18 = requisicao.REQ_DTSAIDA; // RNU_DTINICIO
              // parametros.PAR19 = requisicao.REQ_HSAIDA; // RNU_HORAINICIO
              // parametros.PAR20 = requisicao.REQ_DTRET; // RNU_DTFIM
              // parametros.PAR21 = requisicao.REQ_HRET; // RNU_HORAFIM
            }
            parametros.PAR22 = requisicao.REQ_INTEGRAL; // RNU_VLINTEGRAL
            parametros.PAR23 = requisicao.REQ_PARCIAL; // RNU_VLPARCIAL
            parametros.PAR24 = requisicao.REQ_INTEGRAL; // RNU_VLBASE
            parametros.PAR25 = requisicao.REQ_PARCIAL; // RNU_VLBASE
          } else {
            parametros.PAR18 = null; // RNU_DTINICIO
            parametros.PAR19 = null; // RNU_HORAINICIO
            parametros.PAR20 = null; // RNU_DTFIM
            parametros.PAR21 = null; // RNU_HORAFIM
            parametros.PAR22 = requisicao.REQ_INTEGRAL; // RNU_VLINTEGRAL
            parametros.PAR23 = requisicao.REQ_PARCIAL; // RNU_VLPARCIAL
            parametros.PAR24 = null; // RNU_VLBASE
            parametros.PAR25 = null; // RNU_VLBASE
          }
          //pacote
          parametros.PAR26 = requisicao.REQ_PACOTE === '0' ? 'S' : 'N'; // REQ_PACOTE
          parametros.PAR27 = requisicao.REQ_GOVERNADOR; // REQ_GOVERNADOR
        } else {
          parametros.PAR17 = null; // REQ_ID_CODIGO
          parametros.PAR18 = null; // RNU_DTINICIO
          parametros.PAR19 = null; // RNU_HORAINICIO
          parametros.PAR20 = null; // RNU_DTFIM
          parametros.PAR21 = null; // RNU_HORAFIM
          parametros.PAR22 = null; // RNU_VLINTEGRAL
          parametros.PAR23 = null; // RNU_VLPARCIAL
          parametros.PAR24 = null; // RNU_VLBASE
          parametros.PAR25 = null; // RNU_VLBASE
          parametros.PAR26 = null; // REQ_PACOTE
          parametros.PAR27 = null; // REQ_GOVERNADOR
        }
        parametros.PAR28 = ''; // RRE_JUSTIFICATIVA
        parametros.PAR29 = 'SAQUE AGUARDANDO TRANSFERENCIA'; // S001_REQUISICAO.REQ_STATUS
        parametros.PAR30 = null; // RNU_VLINTEGRAL
        parametros.PAR31 = null; // RNU_VLPARCIAL
        parametros.PAR32 = null; // RNU_VLBASE
        parametros.ID = ID;
      }

      const newSaque = {
        iteIdCodigo: parametros.PAR4,
        rreIdCodigo: parametros.PAR5,
        dirIdCodigo: parametros.PAR6,
        sqeDtSaque: null,
        sqeVlPrest: parametros.PAR7,
        fpaIdCodigo: null,
        sqeDtPrest: parametros.PAR8,
        sqeVlSaque: parametros.PAR9,
        sqeTipoSaque: parametros.PAR10,
        sqeEfetivo: parametros.PAR11,
        sqeDtPedido: DataUtils.formatarDataAtualString(),
        sqeLote: null,
        sqeAnoLote: null,
        stsIdCodigo: parametros.PAR15,
        sqeTerceiro: parametros.PAR12,
        pesIdCodigo: parametros.PAR13,
        pesPessoa: parametros.PAR14,
        sqeUsuario: parametros.PAR16,
        sqeEmpenho: null,
        sqeListaSiafem: null,
      };

      let resultSaque: any;

      try {
        resultSaque = await this.create(newSaque);
      } catch (error) {
        throw new HttpException(
          `Erro ao inserir saque: ${error.message}`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      if (parametros.PAR10 === 'N') {
        try {
          const numerario = new ReqnumerarioDto({
            SQE_ID_CODIGO: resultSaque.sqeIdCodigo,
            REQ_ID_CODIGO: requisicao.REQ_ID_CODIGO,
            ITE_ID_CODIGO: parametros.PAR4,
            RRE_ID_CODIGO: parametros.PAR5,
            DIR_ID_CODIGO: parametros.PAR6,
            RNU_DTINICIO: parametros.PAR18,
            RNU_HORAINICIO: parametros.PAR19,
            RNU_DTFIM: parametros.PAR20,
            RNU_HORAFIM: parametros.PAR21,
            RNU_INTPREV: String(parametros.PAR22) || '',
            RNU_PARPREV: String(parametros.PAR23) || '',
            RNU_INTREAL: String(parametros.PAR24) === 'null' ? '' : String(parametros.PAR24) || '',
            RNU_PARREAL: String(parametros.PAR25) === 'null' ? '' : String(parametros.PAR25) || '',
            RNU_MOTIVO: requisicao.REQ_MOTIVO,
            RNU_PACOTE: parametros.PAR26,
            RNU_GOVERNADOR: parametros.PAR27,
            RNU_VLINTEGRAL: 0,
            RNU_VLPARCIAL: 0,
            RNU_VLBASE: 0,
          });
          await this.reqnumerarioService.create(numerario);
        } catch (error) {
          console.log(error);
          throw new HttpException(
            `Erro ao inserir REQNUMERARIO. Numero do Saque: ${resultSaque.sqeIdCodigo}`,
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
      }

      // /*JUSTIFICATIVA*/
      let rresaque = null;
      if (parametros.PAR2 === 'S') {
        rresaque = resultSaque.sqeIdCodigo;
      }
      await this.reembolsoService.inseriReembolso({
        RRE_ID_CODIGO: parametros.PAR5,
        DIR_ID_CODIGO: parametros.PAR6,
        ITE_ID_CODIGO: parametros.PAR4,
        SQE_ID_CODIGO: resultSaque.sqeIdCodigo,
        RRE_JUSTIFICATIVA: '',
        RRE_SAQUE: rresaque,
      });

      //   /*REQUISIÇÃO DE TRANSPORTE*/
      if (parametros.PAR10 === 'N' && parametros.PAR3 === '7' && parametros.PAR2 === 'S') {
        await this.reqtransService.updateStatus(requisicao.REQ_ID_CODIGO, parametros.PAR29);
      }

      return { sqeIdCodigo: resultSaque.sqeIdCodigo };
    } catch (error) {
      console.error('Erro ao solicitar saque:', error);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async GravaSaqueReembolso(params: any, user: AuthUserDto): Promise<any> {
    try {
      let parametros: InsSaqueDto = new InsSaqueDto();

      if (!params.reqIdCodigo) {
        throw new HttpException('Requisição não informada', HttpStatus.INTERNAL_SERVER_ERROR);
      }
      const requisicao = await this.reqtransService.findOne(params.reqIdCodigo);
      const saque = await this.findOne(params.sqeIdCodigo);

      parametros.PAR1 = 'S';
      parametros.PAR2 = 'N';

      parametros.PAR3 = '7'; // TDE_ID_CODIGO
      parametros.PAR4 = saque.iteIdCodigo; // ITE_ID_CODIGO
      parametros.PAR5 = saque.rreIdCodigo; // RRE_ID_CODIGO
      parametros.PAR6 = saque.dirIdCodigo; // DIR_ID_CODIGO

      parametros.PAR7 = String(params.Ed_Diferenca); // SQE_VLSAQUE
      parametros.PAR8 = DataUtils.formatarDataAtualString();
      parametros.PAR9 = params.Ed_Diferenca; // SQE_VLPREST
      parametros.PAR10 = 'N'; // SQE_TIPOSAQUE
      parametros.PAR11 = 'B'; //TRANSFERENCIA/Reembolso/Complemento
      parametros.PAR15 = 51; // STS_ID_CODIGO
      parametros.PAR12 = 'N'; // SQE_TERCEIRO
      parametros.PAR13 = null; // PES_PESSOA
      parametros.PAR14 = null; // PES_ID_CODIGO
      parametros.PAR16 = user.login; // SQE_USUARIO
      parametros.PAR17 = params.reqIdCodigo;
      parametros.PAR18 = requisicao.REQ_DTSAIDA; // RNU_DTINICIO
      parametros.PAR19 = requisicao.REQ_HSAIDA; // RNU_HORAINICIO
      parametros.PAR20 = params.Ed_DtFim; // RNU_DTFIM
      parametros.PAR21 = params.Ed_HFim; // RNU_HORAFIM
      parametros.PAR22 = requisicao.REQ_INTEGRAL; // RNU_INTPREV
      parametros.PAR23 = requisicao.REQ_PARCIAL; // RNU_PARPREV
      parametros.PAR24 = params.Ed_RealI; // RNU_INTREAL
      parametros.PAR25 = params.Ed_RealP; // RNU_PARREAL
      if (requisicao.REQ_PACOTE === '0') {
        parametros.PAR26 = 'S';
      } else {
        parametros.PAR26 = 'N';
      }
      parametros.PAR27 = requisicao.REQ_GOVERNADOR;
      parametros.PAR28 = params.justificativa; // RRE_JUSTIFICATIVA
      parametros.PAR29 = null; // S001_REQUISICAO.REQ_STATUS
      parametros.PAR30 = params.Ed_TotDiariaI; // RNU_VLINTEGRAL
      parametros.PAR31 = params.Ed_TotDiariaP; // RNU_VLPARCIAL
      parametros.PAR32 = params.Ed_VlDiaria; // RNU_VLBASE

      const newSaque = {
        iteIdCodigo: parametros.PAR4,
        rreIdCodigo: parametros.PAR5,
        dirIdCodigo: parametros.PAR6,
        sqeDtSaque: null,
        sqeVlPrest: parametros.PAR7,
        fpaIdCodigo: null,
        sqeDtPrest: parametros.PAR8,
        sqeVlSaque: parametros.PAR9,
        sqeTipoSaque: parametros.PAR10,
        sqeEfetivo: parametros.PAR11,
        sqeDtPedido: DataUtils.formatarDataAtualString(),
        sqeLote: null,
        sqeAnoLote: null,
        stsIdCodigo: parametros.PAR15,
        sqeTerceiro: parametros.PAR12,
        pesIdCodigo: parametros.PAR13,
        pesPessoa: parametros.PAR14,
        sqeUsuario: parametros.PAR16,
        sqeEmpenho: null,
        sqeListaSiafem: null,
      };

      let resultSaque: any;
      try {
        resultSaque = await this.create(newSaque);
      } catch (error) {
        throw new HttpException(
          `Erro ao inserir saque: ${error.message}`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      const numerario = new ReqnumerarioDto({
        SQE_ID_CODIGO: resultSaque.sqeIdCodigo,
        REQ_ID_CODIGO: requisicao.REQ_ID_CODIGO,
        ITE_ID_CODIGO: parametros.PAR4,
        RRE_ID_CODIGO: parametros.PAR5,
        DIR_ID_CODIGO: parametros.PAR6,
        RNU_DTINICIO: parametros.PAR18,
        RNU_HORAINICIO: parametros.PAR19,
        RNU_DTFIM: parametros.PAR20,
        RNU_HORAFIM: parametros.PAR21,
        RNU_INTPREV: String(parametros.PAR22) || '',
        RNU_PARPREV: String(parametros.PAR23) || '',
        RNU_INTREAL: String(parametros.PAR24) === 'null' ? '' : String(parametros.PAR24) || '',
        RNU_PARREAL: String(parametros.PAR25) === 'null' ? '' : String(parametros.PAR25) || '',
        RNU_MOTIVO: requisicao.REQ_MOTIVO,
        RNU_PACOTE: parametros.PAR26,
        RNU_GOVERNADOR: parametros.PAR27,
        RNU_VLINTEGRAL: parametros.PAR30,
        RNU_VLPARCIAL: parametros.PAR31,
        RNU_VLBASE: parametros.PAR32,
      });
      await this.reqnumerarioService.create(numerario);

      //*** Grava Pretaçao de conta */

      const lastPc = await this.pcontasService.lastid();
      await this.pcontasService.create({
        PCO_ID_CODIGO: lastPc,
        PCO_TIPO: 'N',
        PCO_TOTDOC: 1,
      });

      await this.pcontasnumService.create({
        PCO_ID_CODIGO: lastPc,
        RNU_ID_CODIGO: resultSaque.sqeIdCodigo,
      });

      const lastNdoc = await this.ndocumentoService.lastId();

      const ndocumento = new ndocumentoEntity();
      ndocumento.NDO_ID_CODIGO = lastNdoc;
      ndocumento.PCO_ID_CODIGO = lastPc;
      ndocumento.PES_ID_CODIGO = 2227;
      ndocumento.PES_PESSOA = 'J';
      ndocumento.NDO_ID_NUMERO = 'S/DOCUM';
      ndocumento.NDO_DATA = DataUtils.criarDataFormatada();
      ndocumento.NDO_DTENTREGA = DataUtils.formatarDataAtualString();
      ndocumento.NDO_SERIE = '';
      ndocumento.NDO_TITULO = '';
      ndocumento.STS_ID_CODIGO = 12;

      await this.ndocumentoService.create(ndocumento);
      return { sqeIdCodigo: resultSaque.sqeIdCodigo };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOne(sqeIdCodigo: number): Promise<SaqueDto> {
    try {
      const result = await this.saqueRepository
        .createQueryBuilder('SaqueEntity')
        .select([
          'SaqueEntity.SQE_ID_CODIGO AS "sqeIdCodigo"',
          'SaqueEntity.ITE_ID_CODIGO AS "iteIdCodigo"',
          'SaqueEntity.RRE_ID_CODIGO AS "rreIdCodigo"',
          'SaqueEntity.DIR_ID_CODIGO AS "dirIdCodigo"',
          'SaqueEntity.FPA_ID_CODIGO AS "fpaIdCodigo"',
          'SaqueEntity.SQE_DTSAQUE AS "sqeDtSaque"',
          'SaqueEntity.SQE_VLPREST AS "sqeVlPrest"',
          'SaqueEntity.SQE_DTPREST AS "sqeDtPrest"',
          'SaqueEntity.SQE_VLSAQUE AS "sqeVlSaque"',
          'SaqueEntity.SQE_TIPOSAQUE AS "sqeTipoSaque"',
          'SaqueEntity.SQE_EFETIVO AS "sqeEfetivo"',
          'SaqueEntity.SQE_DTPEDIDO AS "sqeDtPedido"',
          'SaqueEntity.SQE_LOTE AS "sqeLote"',
          'SaqueEntity.SQE_ANOLOTE AS "sqeAnoLote"',
          'SaqueEntity.STS_ID_CODIGO AS "stsIdCodigo"',
          'SaqueEntity.SQE_TERCEIRO AS "sqeTerceiro"',
          'SaqueEntity.PES_ID_CODIGO AS "pesIdCodigo"',
          'SaqueEntity.PES_PESSOA AS "pesPessoa"',
          'SaqueEntity.SQE_USUARIO AS "sqeUsuario"',
          'SaqueEntity.SQE_EMPENHO AS "sqeEmpenho"',
          'SaqueEntity.SQE_LISTASIAFEM AS "sqeListaSiafem"',
        ])
        .where('SaqueEntity.sqeIdCodigo = :sqeIdCodigo', { sqeIdCodigo })
        .andWhere('ROWNUM = 1')
        .getRawOne();
      if (!result) {
        throw new Error('Saque não encontrado');
      }
      return result;
    } catch (error) {
      console.log(error);
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

  // RETORNA SAQUE PENDENTES
  async selecionaSaquePendentes(params: ParamsPendente, user: AuthUserDto): Promise<any> {
    try {
      let where = '';

      if (params.RRE_ID_CODIGO) {
        where = `and A.RRE_ID_CODIGO= ${params.RRE_ID_CODIGO}`;
      } else {
        where = `and A.Chapa = ${user.chapa}`;
      }

      const stringQuery = `${selecionaSaquePendente} ${where}`;

      const result = await this.saqueRepository.query(stringQuery);
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

  async cancelarSaque(params: ParamsCancela, user: AuthUserDto): Promise<any> {
    try {
      let grava = 0;
      let gsaque = 0;
      const saque = await this.findOne(params.SQE_ID_CODIGO);

      if (
        !(
          user.permissao === permissaoCargo.TESOURARIA_INTERIOR ||
          user.permissao === permissaoCargo.TESOURARIA_SEDE
        )
      ) {
        if (saque.sqeEfetivo === 'S' || saque.sqeEfetivo === 'E' || saque.sqeEfetivo === 'P') {
          throw new HttpException(
            'O Saque efetuado pelo Financeiro, não permitido exclusão!',
            HttpStatus.BAD_REQUEST,
          );
        }
      }

      const itens = await this.itensreqrecService.findOne(saque.iteIdCodigo);

      verificaAutorizacao(itens.CHAPA, user);
      const req = await this.reqnumerarioService.findOne(saque.sqeIdCodigo);

      const msg = `Saque:${saque.sqeIdCodigo}-Cancelado:${user.chapa}-${DataUtils.formatarDataAtualString()}-Req.Viagem:${req.REQ_ID_CODIGO}`;
      await this.itensreqrecService.update(itens);
      if (saque.sqeEfetivo === 'D') {
        gsaque = 1;
        const updateValor = itens.IRR_VALOR_PREST - saque.sqeVlPrest;
        itens.IRR_VALOR_PREST = updateValor;
        try {
          await this.itensreqrecService.update(itens);
        } catch (error) {
          console.error(error);
          grava = 1;
        }
      }

      const PR1 = saque.sqeIdCodigo;
      const PR2 = saque.sqeEfetivo;
      const PR3 = saque.sqeTipoSaque;
      const PR4 = saque.sqeVlPrest;
      const PR5 = saque.sqeDtPrest;
      const PR6 = msg;

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
          console.log(error);
          grava = 1;
        }
      }

      if (grava === 0) {
        return { message: 'Cancelada com Sucesso!' };
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

  async create(saqueDto: any): Promise<SaqueEntity> {
    try {
      const id = await this.lastId();
      saqueDto.sqeIdCodigo = id;
      const saque = new SaqueDto(saqueDto);
      return await this.saqueRepository.save(saque);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async verificaSaquePendente(dados: any): Promise<any> {
    try {
      let saque = 0;
      let where = '';
      const params = [];
      if (dados.CHAPA) {
        where = `AND B.CHAPA = :CHAPA`;
        params.push(dados.CHAPA);
      }
      if (dados.RRE_ID_CODIGO) {
        where = `AND A.RRE_ID_CODIGO = :RRE_ID_CODIGO`;
        params.push(dados.RRE_ID_CODIGO);
      }

      const qrPrestPendente = await this.saqueRepository.query(
        `${selecionaPrestPendente} ${where}`,
        params,
      );
      if (qrPrestPendente.length === 0) {
        const where = ` 
          WHERE ndo_dtentrega IS NULL
              AND tde_id_codigo = :TDE_ID_CODIGO
              AND chapa = :CHAPA`;
        const qrDocPContasNum = await this.saqueRepository.query(
          `${selecionaDocPContasNum} ${where}`,
          [dados.TDE_ID_CODIGO, dados.CHAPA],
        );

        if (qrDocPContasNum.length > 0) {
          if (!qrDocPContasNum[0].SQE_DTSAQUE) {
            saque = 8; // Documento de Reembolso
          } else {
            saque = 5; // Documento para ser entregue
          }
        } else {
          saque = 2; // Vazio
        }
      } else {
        saque = 3; //Prestação de conta pendente
      }
      return saque;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async ConfereReembolsoDoc(SQE_ID_CODIGO: number): Promise<any> {
    let documento = '';
    const where = `WHERE ndo_dtentrega IS NULL and sqe_id_codigo=:SAQUE`;
    const selecionaDocpcontasnum = await this.saqueRepository.query(
      `${selecionaDocPContasNum} ${where}`,
      [SQE_ID_CODIGO],
    );

    if (selecionaDocpcontasnum.length === 0) {
      documento = `Este é um saque para Reembolso,'${SQE_ID_CODIGO}', confirme o recebimento dos documentos!`;
    } else {
      documento = 'OK';
    }
    return { documento };
  }

  async AlteraValorPrestacao(params: ParamsAltera): Promise<SaqueEntity> {
    try {
      const saque = await this.findOne(params.SQE_ID_CODIGO);
      const sqeDtPrest = DataUtils.formatarDataAtualString();
      let sqeVlPrest: number = Number(params.SQE_VLPREST);
      let sqeEfetivo = saque.sqeEfetivo;

      if (saque.sqeVlPrest) {
        sqeVlPrest = Number(saque.sqeDtPrest + params.SQE_VLPREST);
      }
      // Verifica se o saque já foi efetivado; caso contrário, atualiza o status para 'Viagem-c/Lanc. Documentos'
      if (saque.sqeEfetivo !== 'S' && saque.sqeEfetivo !== 'E') {
        sqeEfetivo = 'D';
      }
      this.saqueRepository.merge(saque, { sqeDtPrest, sqeVlPrest, sqeEfetivo });
      this.saqueRepository.save(saque);
      return saque;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
