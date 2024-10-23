import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FindParamsSaque, RetNumSaque, SaqueDto, PrestacaoDto, SolitarDto} from './saque.dto';

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
      let destino = "";
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
      diariaParcial = diariaParcial > 0 ? 1 : 0
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

  // async findPrestacao(params: FindParamsSaque): Promise<PrestacaoDto> {
  //   const sqeidcodigo = params.SQE_ID_CODIGO;

  //   const query = this.saqueRepository
  //     .createQueryBuilder('a')
  //     .select([
  //       'a.SQE_DTSAQUE',
  //       'c.RRE_ID_CODIGO',
  //       'a.ITE_ID_CODIGO',
  //       'a.SQE_DTPREST',
  //       'b.REQ_ID_CODIGO',
  //       'a.SQE_ID_CODIGO',
  //       'a.SQE_VLSAQUE',
  //       'a.SQE_VLPREST',
  //       'f.REQ_DTREQ',
  //       'f.REQ_DTREQ',
  //       'g.TRA_DESCRICAO',
  //       'h.NOME',
  //       'h.CARGO',
  //       'i.NME_MUNIC',
  //       'j.REG_DESCRICAO',
  //       'l.MUN_ID_CODIGO',
  //       'm.MUN_CIDADE',
  //       'l.DES_LOCAL',
  //       'f.REQ_DTSAIDA',
  //       'f.REQ_DTRET',
  //       'f.REQ_HSAIDA',
  //       'f.REQ_HRET',
  //       'f.REQ_INTEGRAL',
  //       'f.REQ_PARCIAL',
  //       'f.REQ_PACOTE',
  //       'f.REQ_GOVERNADOR',
  //       'f.REQ_MOTIVO',
  //       'n.CTR_STATUS',
  //       'p.PRA_ATIVO',
  //     ])
  //     .distinct(true)
  //     .innerJoin(tabs.s009_reqrecursos, 'o', 'a.RRE_ID_CODIGO = o.RRE_ID_CODIGO')
  //     .innerJoin(tabs.s009_prazos, 'p', 'o.PRA_ID_CODIGO = p.PRA_ID_CODIGO')
  //     .innerJoin(tabs.s009_reqnumerario, 'b', 'a.SQE_ID_CODIGO = b.SQE_ID_CODIGO')
  //     .innerJoin(tabs.s009_itensreqrec, 'c', 'a.ITE_ID_CODIGO = c.ITE_ID_CODIGO')
  //     .innerJoin(tabs.s001_requisicao, 'f', 'f.REQ_ID_CODIGO = b.REQ_ID_CODIGO')
  //     .innerJoin(tabs.S001_TRANSMEIO, 'g', 'g.TRA_ID_CODIGO = f.TRA_ID_CODIGO')
  //     .innerJoin(tabs.v009_funcsalario, 'h', 'h.CHAPA = c.CHAPA')
  //     .innerJoin(tabs.municipios_ibge_igc, 'i', 'i.COD_MUNICIP = f.COD_MUNICIP')
  //     .innerJoin(tabs.s000_regional, 'j', 'j.REG_ID_CODIGO = f.REG_ID_CODIGO')
  //     .innerJoin(tabs.s001_destino, 'l', 'l.REQ_ID_CODIGO = f.REQ_ID_CODIGO')
  //     .innerJoin(tabs.s001_munic_detran, 'm', 'm.MUN_ID_CODIGO = l.MUN_ID_CODIGO')
  //     .innerJoin(tabs.s001_ctrafego, 'n', 'n.REQ_ID_CODIGO = f.REQ_ID_CODIGO')
  //     .where('a.SQE_ID_CODIGO = :sqeidcodigo', { sqeidcodigo });
  //   // .groupBy('c.RRE_ID_CODIGO')
  //   // .addGroupBy('b.RNU_ID_CODIGO')
  //   // .addGroupBy('c.CHAPA')
  //   // .addGroupBy('c.IRR_VALOR_PREST')
  //   // .addGroupBy('c.IRR_VLSAQUE')
  //   // .addGroupBy('c.IRR_VLDEVOLUCAO')
  //   // .addGroupBy('c.IRR_COMPLEMENTO')
  //   // .addGroupBy('c.IRR_DATA_PREST')
  //   // .addGroupBy('f.REQ_DTREQ')
  //   // .addGroupBy('g.TRA_DESCRICAO')
  //   // .addGroupBy('h.NOME')
  //   // .addGroupBy('h.CARGO')
  //   // .addGroupBy('i.NME_MUNIC')
  //   // .addGroupBy('j.REG_DESCRICAO')
  //   // .addGroupBy('l.MUN_ID_CODIGO')
  //   // .addGroupBy('m.MUN_CIDADE')
  //   // .addGroupBy('l.DES_LOCAL')
  //   // .addGroupBy('f.REQ_DTSAIDA')
  //   // .addGroupBy('f.REQ_DTRET')
  //   // .addGroupBy('f.REQ_HSAIDA')
  //   // .addGroupBy('f.REQ_HRET')
  //   // .addGroupBy('f.REQ_INTEGRAL')
  //   // .addGroupBy('f.REQ_PARCIAL')
  //   // .addGroupBy('f.REQ_PACOTE')
  //   // .addGroupBy('f.REQ_GOVERNADOR')
  //   // .addGroupBy('f.REQ_MOTIVO')
  //   // .addGroupBy('n.CTR_STATUS');

  //   const conditions = [{ param: params.SQE_ID_CODIGO, tab: 'a', key: 'SQE_ID_CODIGO' }];

  //   conditions.forEach(({ param, tab, key }) => {
  //     if (param) {
  //       query.andWhere(`${tab}.${key} = :${key}`, { [key]: param });
  //     }
  //   });

  //   const consulta = await query.getRawMany();

  //   //const STATUS = consulta[0].SQE_DTPREST ? 'Realizada' : 'Pendente';
  //   const STATUS =
  //     ['S', 'C', 'R', 'E'].includes(consulta[0].SQE_EFETIVO) &&
  //     consulta[0].SQE_TIPOSAQUE === 'N' &&
  //     consulta[0].PRA_ATIVO != 'N' &&
  //     (consulta[0].SQE_DTPREST === null || consulta[0].SQE_VLPREST === 0)
  //       ? 'Pendente'
  //       : 'Realizada';
  //   const itinerario = await this.itinerarioService.findUltimo(consulta[0].REQ_ID_CODIGO);

  //   // if (!itinerario) {
  //   //   throw new HttpException('Itinerário não encontrado', HttpStatus.NOT_FOUND
  //   //   );
  //   // }

  //   //Quantidade de diárias parciais
  //   const diariaParcial = calcularDiariaParcial(itinerario.ITI_HCHEGADA);
  //   //Quantidade de diárias integrais
  //   const diariaIntegral = calcularDiariaIntegral(
  //     itinerario.ITI_DTSAIDA,
  //     itinerario.ITI_HSAIDA,
  //     itinerario.ITI_DTCHEGADA,
  //     itinerario.ITI_HCHEGADA,
  //   );

  //   // Busca o valor da UFESP na data da requisição
  //   const UFESP = (await this.ufespService.findValueByDate(consulta[0].REQ_DTSAIDA)).ufeValor || 0;
  //   // Busca o indice da UFESP do cargo do usuário
  //   const UFESPcargo = await this.despesaDiaria.findOne(consulta[0].CARGO);
  //   const UFESPcargoValor = Number(UFESPcargo?.dtdValorMax) || 0;
  //   //buscar destino
  //   const destino = verificarDestino(consulta[0].MUN_ID_CODIGO);

  //   const calcDiraria = calcularDiariaValores(
  //     UFESP,
  //     UFESPcargoValor,
  //     destino as Destino,
  //     consulta[0].REQ_PACOTE,
  //     diariaIntegral,
  //     diariaParcial > 0 ? 1 : 0,
  //     itinerario.ITI_HCHEGADA,
  //   );
  //   const somaParcial = calcDiraria.VL_DIARIA_PARCIAL_40 + calcDiraria.VL_DIARIA_PARCIAL_20;
  //   const somaDiarias = DataUtils.arredondar(calcDiraria.VL_DIARIA_INTEGRAL + somaParcial);
  //   const valorComplementar = calcularValores(consulta[0].SQE_VLSAQUE, somaDiarias);

  //   let diariaParcPorc = 0;

  //   if (calcDiraria?.VL_DIARIA_PARCIAL_20 > 0) {
  //     diariaParcPorc = 20;
  //   } else if (calcDiraria?.VL_DIARIA_PARCIAL_40 > 0) {
  //     diariaParcPorc = 40;
  //   }

  //   return new PrestacaoDto({
  //     NOME: consulta[0].NOME,
  //     REQ_ID_CODIGO: consulta[0].REQ_ID_CODIGO,
  //     SQE_ID_CODIGO: consulta[0].SQE_ID_CODIGO,
  //     CHAPA: consulta[0].CHAPA,
  //     SQE_DTPREST: consulta[0].SQE_DTPREST,
  //     STATUS: STATUS,
  //     SQE_VLPREST: consulta[0].IRR_VALOR_PREST,
  //     REQ_DTREQ: consulta[0].REQ_DTREQ,
  //     TRA_DESCRICAO: consulta[0].TRA_DESCRICAO,
  //     NME_MUNIC: consulta[0].NME_MUNIC,
  //     REG_DESCRICAO: consulta[0].REG_DESCRICAO,
  //     MUN_CIDADE: consulta[0].MUN_CIDADE,
  //     DES_LOCAL: consulta[0].DES_LOCAL,
  //     REQ_DTSAIDA: consulta[0].REQ_DTSAIDA,
  //     REQ_DTRET: consulta[0].REQ_DTRET,
  //     REQ_HSAIDA: consulta[0].REQ_HSAIDA,
  //     REQ_HRET: consulta[0].REQ_HRET,
  //     REQ_INTEGRAL: Number(consulta[0].REQ_INTEGRAL) || 0,
  //     REQ_PARCIAL: consulta[0].REQ_PARCIAL > 0 ? 1 : 0,
  //     REQ_PACOTE: consulta[0].REQ_PACOTE === 0 ? 'S' : 'N',
  //     REQ_GOVERNADOR: consulta[0].REQ_GOVERNADOR,
  //     REQ_MOTIVO: consulta[0].REQ_MOTIVO,
  //     CTR_STATUS: consulta[0].CTR_STATUS,
  //     ITI_DTSAIDA: itinerario.ITI_DTSAIDA,
  //     ITI_HSAIDA: itinerario.ITI_HSAIDA,
  //     ITI_DTCHEGADA: itinerario.ITI_DTCHEGADA,
  //     ITI_HCHEGADA: itinerario.ITI_HCHEGADA,
  //     PARREAL: diariaParcial > 0 ? 1 : 0,
  //     INTREAL: diariaIntegral,
  //     VLINTEGRAL: calcDiraria.VL_DIARIA_INTEGRAL,
  //     VLPARCIAL: somaParcial,
  //     VLBASE: calcDiraria.VL_DIARIA_BASE,
  //     SQE_VLSAQUE: Number(consulta[0].SQE_VLSAQUE) || 0,
  //     VLPREST: somaDiarias,
  //     VLCOMPLEMENTAR: valorComplementar.VL_COMPLEMENTAR,
  //     VLEXTORNO: valorComplementar.VL_EXTORNO,
  //     VLDIARIA: calcDiraria.VL_DIARIA,
  //     PORCDIARIA: diariaParcPorc,
  //     PRA_ATIVO: consulta[0].PRA_ATIVO,
  //   });
  // }

  async solicitarSaque(params: SolitarDto): Promise<RetNumSaque> {
    try {
      const MD = await this.motivoDiaria.findOne(params.chapa, params.reqIdCodigo);

      if (!MD) {
        throw new HttpException('Diária de viagem não encontrada', HttpStatus.NOT_FOUND);
      }

      await this.saqueRepository.query(
        `CALL INS_S009_SAQUE(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @id);`,
        [
          'DIARIA',
          'S',
          MD.TDE_ID_CODIGO,
          MD.ITE_ID_CODIGO,
          MD.RRE_ID_CODIGO,
          MD.DIR_ID_CODIGO,
          null,
          null,
          MD.MDI_VALOR,
          'N',
          'S',
          null,
          null,
          null,
          1,
          null,
          params.reqIdCodigo,
          MD.REQ_DTSAIDA,
          MD.REQ_HSAIDA,
          MD.REQ_DTRET,
          MD.REQ_HRET,
          MD.REQ_INTEGRAL,
          MD.REQ_PARCIAL,
          null,
          null,
          MD.REQ_PACOTE,
          MD.REQ_GOVERNADOR,
          MD.REQ_MOTIVO,
          MD.REQ_STATUS,
          params.diariaIntegral,
          params.diariaParcial,
          params.diariaBase,
        ],
      );

      const result = await this.saqueRepository.query(`SELECT @id as id`);

      return { sqeIdCodigo: result[0].id };
    } catch (error) {
      console.error('Erro ao solicitar saque:', error);
      throw new HttpException('Erro ao solicitar saque:', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
