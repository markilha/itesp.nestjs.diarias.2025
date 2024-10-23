import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  FindParamsSaque,
  RetNumSaque,
  SaqueDto,
  PrestacaoDto,
  SolitarDto,
  InsS009SaqueDto,
} from './saque.dto';

import { SaqueEntity } from 'src/database/db_oracle/entities/saque.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DiariaviagemService } from 'src/diariaviagem/diariaviagem.service';
import { calcularValores } from 'src/util/calculo_extorno';
import { formatDates } from 'src/util/formatStarDateEndDate';
import { ItinirarioService } from 'src/itinirario/itinirario.service';
import {
  calcularDiariaIntegral,
  calcularDiariaParcial,
  calcularDiariaValores,
} from 'src/util/calculo_dia_retorno';
import { Destino } from 'src/util/diariaDto';
import { UfespService } from 'src/ufesp/ufesp.service';
import { DespesadiariaService } from 'src/despesadiaria/despesadiaria.service';
import { verificarDestino } from 'src/util/verificaDestino';
import { DataUtils } from 'src/util/DataUtils';
import { tabs } from 'src/util/variaveis/tabs';
import { MotivodiariaService } from 'src/motivodiaria/motivodiaria.service';
import { retornoItinerarioDto } from 'src/itinirario/itinerarioDto';

