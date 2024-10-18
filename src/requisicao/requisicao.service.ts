import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Requisicao_Entity } from 'src/database/db_mysql/entities/requisicao_.entity';
import {  Repository } from 'typeorm';
import { calcularValores } from 'src/util/calculo_extorno';
import { FindParamsSaque, SaqueDto, SaquePrestDto } from 'src/saque/saque.dto';
import { formatDates } from 'src/util/formatStarDateEndDate';

@Injectable()
export class RequisicaoService {
  constructor(
    @InjectRepository(Requisicao_Entity, 'mysqlConnection')
    private requisicaoRepository: Repository<Requisicao_Entity>,
  ) {}

  async findAll(params: FindParamsSaque): Promise<any[]> {
    try {
      const chapa = params.CHAPA;

      const query = this.requisicaoRepository
        .createQueryBuilder('re')
        .select([
          're.REQ_ID_CODIGO',
          'ur.CHAPA',
          'MAX(re.REQ_DTSAIDA) as REQ_DTSAIDA',
          'MAX(re.REQ_HSAIDA) as REQ_HSAIDA', 
          'MAX(re.REQ_DTREQ) as REQ_DTREQ',
          'MAX(re.REQ_HRET) as REQ_HRET',
          'MAX(re.REQ_MOTIVO) as REQ_MOTIVO',
          'MAX(re.REQ_KM) as REQ_KM',
          'MAX(re.REQ_STATUS) as REQ_STATUS',
          'MAX(re.REQ_PACOTE) as REQ_PACOTE',
          'MAX(re.REQ_GOVERNADOR) as REQ_GOVERNADOR',
          'MAX(ds.DES_LOCAL) as DES_LOCAL',
          'MAX(ds.MUN_ID_CODIGO) as MUN_ID_CODIGO',         
          'MAX(sa.SQE_ID_CODIGO) as SQE_ID_CODIGO',
          'MAX(sa.SQE_DTPEDIDO) as SQE_DTPEDIDO',
          'MAX(sa.SQE_DTPREST) as SQE_DTPREST',
          'MAX(sa.SQE_DTSAQUE) as SQE_DTSAQUE',
          'MAX(sa.SQE_VLSAQUE) as SQE_VLSAQUE',
          'MAX(sa.SQE_VLPREST) as SQE_VLPREST',
          'MAX(st.STS_DESCRICAO) as STS_DESCRICAO',
          'MAX(pp.NOME) as NOME',
          'MAX(ti.TDE_DESCRICAO) as TDE_DESCRICAO',
        ])
        
        .distinct(true)
        .leftJoin('s001_destino', 'ds', 're.REQ_ID_CODIGO = ds.REQ_ID_CODIGO')       
        .leftJoin('s001_usureq', 'ur', 're.REQ_ID_CODIGO = ur.REQ_ID_CODIGO')
        .leftJoin('ppessoa', 'pp', 'ur.chapa = pp.CODUSUARIO')
        .leftJoin('s000_regional', 'rg', 're.REG_ID_CODIGO = rg.REG_ID_CODIGO  ')
        .leftJoin('s009_reqnumerario', 'rn', 're.req_id_codigo = rn.req_id_codigo')
        .leftJoin('s009_saque', 'sa', 'rn.SQE_ID_CODIGO = sa.SQE_ID_CODIGO')
        .leftJoin('s009_status', 'st', 'sa.STS_ID_CODIGO = st.STS_ID_CODIGO')
        .leftJoin('s009_itensreqrec', 'it', 'sa.ITE_ID_CODIGO = it.ITE_ID_CODIGO')
        .leftJoin('s009_tipodesp', 'ti', 'it.TDE_ID_CODIGO = ti.TDE_ID_CODIGO')
        .where('ur.chapa = :chapa', { chapa })
        .andWhere('it.STS_ID_CODIGO = :statusCodigo', { statusCodigo: 7 })
        .groupBy('re.REQ_ID_CODIGO');

      // Aplicação de filtros
      if (params.REQ_ID_CODIGO) {
        query.andWhere('re.REQ_ID_CODIGO = :REQ_ID_CODIGO', {
          REQ_ID_CODIGO: params.REQ_ID_CODIGO,
        });
      }
      if (params.SQE_ID_CODIGO) {
        query.andWhere('sa.SQE_ID_CODIGO = :SQE_ID_CODIGO', {
          SQE_ID_CODIGO: params.SQE_ID_CODIGO,
        });
      }
      if (params.STS_DESCRICAO) {
        query.andWhere('st.STS_DESCRICAO = :STS_DESCRICAO', {
          STS_DESCRICAO: params.STS_DESCRICAO,
        });
      }
      if (params.REQ_STATUS) {
        query.andWhere('re.REQ_STATUS = :REQ_STATUS', { REQ_STATUS: params.REQ_STATUS });
      }

      if (params.startDate && params.endDate) {
        const prestDate = params.usePrestDate === 'true';
        const dataColumn = prestDate ? 'sa.SQE_DTPREST' : 'sa.SQE_DTSAQUE';
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

// VL_COMPLEMENTAR - Não está na query. O valor parece estar sendo calculado no código (calc.VL_COMPLEMENTAR).
// VL_EXTORNO - Não está sendo extraído na query, mas está sendo usado no retorno.


// TRA_DESCRICAO - Também está ausente na query.

// NME_MUNIC - Ausente na query.
// REG_DESCRICAO - Não aparece na query.
// MUN_CIDADE - Não está sendo extraído.
// REQ_DTRET - A query só está selecionando MAX(re.REQ_DTSAIDA), mas não REQ_DTRET.
// REQ_INTEGRAL - Ausente na query.
// REQ_PARCIAL - Não aparece na query.
// CTR_STATUS - Não está sendo selecionado na query.
// ITI_DTSAIDA - Não está sendo extraído.
// ITI_HSAIDA - Também não está na query.
// ITI_DTCHEGADA - Ausente na query.
// ITI_HCHEGADA - Não está sendo selecionado.
// INTREAL - Não está presente na query.
// PARREAL - Não aparece na query.
// VLINTEGRAL - Ausente na query.
// VLPARCIAL - Não está sendo extraído.
// VLBASE - Também não está presente na query.
// VLPREST - Já está na query, mas o retorno inclui MAX(sa.SQE_VLPREST) que precisa ser mapeado corretamente.
// VLCOMPLEMENTAR - Não está sendo selecionado.
// VLDIARIA - Não aparece na query.
// PORCDIARIA - Também está ausente.

      // Processar resultados
      let result = consulta.map((item) => {
        const calc = calcularValores(item.SQE_VLSAQUE, item.SQE_VLPREST);
        const STATUS = item.SQE_DTPREST ? 'Realizada' : 'Pendente';

        
          return new SaquePrestDto({
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
            TIPO_DESPESA: item.TIPO_DESPESA,
            TRA_DESCRICAO: item.TRA_DESCRICAO,
            TIPO_SAQUE: item.TIPO_SAQUE,
            NME_MUNIC: item.NME_MUNIC,
            REG_DESCRICAO: item.REG_DESCRICAO,
            MUN_CIDADE: item.MUN_CIDADE,
            DES_LOCAL: item.DES_LOCAL,
            REQ_DTSAIDA: item.REQ_DTSAIDA,
            REQ_DTRET: item.REQ_DTRET,
            REQ_HSAIDA: item.REQ_HSAIDA,
            REQ_HRET: item.REQ_HRET,
            REQ_INTEGRAL: item.REQ_INTEGRAL,
            REQ_PARCIAL: item.REQ_PARCIAL,
            REQ_PACOTE: item.REQ_PACOTE,
            REQ_GOVERNADOR: item.REQ_GOVERNADOR,
            REQ_MOTIVO: item.REQ_MOTIVO,
            CTR_STATUS: item.CTR_STATUS,
            ITI_DTSAIDA: item.ITI_DTSAIDA,
            ITI_HSAIDA: item.ITI_HSAIDA,
            ITI_DTCHEGADA: item.ITI_DTCHEGADA,
            ITI_HCHEGADA: item.ITI_HCHEGADA,
            INTREAL: item.INTREAL,
            PARREAL: item.PARREAL,
            VLINTEGRAL: item.VLINTEGRAL,
            VLPARCIAL: item.VLPARCIAL,
            VLBASE: item.VLBASE,
            VLPREST: item.VLPREST,
            VLCOMPLEMENTAR: item.VLCOMPLEMENTAR,
            VLEXTORNO: item.VLEXTORNO,
            VLDIARIA: item.VLDIARIA,
            PORCDIARIA: item.PORCDIARIA,
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
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
