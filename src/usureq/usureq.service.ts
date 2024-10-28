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
import { ItinirarioService } from 'src/itinirario/itinirario.service';

@Injectable()
export class UsureqService {
  constructor(
    @InjectRepository(UsuReqEntity, 'mysqlConnection')
    private usureqRepository: Repository<UsuReqEntity>,

    private ufespService: UfespService,
    private SaquesMesService: SaquesMesService,    
    private despesaDiariaService: DespesadiariaService, 
    
  ) {}



 
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
