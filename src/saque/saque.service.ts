import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  CreateSaqueDto,
  FindParamsSaque,
  RetNumSaque,
  SaqueDto,
  PrestacaoDto,
  SolitarDto,
} from './saque.dto';

import { SaqueEntity } from 'src/database/db_mysql/entities/saque.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DiariaviagemService } from 'src/diariaviagem/diariaviagem.service';
import { calcularValores } from 'src/util/calculo_extorno';

const tabs = {
  tab01: 's009_reqnumerario',
  tab02: 's009_itensreqrec',
  tab03: 's001_requisicao',
  tab04: 's009_status',
  tab05: 's009_tipodesp',
  tab06: 'v009_funcsalario',
};

@Injectable()
export class SaqueService {
  constructor(
    @InjectRepository(SaqueEntity, 'mysqlConnection')
    private saqueRepository: Repository<SaqueEntity>,
    private diariaviagemService: DiariaviagemService,
  ) {}

  async findAll(params: FindParamsSaque): Promise<any> {
    try {
      const chapa = params.CHAPA;
      const query = this.saqueRepository
        .createQueryBuilder('a')
        .select([
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
          query.andWhere(`${tab}.${key} = :${key}`, { [key]: param });
        }
      });
      // Paginação, caso fornecido nos parâmetros
      if (params.page && params.limit) {
        const offset = (params.page - 1) * params.limit;
        query.skip(offset).take(params.limit);
      }

      // Ordenação
      if (params.orderBy) {
        query.orderBy(params.orderBy, params.orderDirection === 'DESC' ? 'DESC' : 'ASC');
      } else {
        query.orderBy('SQE_ID_CODIGO', 'ASC'); // Ordenação padrão
      }

      // Execução da query e retorno dos resultados
      const result = await query.getRawMany();
      return result;
    } catch (error) {
      console.error('Erro na consulta findPrestacao:', error);
      throw new HttpException('Erro ao buscar prestações', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // async findAll(params: FindAllParams): Promise<SaqueDto[]> {
  //   try {
  //     const searchParams: FindOptionsWhere<SaqueDto> = {};

  //     if (params.sqeIdCodigo) {
  //       searchParams['sqeIdCodigo'] = params.sqeIdCodigo;
  //     }

  //     if (params.stsIdCodigo) {
  //       searchParams['stsIdCodigo'] = params.stsIdCodigo;
  //     }

  //     const queryBuilder = this.saqueRepository
  //       .createQueryBuilder('saque')
  //       .leftJoinAndSelect('saque.status', 'status')
  //       .leftJoinAndSelect('saque.numerario', 'numerario');

  //     // Filtrar pela descrição do status, se fornecido
  //     if (params.stsDescricao) {
  //       queryBuilder.andWhere('status.stsDescricao = :statusDescricao', {
  //         statusDescricao: params.stsDescricao,
  //       });
  //     }

  //     // Adicionar os outros filtros
  //     if (params.sqeIdCodigo) {
  //       queryBuilder.andWhere('saque.sqeIdCodigo = :sqeIdCodigo', {
  //         sqeIdCodigo: params.sqeIdCodigo,
  //       });
  //     }

  //     if (params.stsIdCodigo) {
  //       queryBuilder.andWhere('saque.stsIdCodigo = :stsIdCodigo', {
  //         stsIdCodigo: params.stsIdCodigo,
  //       });
  //     }

  //     // Paginação
  //     if (params.page && params.limit) {
  //       const page = params.page;
  //       const limit = params.limit;
  //       const skip = (page - 1) * limit;

  //       queryBuilder.skip(skip).take(limit);
  //     }

  //     return await queryBuilder.getMany();
  //   } catch (error) {
  //     console.log(error);
  //     throw new HttpException(
  //       'Não foi possível buscar os saques',
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //     );
  //   }
  // }

  async findOne(codigo: number): Promise<SaqueDto> {
    try {
      return await this.saqueRepository.findOne({
        where: { sqeIdCodigo: codigo },
        relations: ['numerario', 'status'],
      });
    } catch (error) {
      throw new HttpException('Não foi possível busca o cargo', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async create(saque: CreateSaqueDto): Promise<SaqueDto> {
    try {
      saque.stsIdCodigo = 1;
      const newSaque = this.saqueRepository.create(saque);
      await this.saqueRepository.save(newSaque);
      return newSaque;
    } catch (error) {
      console.log(error);
      throw new HttpException('Não foi possível criar o saque', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findPrestacao(params: FindParamsSaque): Promise<PrestacaoDto[]> {
    const chapa = params.CHAPA;

    const query = this.saqueRepository
      .createQueryBuilder('a')
      .select([
        'c.RRE_ID_CODIGO',
        'a.ITE_ID_CODIGO',
        'a.SQE_DTPREST',
        'd.NOME',
        'b.REQ_ID_CODIGO',
        'a.SQE_ID_CODIGO',
        'e.TDE_DESCRICAO',
        'a.SQE_VLSAQUE',
        'a.SQE_VLPREST',
      ])
      .innerJoin(tabs.tab01, 'b', 'a.SQE_ID_CODIGO = b.SQE_ID_CODIGO')
      .innerJoin(tabs.tab02, 'c', 'a.ITE_ID_CODIGO = c.ITE_ID_CODIGO')
      .innerJoin(tabs.tab06, 'd', 'c.CHAPA = d.CHAPA')
      .innerJoin(tabs.tab04, 's', 'a.STS_ID_CODIGO = s.STS_ID_CODIGO')
      .innerJoin(tabs.tab05, 'e', 'c.TDE_ID_CODIGO = e.TDE_ID_CODIGO')
      .where('c.CHAPA = :chapa', { chapa })
      .groupBy('c.RRE_ID_CODIGO')
      .addGroupBy('b.RNU_ID_CODIGO')
      .addGroupBy('c.CHAPA')
      .addGroupBy('d.NOME')
      .addGroupBy('a.STS_ID_CODIGO')
      .addGroupBy('s.STS_DESCRICAO')
      .addGroupBy('e.TDE_DESCRICAO')
      .addGroupBy('c.IRR_VALOR_PREST')
      .addGroupBy('c.IRR_VLSAQUE')
      .addGroupBy('c.IRR_VLDEVOLUCAO')
      .addGroupBy('c.IRR_COMPLEMENTO')
      .addGroupBy('c.IRR_DATA_PREST');

    const conditions = [
      { param: params.SQE_ID_CODIGO, tab: 'a', key: 'SQE_ID_CODIGO' },
      { param: params.ITE_ID_CODIGO, tab: 'a', key: 'ITE_ID_CODIGO' },
      { param: params.CHAPA, tab: 'c', key: 'CHAPA' },
      { param: params.REQ_ID_CODIGO, tab: 'b', key: 'REQ_ID_CODIGO' },
      { param: params.STS_DESCRICAO, tab: 's', key: 'STS_DESCRICAO' },
      { param: params.REQ_STATUS, tab: 'd', key: 'REQ_STATUS' },
    ];

    conditions.forEach(({ param, tab, key }) => {
      if (param) {
        query.andWhere(`${tab}.${key} = :${key}`, { [key]: param });
      }
    });

    // Ordenação
    if (params.orderBy) {
      query.orderBy(params.orderBy, params.orderDirection === 'DESC' ? 'DESC' : 'ASC');
    } else {
      query.orderBy('SQE_ID_CODIGO', 'ASC');
    }

    const consulta = await query.getRawMany();

    let result = [];

    consulta.map((item) => {
      const calc = calcularValores(item.SQE_VLSAQUE, item.SQE_VLPREST);
      //DE SQE_DTPREST FOR NULL, UNDERFINED OR EMPTY STRING,  RETURN 'Pendente' ou 'Realizada'
      const STATUS = item.SQE_DTPREST ? 'Realizada' : 'Pendente';

      const data = {
        RRE_ID_CODIGO: item.RRE_ID_CODIGO,
        ITE_ID_CODIGO: item.ITE_ID_CODIGO,
        SQE_DTPREST: item.SQE_DTPREST,
        NOME: item.NOME,
        REQ_ID_CODIGO: item.REQ_ID_CODIGO,
        SQE_ID_CODIGO: item.SQE_ID_CODIGO,
        TDE_DESCRICAO: item.TDE_DESCRICAO,
        SQE_VLSAQUE: Number(item.SQE_VLSAQUE) || 0,
        SQE_VLPREST: Number(item.SQE_VLPREST) || 0,
        VL_COMPLEMENTAR: calc.VL_COMPLEMENTAR,
        VL_EXTORNO: calc.VL_EXTORNO,
        STS_DESCRICAO: item.STS_DESCRICAO,
        STATUS
      };
      result.push(new PrestacaoDto(data));
    });

    if (params.STATUS) {
      if (params.STATUS === 'Realizada') {
        result = result.filter((item) => item.SITUACAO === 'Realizada');
      }
      if (params.STATUS === 'Pendente') {
        result = result.filter((item) => item.SITUACAO === 'Pendente');
      }
    }

    return result;
  }

  async solicitarSaque(params: SolitarDto): Promise<RetNumSaque> {
    const diariaViagem = await this.diariaviagemService.findOne(params.reqIdCodigo, params.chapa);

    if (!diariaViagem) {
      throw new HttpException('Diária de viagem não encontrada', HttpStatus.NOT_FOUND);
    }

    const pacote = params.reqPacote === 0 ? 'N' : 'S';

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
