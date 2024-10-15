import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FindParamsSaque, RetNumSaque, SaqueDto, PrestacaoDto, SolitarDto } from './saque.dto';

import { SaqueEntity } from 'src/database/db_mysql/entities/saque.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DiariaviagemService } from 'src/diariaviagem/diariaviagem.service';
import { calcularValores } from 'src/util/calculo_extorno';
import { formatDates } from 'src/util/formatStarDateEndDate';
import { sortByField } from 'src/util/ordenar';

const tabs = {
  tab01: 's009_reqnumerario',
  tab02: 's009_itensreqrec',
  tab03: 's001_requisicao',
  tab04: 's009_status',
  tab05: 's009_tipodesp',
  tab06: 'v009_funcsalario',
  tab07: 'v009_requisicao',
  tab08: 'S001_TRANSMEIO',
  tab09: 'MUNICIPIOS_IBGE_IGC',
  tab10: 'S000_REGIONAL',
  tab11: 'S001_DESTINO',
  tab12: 'S001_MUNIC_DETRAN',
  tab13: 's001_ctrafego',
};


@Injectable()
export class SaqueService {
  constructor(
    @InjectRepository(SaqueEntity, 'mysqlConnection')
    private saqueRepository: Repository<SaqueEntity>,
    private diariaviagemService: DiariaviagemService,
  ) {}

