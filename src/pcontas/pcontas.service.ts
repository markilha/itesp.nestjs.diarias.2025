import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { pcontasEntity } from '../database/db_oracle/entities/pcontas.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { createPcontasDto, FindAllParams, FindLancDocParams, pcontasDto } from './pcontasDto';
import { pcontasnumEntity } from '../database/db_oracle/entities/pcontasnum';
import { SaqueService } from '../saque/saque.service';
import { DataUtils } from '../util/DataUtils';
import { ReqnumerarioService } from '../reqnumerario/reqnumerario.service';
import { ndocumentoService } from '../ndocumento/ndocumento.service';
import { AuthUserDto } from '../auth/use.auth.Dto';
import { selecionaExtPrestContasNum } from '../util/selects/prestacao';
import { selecionaPrestPendenteView } from '../util/selects/saques';
import { getPaginatedQuery } from '../util/paginacao/paginaQuery';

@Injectable()
export class PcontasService {
  constructor(
    @InjectRepository(pcontasEntity, 'oracleConnection')
    private pcontasRepository: Repository<pcontasEntity>,
    private reqnumerarioService: ReqnumerarioService,
    private ndocumentoService: ndocumentoService,
    @Inject(forwardRef(() => SaqueService))
    private saqueService: SaqueService,

    @InjectRepository(pcontasnumEntity, 'oracleConnection')
    private readonly pcontasnumRepository: Repository<pcontasnumEntity>,
  ) {}

  async findAll(params: FindAllParams): Promise<pcontasDto[]> {
    try {
      const pageNumber = params.page ?? 1;
      const pageSize = params.limit ?? 500;
      const startRow = (pageNumber - 1) * pageSize + 1;
      const endRow = pageNumber * pageSize;

      const searchParams: FindOptionsWhere<pcontasDto> = {};
      if (params.PCO_ID_CODIGO) {
        searchParams['PCO_ID_CODIGO'] = Number(params.PCO_ID_CODIGO);
      }

      const queryBuilder = this.pcontasRepository
        .createQueryBuilder('r')
        .select([
          'r.PCO_ID_CODIGO as PCO_ID_CODIGO',
          'r.PCO_TIPO as PCO_TIPO',
          'r.PCO_TOTDOC as PCO_TOTDOC',
        ])
        .where(searchParams);

      const paginatedQuery = getPaginatedQuery(queryBuilder, startRow, endRow);
      const parameters = Object.values(queryBuilder.getParameters());
      const result = await this.pcontasRepository.query(paginatedQuery, parameters);

      return result;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Não foi possível buscar os pcontas',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async selecionaPrestPendente(): Promise<pcontasDto[]> {
    try {
      const prestPendente = await this.pcontasRepository.query(selecionaPrestPendenteView);
      return prestPendente;
    } catch (error) {
      throw new HttpException(
        'Erro ao buscar as prestações de conta pendentes',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
 
  async findOne(PCO_ID_CODIGO: number): Promise<pcontasDto> {
    try {
      const result = await this.pcontasRepository
        .createQueryBuilder('r')
        .where('r.PCO_ID_CODIGO = :codigo', { codigo: PCO_ID_CODIGO })
        .maxExecutionTime(10000)
        .cache(false)
        .getOne();

      if (!result) {
        throw new HttpException('Não encontrou nenhum registro', HttpStatus.NOT_FOUND);
      }
      return result;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error('Erro ao buscar registro:', error);

      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async lastid(): Promise<number> {
    try {
      const lastIdResult = await this.pcontasRepository.query(
        `SELECT MAX(PCO_ID_CODIGO) as lastId FROM S009_PCONTAS`,
      );
      return lastIdResult[0]?.LASTID || 0;
    } catch (error) {
      throw new HttpException('Erro ao buscar o último ID', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async createPcontas(
    params: createPcontasDto,
    users: AuthUserDto,
  ): Promise<{ PCO_ID_CODIGO: number }> {
    await this.saqueService.findOne(params.SQE_ID_CODIGO);

    const newId = (await this.lastid()) + 1;

    const pcontas = {
      PCO_ID_CODIGO: newId,
      PCO_TIPO: 'N',
      PCO_TOTDOC: 1,
    };

    await this.pcontasRepository.insert(pcontas);

    const rnuIdCodigo = await this.pcontasRepository.query(
      `SELECT RNU_ID_CODIGO FROM S009_REQNUMERARIO WHERE SQE_ID_CODIGO = :sqeIdCodigo`,
      [params.SQE_ID_CODIGO],
    );

    await this.reqnumerarioService.updateChegada({
      RNU_ID_CODIGO: rnuIdCodigo[0]?.RNU_ID_CODIGO,
      RNU_INTREAL: params.INTREAL,
      RNU_PARREAL: params.PARREAL,
    });

    await this.pcontasnumRepository.insert({
      PCO_ID_CODIGO: newId,
      RNU_ID_CODIGO: rnuIdCodigo[0]?.RNU_ID_CODIGO,
    });

    await this.ndocumentoService.create({
      NDO_ID_CODIGO: await this.ndocumentoService.lastId(),
      PCO_ID_CODIGO: newId,
      PES_ID_CODIGO: 2227,
      PES_PESSOA: 'J',
      NDO_ID_NUMERO: 'S/DOCUM',
      NDO_DATA: new Date(),
      NDO_SERIE: null,
      NDO_TITULO: null,
      NDO_DTENTREGA: DataUtils.formatarDataAtualString(),
      NDO_OPERADOR: users.chapa,
      STS_ID_CODIGO: 12,
    });

    return { PCO_ID_CODIGO: newId };
  }

  async create(pcontasDto: pcontasEntity): Promise<pcontasEntity> {
    try {
      const pc = this.pcontasRepository.create(pcontasDto);
      await this.pcontasRepository.save(pc);
      return pc;
    } catch (error) {
      throw new HttpException(
        'Não foi possível criar a prestação de conta',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async documentosLancados(
    params: FindLancDocParams,
    user: AuthUserDto,
  ): Promise<boolean | { message: string }> {
    try {
      const prestPendente = await this.selecionaPrestPendente();
      if (prestPendente.length > 0) {
        const selecionapcontas: pcontasDto = await this.findOne(params.PCO_ID_CODIGO);

        if (selecionapcontas.PCO_TIPO === 'N') {
          const stringExtPrest = `${selecionaExtPrestContasNum} Where SQE_ID_CODIGO=:SAQUE `;
          const selecionaextprestcontasNum = await this.pcontasnumRepository.query(stringExtPrest, [
            params.SQE_ID_CODIGO,
          ]);
          if (!(selecionaextprestcontasNum.NDO_DTENTREGA === '')) {
            return true;
          } else {
            return false;
          }
        }
      } else {
        return { message: 'Não existem mais prestaçăo de contas com documentos pendentes' };
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