function getObjectValues(obj: Record<string, any>): any[] {
  return Object.values(obj);
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

      // Monta a cláusula WHERE
      const whereClause =
        filterConditions.length > 0 ? `WHERE ${filterConditions.join(' AND ')}` : '';

      const result = await this.saqueRepository.query(
        `
        SELECT
          a.SQE_DTPEDIDO as SQE_DTPEDIDO,
          a.SQE_ID_CODIGO as SQE_ID_CODIGO,
          a.SQE_EFETIVO as SQE_EFETIVO,
          a.SQE_TIPOSAQUE as SQE_TIPOSAQUE,
          a.SQE_DTSAQUE as SQE_DTSAQUE,
          a.SQE_VLSAQUE as SQE_VLSAQUE,
          a.SQE_DTPREST ,
          b.CHAPA as CHAPA,
          b.NOME as NOME,     
          b.TDE_DESCRICAO as TDE_DESCRICAO,
          b.STS_DESCRICAO as STS_DESCRICAO,
          b.PRA_ATIVO as PRA_ATIVO,
          c.REQ_ID_CODIGO as REQ_ID_CODIGO,
          d.REQ_STATUS as REQ_STATUS
        FROM FINANCEIRO.s009_saque a
          INNER JOIN FINANCEIRO.V009_ITENSREQREC b ON a.ITE_ID_CODIGO = b.ITE_ID_CODIGO 
          INNER JOIN FINANCEIRO.s009_reqnumerario c ON a.SQE_ID_CODIGO = c.SQE_ID_CODIGO
          INNER JOIN TRANSPORTE.s001_requisicao d ON c.REQ_ID_CODIGO = d.REQ_ID_CODIGO
         ${whereClause}
        ORDER BY ${orderByField} ${orderDirection}
        OFFSET :offset ROWS FETCH NEXT :itemsPerPage ROWS ONLY
      `,
        [...filterValues, offset, itemsPerPage],
      );

      let consulta = result.map((item: any) => {
        const calc = calcularValores(item.SQE_VLSAQUE, item.SQE_VLPREST);
        const STATUS =
          ['S', 'C', 'R', 'E'].includes(item.SQE_EFETIVO) &&
          item.SQE_TIPOSAQUE === 'N' &&
          item.PRA_ATIVO != 'N' &&
          (item.SQE_DTPREST === null || item.SQE_VLPREST === 0)
            ? 'Pendente'
            : 'Realizada';

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
          VL_COMPLEMENTAR: calc.VL_COMPLEMENTAR,
          VL_EXTORNO: calc.VL_EXTORNO,
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

      const consulta = await this.saqueRepository.query(
        `
        SELECT
          a.SQE_DTPEDIDO as SQE_DTPEDIDO,
          a.SQE_ID_CODIGO as SQE_ID_CODIGO,
          a.SQE_EFETIVO as SQE_EFETIVO,
          a.SQE_TIPOSAQUE as SQE_TIPOSAQUE,
          a.SQE_DTSAQUE as SQE_DTSAQUE,
          a.SQE_VLSAQUE as SQE_VLSAQUE,
          a.SQE_DTPREST ,
          b.CHAPA as CHAPA,
          b.NOME as NOME,     
          b.TDE_DESCRICAO as TDE_DESCRICAO,
          b.STS_DESCRICAO as STS_DESCRICAO,
          b.PRA_ATIVO as PRA_ATIVO,
          c.REQ_ID_CODIGO as REQ_ID_CODIGO,         
          d.REQ_STATUS as REQ_STATUS,
          d.REQ_DTSAIDA as REQ_DTSAIDA,
          d.REQ_PACOTE as REQ_PACOTE,
          d.REQ_INTEGRAL as REQ_INTEGRAL,
          d.REQ_PARCIAL as REQ_PARCIAL,
          e.MUN_ID_CODIGO as MUN_ID_CODIGO,
          f.CARGO as CARGO
        FROM FINANCEIRO.s009_saque a
          INNER JOIN FINANCEIRO.V009_ITENSREQREC b ON a.ITE_ID_CODIGO = b.ITE_ID_CODIGO 
          INNER JOIN FINANCEIRO.s009_reqnumerario c ON a.SQE_ID_CODIGO = c.SQE_ID_CODIGO
          INNER JOIN TRANSPORTE.s001_requisicao d ON c.REQ_ID_CODIGO = d.REQ_ID_CODIGO
          INNER JOIN TRANSPORTE.s001_destino e ON c.REQ_ID_CODIGO = e.REQ_ID_CODIGO
          INNER JOIN FINANCEIRO.V009_FUNCSALARIO f ON b.CHAPA = f.CHAPA
          WHERE a.SQE_ID_CODIGO = :sqeIdCodigo           
      `,
        [sqeIdCodigo],
      );

      if (!consulta || consulta.length === 0) {
        throw new HttpException('Saque não encontrado', HttpStatus.NOT_FOUND);
      }

      pacote = Number(consulta[0].REQ_PACOTE);

      const STATUS =
        ['S', 'C', 'R', 'E'].includes(consulta[0].SQE_EFETIVO) &&
        consulta[0].SQE_TIPOSAQUE === 'N' &&
        consulta[0].PRA_ATIVO != 'N' &&
        (consulta[0].SQE_DTPREST === null || consulta[0].SQE_VLPREST === 0)
          ? 'Pendente'
          : 'Realizada';

      try {
        itinerario = await this.itinerarioService.findUltimo(consulta[0].REQ_ID_CODIGO);
      } catch (error) {
        console.error('Erro ao buscar itinerário:', error);
      }

      //Quantidade de diárias parciais
      let diariaParcial = calcularDiariaParcial(itinerario.ITI_HCHEGADA);
      diariaParcial = diariaParcial > 0 ? 1 : 0;
      //Quantidade de diárias integrais
      const diariaIntegral = calcularDiariaIntegral(
        itinerario.ITI_DTSAIDA,
        itinerario.ITI_HSAIDA,
        itinerario.ITI_DTCHEGADA,
        itinerario.ITI_HCHEGADA,
      );

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
        throw new HttpException('Erro ao buscar UFESP do cargo', HttpStatus.INTERNAL_SERVER_ERROR);
      }

      const calcDiraria = calcularDiariaValores(
        UFESP,
        UFESPcargoValor,
        destino as Destino,
        pacote,
        diariaIntegral,
        diariaParcial,
        itinerario.ITI_HCHEGADA,
      );

      const somaParcial = calcDiraria.VL_DIARIA_PARCIAL_40 + calcDiraria.VL_DIARIA_PARCIAL_20;

      const somaDiarias = DataUtils.arredondar(calcDiraria.VL_DIARIA_INTEGRAL + somaParcial);

      const valorComplementar = calcularValores(consulta[0].SQE_VLSAQUE, somaDiarias);

      let diariaParcPorc = 0;

      if (calcDiraria?.VL_DIARIA_PARCIAL_20 > 0) {
        diariaParcPorc = 20;
      } else if (calcDiraria?.VL_DIARIA_PARCIAL_40 > 0) {
        diariaParcPorc = 40;
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
        ITI_DTSAIDA: itinerario.ITI_DTSAIDA,
        ITI_HSAIDA: itinerario.ITI_HSAIDA,
        ITI_DTCHEGADA: itinerario.ITI_DTCHEGADA,
        ITI_HCHEGADA: itinerario.ITI_HCHEGADA,
        SQE_VLSAQUE: Number(consulta[0].SQE_VLSAQUE) || 0,
        PARREAL: diariaParcial,
        INTREAL: diariaIntegral,
        VLINTEGRAL: calcDiraria.VL_DIARIA_INTEGRAL,
        VLPARCIAL: somaParcial,
        VLBASE: calcDiraria.VL_DIARIA_BASE,
        VLPREST: somaDiarias,
        VLCOMPLEMENTAR: valorComplementar.VL_COMPLEMENTAR,
        VLEXTORNO: valorComplementar.VL_EXTORNO,
        VLDIARIA: calcDiraria.VL_DIARIA,
        PORCDIARIA: diariaParcPorc,
        PRA_ATIVO: consulta[0].PRA_ATIVO,
        UFESP: UFESP,
      });
    } catch (error) {
      console.error('Erro na consulta findSaque:', error);
      return new HttpException('Erro ao buscar Saques', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }





  async solicitarSaque(params: SolitarDto): Promise<RetNumSaque> {
    try {
      const MD = await this.motivoDiaria.findOne(params.chapa, params.reqIdCodigo);
      if (!MD) {
        throw new HttpException('Diária de viagem não encontrada', HttpStatus.NOT_FOUND);
      }

      const saqueDto = new InsS009SaqueDto({
        par1: 'REEMBOLSO', // REEMBOLSO/COMPLEMENTO
        par2: 'S', // SEM RECURSO
        par3: '7', // tipo de despesa
        //SAQUE
        par4: MD.ITE_ID_CODIGO, // ITE_ID_CODIGO
        par5: MD.RRE_ID_CODIGO, // RRE_ID_CODIGO
        par6: MD.DIR_ID_CODIGO, // DIR_ID_CODIGO
        par7: null, // SQE_VLPREST (não informado)
        par8: null, // SQE_DTPREST (não informado)
        par9: MD.MDI_VALOR, // SQE_VLSAQUE
        par10: 'N', // SQE_TIPOSAQUE
        par11: 'S', // SQE_EFETIVO
        par12: null, // SQE_TERCEIRO (não informado)
        par13: null, // PES_ID_CODIGO (supondo 1)
        par14: null, // PES_PESSOA (não informado)
        par15: null, // STS_ID_CODIGO (não informado)
        par16: null, // SQE_USUARIO (exemplo)
        //NUMERARIO
        par17: params.reqIdCodigo, // REQ_ID_CODIGO
        par18: MD.REQ_DTSAIDA, // RNU_DTINICIO
        par19: MD.REQ_HSAIDA, // RNU_HORAINICIO
        par20: MD.REQ_DTRET, // RNU_DTFIM
        par21: MD.REQ_HRET, // RNU_HORAFIM
        par22: MD.REQ_INTEGRAL, // RNU_INTPREV
        par23: MD.REQ_PARCIAL, // RNU_PARPREV
        par24: null, // RNU_INTREAL (não informado)
        par25: null, // RNU_PARREAL (não informado)
        par26: MD.REQ_PACOTE, // RNU_PACOTE
        par27: MD.REQ_GOVERNADOR, // RNU_GOVERNADOR
        //REEMBOLSO
        par28: MD.REQ_MOTIVO, // RRE_JUSTIFICATIVA
        //REQUISICAO
        par29: MD.REQ_STATUS, // REQ_STATUS
        //NUMERARIO
        par30: params.diariaIntegral, // RNU_VLINTEGRAL
        par31: params.diariaParcial, // RNU_VLPARCIAL
        par32: params.diariaBase, // RNU_VLBASE
      });

      const valuesArray = getObjectValues(saqueDto);    

      const result = await this.saqueRepository.query(
        `CALL INS_S009_SAQUE(
          :PAR1, :PAR2, :PAR3, :PAR4, :PAR5, :PAR6, :PAR7, :PAR8, :PAR9, :PAR10,
          :PAR11, :PAR12, :PAR13, :PAR14, :PAR15, :PAR16, :PAR17, TO_DATE(:PAR18, 'YYYY-MM-DD'), 
          :PAR19, TO_DATE(:PAR20, 'YYYY-MM-DD'), :PAR21, :PAR22, :PAR23, :PAR24, 
          :PAR25, :PAR26, :PAR27, :PAR28, :PAR29, :PAR30, :PAR31, :PAR32)`,
          valuesArray,
      );    

      return { sqeIdCodigo: result[0].id };
    } catch (error) {
      console.error('Erro ao solicitar saque:', error);
      throw new HttpException('Erro ao solicitar saque:', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
