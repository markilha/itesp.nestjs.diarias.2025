import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsuReqEntity } from 'src/database/db_mysql/entities/usureq.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { UsureqDto } from './usureqDto';
import { formatDateToYYMM } from 'src/util/formatoYYMM';
import { logger } from 'src/util/savelogs/SaveLogs';
import { calcularDiariaValores } from 'src/util/calculo_dia_retorno';
import { calcularSalario50 } from 'src/util/variaveis/calculo_50';
import { verificarDestino } from 'src/util/verificaDestino';
import { Destino } from 'src/util/diariaDto';
import { UfespService } from 'src/ufesp/ufesp.service';
import { SaquesMesService } from 'src/saques-mes/saques-mes.service';
import { DespesadiariaService } from 'src/despesadiaria/despesadiaria.service';
import { FuncsalarioService } from 'src/funcsalario/funcsalario.service';
import { DiariaviagemService } from 'src/diariaviagem/diariaviagem.service';

@Injectable()
export class UsureqService {
  constructor(
    @InjectRepository(UsuReqEntity, 'mysqlConnection')
    private usureqRepository: Repository<UsuReqEntity>,

    private ufespService: UfespService,
    private SaquesMesService: SaquesMesService,
    private FuncSalarioService: FuncsalarioService,
    private despesaDiariaService: DespesadiariaService,
    private diariaviagemService: DiariaviagemService
  ) {}

  // async findAll(params: any): Promise<UsureqDto[]> {
  //   const query = this.usureqRepository.createQueryBuilder('usu');
  //   const { CHAPA } = params;

  //   query
  //     .select([
  //       'usu.CHAPA as CHAPA',
  //       're.REQ_ID_CODIGO as REQ_ID_CODIGO',
  //       're.REQ_DTSAIDA as REQ_DTSAIDA',
  //       're.REQ_HSAIDA as REQ_HSAIDA',
  //       're.REQ_DTRET as REQ_DTRET',
  //       're.REQ_DTREQ as REQ_DTREQ',
  //       're.REQ_MOTIVO as REQ_MOTIVO',
  //       're.REQ_HRET as REQ_HRET',
  //       're.REQ_KM as REQ_KM',
  //       're.REQ_STATUS as REQ_STATUS',
  //       're.REQ_DIARIA as REQ_DIARIA',
  //       're.REQ_INTEGRAL as REQ_INTEGRAL',
  //       're.REQ_PARCIAL as REQ_PARCIAL',
  //       're.REQ_ESPECIAL as REQ_ESPECIAL',
  //       're.REQ_PACOTE as REQ_PACOTE',
  //       're.REQ_GOVERNADOR as REQ_GOVERNADOR',
  //       're.TRA_ID_CODIGO as TRA_ID_CODIGO',
  //       'reg.REG_DESCRICAO as REG_DESCRICAO',
  //       'tr.TRA_DESCRICAO as TRA_DESCRICAO',
  //       'de.DES_LOCAL as DES_LOCAL',
  //       'de.MUN_ID_CODIGO as MUN_ID_CODIGO',
  //       'mu.MUN_CIDADE as MUN_CIDADE',
  //       'pp.nome as nome',
  //       're.REQ_DTSAIDA as REQ_DTSAIDA',
  //       'MAX(sa.SQE_ID_CODIGO) as SQE_ID_CODIGO',
  //       'MAX(it.ITE_ID_CODIGO) as ITE_ID_CODIGO',
  //     ])
  //     .innerJoin(tabs.ppessoa, 'pp', 'usu.CHAPA = pp.CODUSUARIO')
  //     .innerJoin(tabs.s001_requisicao, 're', 'usu.REQ_ID_CODIGO = re.REQ_ID_CODIGO')
  //     .innerJoin(tabs.s000_regional, 'reg', 're.REG_ID_CODIGO = reg.REG_ID_CODIGO')
  //     .innerJoin(tabs.S001_TRANSMEIO, 'tr', 're.TRA_ID_CODIGO = tr.TRA_ID_CODIGO')
  //     .innerJoin(tabs.s001_destino, 'de', 're.REQ_ID_CODIGO = de.REQ_ID_CODIGO')
  //     .innerJoin(tabs.s001_munic_detran, 'mu', 'de.MUN_ID_CODIGO = mu.MUN_ID_CODIGO')
  //     .innerJoin(tabs.s009_reqnumerario, 'nu', 're.REQ_ID_CODIGO = nu.REQ_ID_CODIGO')
  //     .innerJoin(tabs.s009_saque, 'sa', 'nu.SQE_ID_CODIGO = sa.SQE_ID_CODIGO')
  //     .innerJoin(tabs.s009_itensreqrec, 'it', 'sa.ITE_ID_CODIGO = it.ITE_ID_CODIGO')