  async findAll(params: FindParamsSaque): Promise<SaqueDto[]> {
    try {
      const chapa = params.CHAPA;
      const subquery = this.saqueRepository
        .createQueryBuilder('a')
        .select([
          'a.SQE_DTPEDIDO',
          'a.SQE_ID_CODIGO',
          'a.SQE_DTSAQUE',
          'a.SQE_VLSAQUE',
          'a.SQE_DTPREST',
          'b.REQ_ID_CODIGO',
          'd.REQ_STATUS',
          'c.CHAPA',
          'e.STS_DESCRICAO',
          'f.TDE_DESCRICAO',
          'g.NOME',
        ])
        .innerJoin(tabs.tab01, 'b', 'a.SQE_ID_CODIGO = b.SQE_ID_CODIGO')
        .innerJoin(tabs.tab02, 'c', 'a.ITE_ID_CODIGO = c.ITE_ID_CODIGO')
        .innerJoin(tabs.tab03, 'd', 'd.REQ_ID_CODIGO = b.REQ_ID_CODIGO')
        .innerJoin(tabs.tab04, 'e', 'e.STS_ID_CODIGO = a.STS_ID_CODIGO')
        .innerJoin(tabs.tab05, 'f', 'f.TDE_ID_CODIGO = c.TDE_ID_CODIGO')
        .innerJoin(tabs.tab06, 'g', 'g.CHAPA = c.CHAPA')
        .where('c.CHAPA = :chapa', { chapa })
        .groupBy('a.SQE_ID_CODIGO')
        .addGroupBy('c.RRE_ID_CODIGO')
        .addGroupBy('c.CHAPA')
        .addGroupBy('a.SQE_DTSAQUE')
        .addGroupBy('a.SQE_VLSAQUE')
        .addGroupBy('a.SQE_DTPREST')
        .addGroupBy('e.STS_DESCRICAO')
        .addGroupBy('b.REQ_ID_CODIGO')
        .addGroupBy('d.REQ_STATUS')
        .addGroupBy('f.TDE_DESCRICAO')
        .addGroupBy('g.NOME');

      const conditions = [
        { param: params.SQE_ID_CODIGO, tab: 'a', key: 'SQE_ID_CODIGO' },
        { param: params.CHAPA, tab: 'c', key: 'CHAPA' },
        { param: params.REQ_ID_CODIGO, tab: 'b', key: 'REQ_ID_CODIGO' },
        { param: params.STS_DESCRICAO, tab: 'e', key: 'STS_DESCRICAO' },
        { param: params.REQ_STATUS, tab: 'd', key: 'REQ_STATUS' },
      ];

      conditions.forEach(({ param, tab, key }) => {
        if (param) {
          subquery.andWhere(`${tab}.${key} = :${key}`, { [key]: param });
        }
      });
     
      // conventer usePrestDate para boolean
      const prestDate = params.usePrestDate === 'true' ? true : false;
      const dataColumn = prestDate ? 'a.SQE_DTPREST' : 'a.SQE_DTSAQUE';
     

      // Filtro por data (saque ou prestação)
      if (params.startDate && params.endDate) {
        const { startDate, endDate } = formatDates(params.startDate, params.endDate) || null;
        subquery.andWhere(
          `STR_TO_DATE(${dataColumn}, '%d/%m/%Y %H:%i:%s') BETWEEN STR_TO_DATE(:startDate, '%d/%m/%Y %H:%i:%s') AND STR_TO_DATE(:endDate, '%d/%m/%Y %H:%i:%s')`,
          {
            startDate: startDate,
            endDate: endDate,
          },
        );
      }

      // Ordenação
      if (params.orderBy) {
        subquery.orderBy(params.orderBy, params.orderDirection === 'DESC' ? 'DESC' : 'ASC');
      } else {
        subquery.orderBy('SQE_ID_CODIGO', 'ASC'); // Ordenação padrão
      }

      // Consulta principal que usa a subconsulta e aplica paginação
      const query = this.saqueRepository
        .createQueryBuilder()
        .select('*')
        .from('(' + subquery.getQuery() + ')', 'sub') // Usa a subquery
        .setParameters(subquery.getParameters());
        

      //Aplicando paginação
      if (params.page && params.limit) {
        const offset = (params.page - 1) * params.limit;
        query.skip(offset).take(params.limit);
      }

      const consulta = await query.getRawMany();
      if (!consulta.length) {
        return [];
      }

      let result = [];

      consulta.map((item) => {
        const calc = calcularValores(item.SQE_VLSAQUE, item.SQE_VLPREST);
        const STATUS = item.SQE_DTPREST ? 'Realizada' : 'Pendente';

        const data = {
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
        };
        result.push(new SaqueDto(data));
      });

      if (params.STATUS) {
        if (params.STATUS === 'Realizada') {
          result = result.filter((item) => item.STATUS === 'Realizada');
        }
        if (params.STATUS === 'Pendente') {
          result = result.filter((item) => item.STATUS === 'Pendente');
        }
      }

      // Ordenação do resultado
      sortByField(result, params.orderBy, params.orderDirection);

      return result;
    } catch (error) {
      console.error('Erro na consulta findPrestacao:', error);
      throw new HttpException('Erro ao buscar prestações', HttpStatus.INTERNAL_SERVER_ERROR);
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
      ])
      .innerJoin(tabs.tab01, 'b', 'a.SQE_ID_CODIGO = b.SQE_ID_CODIGO')
      .innerJoin(tabs.tab02, 'c', 'a.ITE_ID_CODIGO = c.ITE_ID_CODIGO')
      .innerJoin(tabs.tab03, 'f', 'f.REQ_ID_CODIGO = b.REQ_ID_CODIGO')
      .innerJoin(tabs.tab08, 'g', 'g.TRA_ID_CODIGO = f.TRA_ID_CODIGO')
      .innerJoin(tabs.tab06, 'h', 'h.CHAPA = c.CHAPA')
      .innerJoin(tabs.tab09, 'i', 'i.COD_MUNICIP = f.COD_MUNICIP')
      .innerJoin(tabs.tab10, 'j', 'j.REG_ID_CODIGO = f.REG_ID_CODIGO')
      .innerJoin(tabs.tab11, 'l', 'l.REQ_ID_CODIGO = f.REQ_ID_CODIGO')
      .innerJoin(tabs.tab12, 'm', 'm.MUN_ID_CODIGO = l.MUN_ID_CODIGO')
      .innerJoin(tabs.tab13, 'n', 'n.REQ_ID_CODIGO = f.REQ_ID_CODIGO')

