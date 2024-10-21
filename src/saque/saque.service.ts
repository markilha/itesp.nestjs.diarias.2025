import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FindParamsSaque, RetNumSaque, SaqueDto, PrestacaoDto, SolitarDto } from './saque.dto';

import { SaqueEntity } from 'src/database/db_mysql/entities/saque.entity';
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

@Injectable()
export class SaqueService {
  constructor(
    @InjectRepository(SaqueEntity, 'mysqlConnection')
    private saqueRepository: Repository<SaqueEntity>,
    private motivoDiaria: MotivodiariaService,
    private itinerarioService: ItinirarioService,
    private ufespService: UfespService,
    private despesaDiaria: DespesadiariaService,
  ) {}

  async findAll(params: FindParamsSaque): Promise<SaqueDto[]> {
    try {
      const chapa = params.CHAPA;

      const query = this.saqueRepository.createQueryBuilder('a');
      query
        .select([
          'a.SQE_DTPEDIDO',
          'a.SQE_ID_CODIGO',
          'a.SQE_EFETIVO',
          'a.SQE_TIPOSAQUE',
          'a.SQE_DTSAQUE',
          'a.SQE_VLSAQUE',
          'a.SQE_DTPREST',
          'b.REQ_ID_CODIGO',
          'd.REQ_STATUS',
          'c.CHAPA',
          'e.STS_DESCRICAO',
          'f.TDE_DESCRICAO',
          'g.NOME',
          'j.PRA_ATIVO',
        ])
        .distinct(true)
        .innerJoin(tabs.s009_reqnumerario, 'b', 'a.SQE_ID_CODIGO = b.SQE_ID_CODIGO')
        .innerJoin(tabs.s009_reqrecursos, 'i', 'a.RRE_ID_CODIGO = i.RRE_ID_CODIGO')
        .innerJoin(tabs.s009_prazos, 'j', 'i.PRA_ID_CODIGO = j.PRA_ID_CODIGO')
        .innerJoin(tabs.s009_itensreqrec, 'c', 'a.ITE_ID_CODIGO = c.ITE_ID_CODIGO')
        .innerJoin(tabs.s001_requisicao, 'd', 'd.REQ_ID_CODIGO = b.REQ_ID_CODIGO')
        .innerJoin(tabs.s009_status, 'e', 'e.STS_ID_CODIGO = a.STS_ID_CODIGO')
        .innerJoin(tabs.s009_tipodesp, 'f', 'f.TDE_ID_CODIGO = c.TDE_ID_CODIGO')
        .innerJoin(tabs.v009_funcsalario, 'g', 'g.CHAPA = c.CHAPA')

        .where('c.CHAPA = :chapa', { chapa });
      // .groupBy('a.SQE_ID_CODIGO')
      // .addGroupBy('c.RRE_ID_CODIGO')
      // .addGroupBy('c.CHAPA')
      // .addGroupBy('a.SQE_DTSAQUE')
      // .addGroupBy('a.SQE_VLSAQUE')
      // .addGroupBy('a.SQE_DTPREST')
      // .addGroupBy('e.STS_DESCRICAO')
      // .addGroupBy('b.REQ_ID_CODIGO')
      // .addGroupBy('d.REQ_STATUS')
      // .addGroupBy('f.TDE_DESCRICAO')
      // .addGroupBy('g.NOME')

      // Aplicação de filtros
      if (params.REQ_ID_CODIGO) {
        query.andWhere('b.REQ_ID_CODIGO = :REQ_ID_CODIGO', { REQ_ID_CODIGO: params.REQ_ID_CODIGO });
      }
      if (params.SQE_ID_CODIGO) {
        query.andWhere('a.SQE_ID_CODIGO = :SQE_ID_CODIGO', { SQE_ID_CODIGO: params.SQE_ID_CODIGO });
      }
      if (params.STS_DESCRICAO) {
        query.andWhere('e.STS_DESCRICAO = :STS_DESCRICAO', { STS_DESCRICAO: params.STS_DESCRICAO });
      }
      if (params.REQ_STATUS) {
        query.andWhere('d.REQ_STATUS = :REQ_STATUS', { REQ_STATUS: params.REQ_STATUS });
      }
      if (params.startDate && params.endDate) {
        const prestDate = params.usePrestDate === 'true';
        const dataColumn = prestDate ? 'a.SQE_DTPREST' : 'a.SQE_DTSAQUE';
        const { startDate, endDate } = formatDates(params.startDate, params.endDate) || null;
        query.andWhere(
          `STR_TO_DATE(${dataColumn}, '%d/%m/%Y %H:%i:%s') BETWEEN STR_TO_DATE(:startDate, '%d/%m/%Y %H:%i:%s') AND STR_TO_DATE(:endDate, '%d/%m/%Y %H:%i:%s')`,
          { startDate, endDate },
        );
      }

      // Ordenação
      if (params.orderBy) {
        query.orderBy(params.orderBy, params.orderDirection === 'DESC' ? 'DESC' : 'ASC');
      } else {
        query.orderBy('SQE_ID_CODIGO', 'ASC'); // Ordenação padrão
      }

      const consulta = await query.getRawMany();
      if (!consulta.length) {
        return [];
      }

      // Processar resultados
      let result = consulta.map((item) => {
        const calc = calcularValores(item.SQE_VLSAQUE, item.SQE_VLPREST);
        // const STATUS = item.SQE_DTPREST ? 'Realizada' : 'Pendente';
        const STATUS =
          ['S', 'C', 'R', 'E'].includes(item.SQE_EFETIVO) &&
          item.SQE_TIPOSAQUE === 'N' &&
          item.PRA_ATIVO != 'N' &&
          (item.SQE_DTPREST === null || item.SQE_VLPREST === 0)
            ? 'Pendente'
            : 'Realizada';

        return new SaqueDto({
          SQE_DTPEDIDO: item.SQE_DTPEDIDO,
          SQE_DTSAQUE: item.SQE_DTSAQUE,
          SQE_VLSAQUE: Number(item.SQE_VLSAQUE) || 0,
          SQE_VLPREST: Number(item.SQE_VLPREST) || 0,
          RRE_ID_CODIGO: item.RRE_ID_CODIGO,
          ITE_ID_CODIGO: item.ITE_ID_CODIGO,
          SQE_DTPREST: item.SQE_DTPREST,
          NOME: item.NOME,
          REQ_ID_CODIGO: item.REQ_ID_CODIGO,
          SQE_ID_CODIGO: item.SQE_ID_CODIGO,
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
        result = result.filter((item) => item.STATUS === params.STATUS);
      }

      // Aplicando paginação
      const page = params.page || 1;
      const limit = params.limit || 100;
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;

      const paginatedResults = result.slice(startIndex, endIndex);

      // Retornando resultados paginados
      return paginatedResults;
    } catch (error) {
      console.error('Erro na consulta findSaque:', error);
      throw new HttpException('Erro ao buscar Saques', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findPrestacao(params: FindParamsSaque): Promise<PrestacaoDto> {
    const sqeidcodigo = params.SQE_ID_CODIGO;

    const query = this.saqueRepository
      .createQueryBuilder('a')
      .select([
        'a.SQE_DTSAQUE',
        'c.RRE_ID_CODIGO',
        'a.ITE_ID_CODIGO',
        'a.SQE_DTPREST',
        'b.REQ_ID_CODIGO',
        'a.SQE_ID_CODIGO',
        'a.SQE_VLSAQUE',
        'a.SQE_VLPREST',
        'f.REQ_DTREQ',
        'f.REQ_DTREQ',
        'g.TRA_DESCRICAO',
        'h.NOME',
        'h.CARGO',
        'i.NME_MUNIC',
        'j.REG_DESCRICAO',
        'l.MUN_ID_CODIGO',
        'm.MUN_CIDADE',
        'l.DES_LOCAL',
        'f.REQ_DTSAIDA',
        'f.REQ_DTRET',
        'f.REQ_HSAIDA',
        'f.REQ_HRET',
        'f.REQ_INTEGRAL',
        'f.REQ_PARCIAL',
        'f.REQ_PACOTE',
        'f.REQ_GOVERNADOR',
        'f.REQ_MOTIVO',
        'n.CTR_STATUS',
        'p.PRA_ATIVO',
      ])
      .distinct(true)
      .innerJoin(tabs.s009_reqrecursos, 'o', 'a.RRE_ID_CODIGO = o.RRE_ID_CODIGO')
      .innerJoin(tabs.s009_prazos, 'p', 'o.PRA_ID_CODIGO = p.PRA_ID_CODIGO')
      .innerJoin(tabs.s009_reqnumerario, 'b', 'a.SQE_ID_CODIGO = b.SQE_ID_CODIGO')
      .innerJoin(tabs.s009_itensreqrec, 'c', 'a.ITE_ID_CODIGO = c.ITE_ID_CODIGO')
      .innerJoin(tabs.s001_requisicao, 'f', 'f.REQ_ID_CODIGO = b.REQ_ID_CODIGO')
      .innerJoin(tabs.S001_TRANSMEIO, 'g', 'g.TRA_ID_CODIGO = f.TRA_ID_CODIGO')
      .innerJoin(tabs.v009_funcsalario, 'h', 'h.CHAPA = c.CHAPA')
      .innerJoin(tabs.municipios_ibge_igc, 'i', 'i.COD_MUNICIP = f.COD_MUNICIP')
      .innerJoin(tabs.s000_regional, 'j', 'j.REG_ID_CODIGO = f.REG_ID_CODIGO')
      .innerJoin(tabs.s001_destino, 'l', 'l.REQ_ID_CODIGO = f.REQ_ID_CODIGO')
      .innerJoin(tabs.s001_munic_detran, 'm', 'm.MUN_ID_CODIGO = l.MUN_ID_CODIGO')
      .innerJoin(tabs.s001_ctrafego, 'n', 'n.REQ_ID_CODIGO = f.REQ_ID_CODIGO')
      .where('a.SQE_ID_CODIGO = :sqeidcodigo', { sqeidcodigo });
    // .groupBy('c.RRE_ID_CODIGO')
    // .addGroupBy('b.RNU_ID_CODIGO')
    // .addGroupBy('c.CHAPA')
    // .addGroupBy('c.IRR_VALOR_PREST')
    // .addGroupBy('c.IRR_VLSAQUE')
    // .addGroupBy('c.IRR_VLDEVOLUCAO')
    // .addGroupBy('c.IRR_COMPLEMENTO')
    // .addGroupBy('c.IRR_DATA_PREST')
    // .addGroupBy('f.REQ_DTREQ')
    // .addGroupBy('g.TRA_DESCRICAO')
    // .addGroupBy('h.NOME')
    // .addGroupBy('h.CARGO')
    // .addGroupBy('i.NME_MUNIC')
    // .addGroupBy('j.REG_DESCRICAO')
    // .addGroupBy('l.MUN_ID_CODIGO')
    // .addGroupBy('m.MUN_CIDADE')
    // .addGroupBy('l.DES_LOCAL')
    // .addGroupBy('f.REQ_DTSAIDA')
    // .addGroupBy('f.REQ_DTRET')
    // .addGroupBy('f.REQ_HSAIDA')
    // .addGroupBy('f.REQ_HRET')
    // .addGroupBy('f.REQ_INTEGRAL')
    // .addGroupBy('f.REQ_PARCIAL')
    // .addGroupBy('f.REQ_PACOTE')
    // .addGroupBy('f.REQ_GOVERNADOR')
    // .addGroupBy('f.REQ_MOTIVO')
    // .addGroupBy('n.CTR_STATUS');

    const conditions = [{ param: params.SQE_ID_CODIGO, tab: 'a', key: 'SQE_ID_CODIGO' }];

    conditions.forEach(({ param, tab, key }) => {
      if (param) {
        query.andWhere(`${tab}.${key} = :${key}`, { [key]: param });
      }
    });

    const consulta = await query.getRawMany();

    //const STATUS = consulta[0].SQE_DTPREST ? 'Realizada' : 'Pendente';
    const STATUS =
      ['S', 'C', 'R', 'E'].includes(consulta[0].SQE_EFETIVO) &&
      consulta[0].SQE_TIPOSAQUE === 'N' &&
      consulta[0].PRA_ATIVO != 'N' &&
      (consulta[0].SQE_DTPREST === null || consulta[0].SQE_VLPREST === 0)
        ? 'Pendente'
        : 'Realizada';
    const itinerario = await this.itinerarioService.findUltimo(consulta[0].REQ_ID_CODIGO);

    // if (!itinerario) {
    //   throw new HttpException('Itinerário não encontrado', HttpStatus.NOT_FOUND
    //   );
    // }

    //Quantidade de diárias parciais
    const diariaParcial = calcularDiariaParcial(itinerario.ITI_HCHEGADA);
    //Quantidade de diárias integrais
    const diariaIntegral = calcularDiariaIntegral(
      itinerario.ITI_DTSAIDA,
      itinerario.ITI_HSAIDA,
      itinerario.ITI_DTCHEGADA,
      itinerario.ITI_HCHEGADA,
    );

    // Busca o valor da UFESP na data da requisição
    const UFESP = (await this.ufespService.findValueByDate(consulta[0].REQ_DTSAIDA)).ufeValor || 0;
    // Busca o indice da UFESP do cargo do usuário
    const UFESPcargo = await this.despesaDiaria.findOne(consulta[0].CARGO);
    const UFESPcargoValor = Number(UFESPcargo?.dtdValorMax) || 0;
    //buscar destino
    const destino = verificarDestino(consulta[0].MUN_ID_CODIGO);

    const calcDiraria = calcularDiariaValores(
      UFESP,
      UFESPcargoValor,
      destino as Destino,
      consulta[0].REQ_PACOTE,
      diariaIntegral,
      diariaParcial > 0 ? 1 : 0,
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
      STATUS: STATUS,
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
      REQ_PACOTE: consulta[0].REQ_PACOTE === 0 ? 'S' : 'N',
      REQ_GOVERNADOR: consulta[0].REQ_GOVERNADOR,
      REQ_MOTIVO: consulta[0].REQ_MOTIVO,
      CTR_STATUS: consulta[0].CTR_STATUS,
      ITI_DTSAIDA: itinerario.ITI_DTSAIDA,
      ITI_HSAIDA: itinerario.ITI_HSAIDA,
      ITI_DTCHEGADA: itinerario.ITI_DTCHEGADA,
      ITI_HCHEGADA: itinerario.ITI_HCHEGADA,
      PARREAL: diariaParcial > 0 ? 1 : 0,
      INTREAL: diariaIntegral,
      VLINTEGRAL: calcDiraria.VL_DIARIA_INTEGRAL,
      VLPARCIAL: somaParcial,
      VLBASE: calcDiraria.VL_DIARIA_BASE,
      SQE_VLSAQUE: Number(consulta[0].SQE_VLSAQUE) || 0,
      VLPREST: somaDiarias,
      VLCOMPLEMENTAR: valorComplementar.VL_COMPLEMENTAR,
      VLEXTORNO: valorComplementar.VL_EXTORNO,
      VLDIARIA: calcDiraria.VL_DIARIA,
      PORCDIARIA: diariaParcPorc,
      PRA_ATIVO: consulta[0].PRA_ATIVO,
    });
  }

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