  //     .groupBy('usu.CHAPA')
  //     .addGroupBy('usu.REQ_ID_CODIGO')
  //     .addGroupBy('pp.nome')
  //     .addGroupBy('re.REQ_DTSAIDA')
  //     .addGroupBy('re.REQ_HSAIDA')
  //     .addGroupBy('re.REQ_DTRET')
  //     .addGroupBy('re.REQ_MOTIVO')
  //     .addGroupBy('re.REQ_HRET')
  //     .addGroupBy('re.REQ_KM')
  //     .addGroupBy('re.REQ_STATUS')
  //     .addGroupBy('re.REQ_DIARIA')
  //     .addGroupBy('re.REQ_INTEGRAL')
  //     .addGroupBy('re.REQ_PARCIAL')
  //     .addGroupBy('re.REQ_ESPECIAL')
  //     .addGroupBy('re.REQ_PACOTE')
  //     .addGroupBy('re.REQ_GOVERNADOR')
  //     .addGroupBy('re.TRA_ID_CODIGO')
  //     .addGroupBy('re.REQ_DTREQ')
  //     .addGroupBy('tr.TRA_DESCRICAO')
  //     .addGroupBy('de.DES_LOCAL')
  //     .addGroupBy('mu.MUN_CIDADE')
  //     .addGroupBy('mu.MUN_ID_CODIGO')
  //     .addGroupBy('reg.REG_DESCRICAO')
  //     .addGroupBy('sa.SQE_ID_CODIGO');

  //   if (params.CHAPA) {
  //     query.andWhere('usu.CHAPA = :CHAPA', { CHAPA: params.CHAPA });
  //   }

  //   if (params.REQ_ID_CODIGO) {
  //     query.andWhere('re.REQ_ID_CODIGO = :REQ_ID_CODIGO', { REQ_ID_CODIGO: params.REQ_ID_CODIGO });
  //   }
  //   if (params.SQE_ID_CODIGO) {
  //     query.andWhere('sa.SQE_ID_CODIGO = :SQE_ID_CODIGO', { SQE_ID_CODIGO: params.SQE_ID_CODIGO });
  //   }

  //   const consulta = await query.getRawMany();
  //   console.log(consulta);

  //   const results = await Promise.all(consulta.map((req) => this.processRequisicao(req)));

  //   return results;
  // }

  async findAll(params: any): Promise<any[]> {
    const searchParams: FindOptionsWhere<UsuReqEntity> = {};

    if (params.CHAPA) {
      searchParams['CHAPA'] = params.CHAPA;
    }
    if (params.REQ_ID_CODIGO) {
      searchParams['REQ_ID_CODIGO'] = params.REQ_ID_CODIGO;
    }

    const consulta = await this.usureqRepository.find({
      where: searchParams,
      relations: [
        'requisicao',
        'funcsalario',
        'destino',
        'destino.municipio',
        'requisicao.transmeio',
      ],
    });

    const results = await Promise.all(consulta.map((req) => this.processRequisicao(req)));
    return results;
  }