      .where('a.SQE_ID_CODIGO = :sqeidcodigo', { sqeidcodigo })
      .groupBy('c.RRE_ID_CODIGO')
      .addGroupBy('b.RNU_ID_CODIGO')
      .addGroupBy('c.CHAPA')
      .addGroupBy('c.IRR_VALOR_PREST')
      .addGroupBy('c.IRR_VLSAQUE')
      .addGroupBy('c.IRR_VLDEVOLUCAO')
      .addGroupBy('c.IRR_COMPLEMENTO')
      .addGroupBy('c.IRR_DATA_PREST')
      .addGroupBy('f.REQ_DTREQ')
      .addGroupBy('g.TRA_DESCRICAO')
      .addGroupBy('h.NOME')
      .addGroupBy('i.NME_MUNIC')
      .addGroupBy('j.REG_DESCRICAO')
      .addGroupBy('l.MUN_ID_CODIGO')
      .addGroupBy('m.MUN_CIDADE')
      .addGroupBy('l.DES_LOCAL')
      .addGroupBy('f.REQ_DTSAIDA')
      .addGroupBy('f.REQ_DTRET')
      .addGroupBy('f.REQ_HSAIDA')
      .addGroupBy('f.REQ_HRET')
      .addGroupBy('f.REQ_INTEGRAL')
      .addGroupBy('f.REQ_PARCIAL')
      .addGroupBy('f.REQ_PACOTE')
      .addGroupBy('f.REQ_GOVERNADOR')
      .addGroupBy('f.REQ_MOTIVO')
      .addGroupBy('n.CTR_STATUS');

    const conditions = [{ param: params.SQE_ID_CODIGO, tab: 'a', key: 'SQE_ID_CODIGO' }];

    conditions.forEach(({ param, tab, key }) => {
      if (param) {
        query.andWhere(`${tab}.${key} = :${key}`, { [key]: param });
      }
    });

    const consulta = await query.getRawMany();

    return new PrestacaoDto({
      NOME: consulta[0].NOME,
      REQ_ID_CODIGO: consulta[0].REQ_ID_CODIGO,
      SQE_ID_CODIGO: consulta[0].SQE_ID_CODIGO,
      CHAPA: consulta[0].CHAPA,
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
      REQ_PACOTE: consulta[0].REQ_PACOTE === 1 ? 'N' : 'S',
      REQ_GOVERNADOR: consulta[0].REQ_GOVERNADOR,
      REQ_MOTIVO: consulta[0].REQ_MOTIVO,
      CTR_STATUS: consulta[0].CTR_STATUS,
    });
  }

  async solicitarSaque(params: SolitarDto): Promise<RetNumSaque> {
    const diariaViagem = await this.diariaviagemService.findOne(params.reqIdCodigo, params.chapa);

    if (!diariaViagem) {
      throw new HttpException('Diária de viagem não encontrada', HttpStatus.NOT_FOUND);
    }

    const pacote = params.reqPacote === 1 ? 'N' : 'S';

    await this.saqueRepository.query(
      `CALL INS_S009_SAQUE(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @id);`,
      [
        'DIARIA',
        'N',
        diariaViagem.TDE_ID_CODIGO,
        diariaViagem.ITE_ID_CODIGO,
        diariaViagem.RRE_ID_CODIGO,
        diariaViagem.DIR_ID_CODIGO,
        null,
        null,
        diariaViagem.MDI_VALOR,
        'N',
        'S',
        null,
        null,
        null,
        1,
        null,
        params.reqIdCodigo,
        diariaViagem.REQ_DTSAIDA,
        diariaViagem.REQ_HSAIDA,
        diariaViagem.REQ_DTRET,
        diariaViagem.REQ_HRET,
        diariaViagem.REQ_INTEGRAL,
        diariaViagem.REQ_PARCIAL,
        null,
        null,
        pacote,
        diariaViagem.REQ_GOVERNADOR,
        diariaViagem.REQ_MOTIVO,
        params.reqStatus,
        params.diariaIntegral,
        params.diariaParcial,
        params.diariaBase,
      ],
    );

    const result = await this.saqueRepository.query(`SELECT @id as id`);

    return { sqeIdCodigo: result[0].id };
  }
}
