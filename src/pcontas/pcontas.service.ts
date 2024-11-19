import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { pcontasEntity } from '../database/db_oracle/entities/pcontas.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { createPcontasDto, FindAllParams, pcontasDto } from './pcontasDto';
import { pcontasnumEntity } from '../database/db_oracle/entities/pcontasnum';
import { reembolsoService } from '../reembolso/reembolso.service';
import { extornoService } from '../extorno/extorno.service';
import { extornoDto } from '../extorno/extornoDto';
import { SaqueService } from '../saque/saque.service';
import { DataUtils } from '../util/DataUtils';
import { ReqnumerarioService } from '../reqnumerario/reqnumerario.service';

@Injectable()
export class PcontasService {
  constructor(
    @InjectRepository(pcontasEntity, 'oracleConnection')
    private pcontasRepository: Repository<pcontasEntity>,
    private reembolsosService: reembolsoService,
    private extornoService: extornoService,
    private saqueService: SaqueService,
    private reqnumerarioService: ReqnumerarioService,

    @InjectRepository(pcontasnumEntity, 'oracleConnection')
    private readonly pcontasnumRepository: Repository<pcontasnumEntity>,
  ) {}

  async findAll(params: FindAllParams): Promise<pcontasDto[]> {
    try {
      const searchParams: FindOptionsWhere<pcontasDto> = {};
      if (params.PCO_ID_CODIGO) {
        searchParams['PCO_ID_CODIGO'] = Number(params.PCO_ID_CODIGO);
      }

      if (params.page && params.limit) {
        const page = params.page;
        const limit = params.limit;
        const skip = (page - 1) * limit;

        return await this.pcontasRepository.find({
          where: searchParams,
          skip,
          take: limit,
        });
      }

      return await this.pcontasRepository.find({
        where: searchParams,
      });
    } catch (error) {      
      throw new HttpException(
        'Não foi possível as prestações de conta',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(PCO_ID_CODIGO: number): Promise<pcontasDto> {
    try {
      return await this.pcontasRepository.findOne({
        where: {
          PCO_ID_CODIGO,
        },
      });
    } catch (error) {
      throw new HttpException(
        'Não foi possível as prestações de conta',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createPcontas(params: createPcontasDto): Promise<{ PCO_ID_CODIGO: number }> {
    // se não encontrar SQE_ID_CODIGO, retorna erro
    const saque = await this.saqueService.findOne(params.SQE_ID_CODIGO);

    //verifica se o reembolso existe
    if (params.TOTALCOMPLEMENTAR > 0) {
      const reembolso = await this.reembolsosService.findone(params.SQE_ID_CODIGO);
      if (!reembolso) {
        throw new HttpException('Reembolso não encontrado', HttpStatus.NOT_FOUND);
      }
    }

    const lastIdResult = await this.pcontasRepository.query(
      `SELECT MAX(PCO_ID_CODIGO) as lastId FROM S009_PCONTAS`,
    );
    const lastId = lastIdResult[0]?.LASTID || 0;
    const newId = lastId + 1;

    const pcontas = {
      PCO_ID_CODIGO: newId,
      PCO_TIPO: params.PCO_TIPO,
      PCO_TOTDOC: params.PCO_TOTDOC,
    };

    const insertResult = await this.pcontasRepository.insert(pcontas);
    const pcoIdCodigo = insertResult.identifiers[0].PCO_ID_CODIGO;

    const rnuIdCodigo = await this.pcontasRepository.query(
      `SELECT RNU_ID_CODIGO FROM S009_REQNUMERARIO WHERE SQE_ID_CODIGO = :sqeIdCodigo`,
      [params.SQE_ID_CODIGO],
    );

    await this.reqnumerarioService.updateChegada({
      RNU_ID_CODIGO: rnuIdCodigo[0]?.RNU_ID_CODIGO,
      RNU_INTREAL: params.INTREAL,
      RNU_PARREAL: params.PARREAL
    });

    await this.pcontasnumRepository.insert({
      PCO_ID_CODIGO: pcoIdCodigo,
      RNU_ID_CODIGO: rnuIdCodigo[0]?.RNU_ID_CODIGO,
    });

    // Atualiza a justificativa do reembolso
    if (params.TOTALCOMPLEMENTAR > 0) {
      await this.reembolsosService.atualizarJustificativa({
        SQE_ID_CODIGO: params.SQE_ID_CODIGO,
        RRE_JUSTIFICATIVA: params.JUSTIFICATIVA,
        RRE_SAQUE: params.SQE_ID_CODIGO,
      });
    }

    if (params.TOTALDEVOLUCAO > 0) {
      const newExtorno = new extornoDto({
        SQE_ID_CODIGO: saque.sqeIdCodigo,
        ITE_ID_CODIGO: saque.iteIdCodigo,
        RRE_ID_CODIGO: saque.rreIdCodigo,
        DIR_ID_CODIGO: saque.dirIdCodigo,
        PCO_ID_CODIGO: newId,
        FPA_ID_CODIGO: saque.fpaIdCodigo,
        EXT_VALOR: params.TOTALDEVOLUCAO,
        EXT_DATA: DataUtils.formatarDataAtualString(),
        EXT_JUSTIFICA: params.JUSTIFICATIVA,
      });
      await this.extornoService.create(newExtorno);
    }

    return { PCO_ID_CODIGO: pcoIdCodigo };
  }
 
}