  private async processRequisicao(req: UsuReqEntity): Promise<UsureqDto> {
    try {
      let saqueSalario = null;
      let saqueMes = null;
      let salarioAtual = null;
      let codigoUfesp = null;
      let salario50PorcentoNumber = null;
      let destino = null;
      let saldoRestante = null;
      let UFESP = null;

      // Busca o valor da UFESP na data da requisição
      try {
        UFESP = (await this.ufespService.findValueByDate(req.requisicao?.reqDtSaida)).ufeValor || 0;
      } catch (error) {
        logger.error(`Erro ao buscar valor da ufesp (${req.CHAPA}): `, error);
      }

      try {
        const formatoYYMM = formatDateToYYMM(req.requisicao?.reqDtSaida);
        saqueSalario = await this.SaquesMesService.findOne(req.CHAPA, formatoYYMM);
        saqueMes = Number(saqueSalario?.totSaque) || 0;
      } catch (error) {
        logger.error(`Erro ao buscar saque do mês para chapa (${req.CHAPA}): `, error);
      }

     

      try {
        const UFESPcargo = await this.despesaDiariaService.findOne(req.funcsalario.cargo);
        codigoUfesp = Number(UFESPcargo?.dtdValorMax) || 0;

        salarioAtual = Number(req?.funcsalario?.salario) || 0;
        salario50PorcentoNumber = calcularSalario50(salarioAtual);
      } catch (error) {
        logger.error(`Erro ao buscar dados do funcionário (${req.CHAPA}): `, error);
      }

      try {
        destino = verificarDestino(req.destino.munIdCodigo) as Destino;
      } catch (error) {
        logger.error(`Erro ao buscar municipio de destino (${req.CHAPA}): `, error);
      }     

      // Cálculo das diárias
      const diarias = calcularDiariaValores(
        UFESP,
        codigoUfesp,
        destino,
        Number(req.requisicao?.reqPacote) || 0,
        Number(req.requisicao?.reqIntegral) || 0,
        Number(req.requisicao?.reqParcial) > 0 ? 1 : 0,
        req.requisicao?.reqHRet,
      );

      if (req.funcsalario) {
        saldoRestante = salario50PorcentoNumber - (saqueMes + (diarias?.VL_DIARIA_TOTAL || 0));
        saldoRestante = parseFloat(saldoRestante.toFixed(2)) || 0;
      }

    

      return new UsureqDto({
        reqIdCodigo: req.REQ_ID_CODIGO,
        // sqeidcodigo: req.SQE_ID_CODIGO,
        // iteidcodigo: req.ITE_ID_CODIGO,
        nome: req.funcsalario?.nome,
        chapa: req.CHAPA,
        reqDtReq: req.requisicao?.reqDtReq,
        reqDtSaida: req.requisicao?.reqDtSaida,
        reqHSaida: req.requisicao?.reqHSaida,
        reqDtRetorno: req.requisicao?.reqDtRet,
        reqMotivo: req.requisicao?.reqMotivo,
        reqHRet: req.requisicao?.reqHRet,
        reqKm: req.requisicao?.reqKm,
        reqStatus: req.requisicao?.reqStatus,
        reqDiaria: req.requisicao?.reqDiaria,
        reqIntegral: req.requisicao?.reqIntegral,
        reqParcial: req.requisicao?.reqParcial,
        reqEspecial: req.requisicao?.reqEspecial,
        reqPacote: req.requisicao.reqPacote === 0 ? 'S' : 'N',
        reqGovernador: req.requisicao?.reqGovernador,
        traDescricao: req.requisicao?.transmeio?.traDescricao,
        desLocal: req.destino?.desLocal,
        desMunNme: req.destino?.municipio?.munCidade,
        desMunIdCodigo: req.destino?.municipio?.munIdCodigo,
        regDescricao: req.requisicao?.regIdCodigo,
        diariaIntegral: diarias?.VL_DIARIA_INTEGRAL || 0,
        diariaParcial: diarias?.VL_DIARIA_PARCIAL || 0,
        diariaBase: diarias?.VL_DIARIA_BASE || 0,
        saqueMes: saqueMes,
        valorSolicitado: diarias?.VL_DIARIA_TOTAL || 0,
        salario50Porcento: salario50PorcentoNumber,
        saldoDisponivel: saldoRestante,
        diariaParcPorc: diarias?.PARPERC || 0,
        vlDiaria: diarias?.VL_DIARIA || 0,
        
      });
    } catch (error) {
      console.warn(`Erro ao buscar saque do mês para chapa ${req.CHAPA}:`, error);
      logger.error(`REQUISIÇÃO : ${req.REQ_ID_CODIGO}`, error);
    }
  }
}
