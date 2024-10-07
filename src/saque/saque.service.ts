import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateSaqueDto, FindAllParams, InsS009SaqueDto, SaqueDto, SaqueResultDto, SolitarDto } from './saque.dto';

import { SaqueEntity } from 'src/database/db_mysql/entities/saque.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';

@Injectable()
export class SaqueService {
  constructor(
    @InjectRepository(SaqueEntity, 'mysqlConnection')
    private saqueRepository: Repository<SaqueEntity>,
  ) {}

  async findAll(params: FindAllParams): Promise<SaqueDto[]> {
    try {
      const searchParams: FindOptionsWhere<SaqueDto> = {};
  
      if (params.sqeIdCodigo) {
        searchParams['sqeIdCodigo'] = params.sqeIdCodigo;
      }
  
      if (params.stsIdCodigo) {
        searchParams['stsIdCodigo'] = params.stsIdCodigo;
      }
  
      const queryBuilder = this.saqueRepository.createQueryBuilder('saque')
        .leftJoinAndSelect('saque.status', 'status')
        .leftJoinAndSelect('saque.numerario', 'numerario');
  
      // Filtrar pela descrição do status, se fornecido
      if (params.stsDescricao) {
        queryBuilder.andWhere('status.stsDescricao = :statusDescricao', { statusDescricao: params.stsDescricao });
      }
  
      // Adicionar os outros filtros
      if (params.sqeIdCodigo) {
        queryBuilder.andWhere('saque.sqeIdCodigo = :sqeIdCodigo', { sqeIdCodigo: params.sqeIdCodigo });
      }
  
      if (params.stsIdCodigo) {
        queryBuilder.andWhere('saque.stsIdCodigo = :stsIdCodigo', { stsIdCodigo: params.stsIdCodigo });
      }
  
      // Paginação
      if (params.page && params.limit) {
        const page = params.page;
        const limit = params.limit;
        const skip = (page - 1) * limit;
  
        queryBuilder.skip(skip).take(limit);
      }
  
      return await queryBuilder.getMany();
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Não foi possível buscar os saques',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

 

  async findOne(codigo: number): Promise<SaqueDto> {
    try {
      return await this.saqueRepository.findOne({
        where: { sqeIdCodigo: codigo },
        relations: ['numerario', 'status'],
      });
    } catch (error) {
      throw new HttpException(
        'Não foi possível busca o cargo',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
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
      throw new HttpException(
        'Não foi possível criar o saque',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }


  async getSaqueData(chapa: string): Promise<SaqueResultDto[]> {
    const result = await this.saqueRepository
      .createQueryBuilder('a')
      .select([
        'a.SQE_ID_CODIGO',
        'c.RRE_ID_CODIGO',
        'b.RNU_ID_CODIGO',
        'b.RNU_DTINICIO',
        'c.CHAPA',
        'v.NOME',
        'b.REQ_ID_CODIGO',
        'a.SQE_VLSAQUE',
        'a.SQE_DTSAQUE',
        'a.SQE_EFETIVO',
        'a.STS_ID_CODIGO',
        's.STS_DESCRICAO',
        'a.SQE_VLPREST',
        'a.SQE_DTPEDIDO',
      ])
      .innerJoin('s009_reqnumerario', 'b', 'a.SQE_ID_CODIGO = b.SQE_ID_CODIGO')
      .innerJoin('s009_itensreqrec', 'c', 'a.ITE_ID_CODIGO = c.ITE_ID_CODIGO')
      .innerJoin('v009_funcsalario', 'v', 'c.CHAPA = v.CHAPA')
      .innerJoin('s009_status', 's', 'a.STS_ID_CODIGO = s.STS_ID_CODIGO')
      .where('c.CHAPA = :chapa', { chapa }) 
      .groupBy('c.RRE_ID_CODIGO')
      .addGroupBy('b.RNU_ID_CODIGO')
      .addGroupBy('c.CHAPA')
      .addGroupBy('v.NOME')
      .addGroupBy('b.REQ_ID_CODIGO')
      .addGroupBy('a.STS_ID_CODIGO')
      .addGroupBy('s.STS_DESCRICAO')     
      .getRawMany();
  
    return result as SaqueResultDto[];
  }



  // IN PAR1 VARCHAR(255), /* REEMBOLSO/COMPLEMENTO */
  // IN PAR2 VARCHAR(255), /* SEM RECURSO */
  // IN PAR3 VARCHAR(255), /* Tipo de despesa */
  // IN PAR4 INT, /* ITE_ID_CODIGO */
  // IN PAR5 INT, /* RRE_ID_CODIGO */
  // IN PAR6 INT, /* DIR_ID_CODIGO */
  // IN PAR7 DECIMAL(10,2), /* SQE_VLPREST */
  // IN PAR8 DATE, /* SQE_DTPREST */
  // IN PAR9 DECIMAL(10,2), /* SQE_VLSAQUE */
  // IN PAR10 VARCHAR(255), /* SQE_TIPOSAQUE */
  // IN PAR11 VARCHAR(255), /* SQE_EFETIVO */
  // IN PAR12 VARCHAR(255), /* SQE_TERCEIRO */
  // IN PAR13 INT, /* PES_ID_CODIGO */
  // IN PAR14 VARCHAR(255), /* PES_PESSOA */
  // IN PAR15 INT, /* STS_ID_CODIGO */
  // IN PAR16 VARCHAR(255), /* SQE_USUARIO */
  // IN PAR17 INT, /* REQ_ID_CODIGO */
  // IN PAR18 DATE, /* RNU_DTINICIO */
  // IN PAR19 TIME, /* RNU_HORAINICIO */
  // IN PAR20 DATE, /* RNU_DTFIM */
  // IN PAR21 TIME, /* RNU_HORAFIM */
  // IN PAR22 INT, /* RNU_INTPREV */
  // IN PAR23 INT, /* RNU_PARPREV */
  // IN PAR24 INT, /* RNU_INTREAL */
  // IN PAR25 INT, /* RNU_PARREAL */
  // IN PAR26 VARCHAR(255), /* RNU_PACOTE */
  // IN PAR27 VARCHAR(255), /* RNU_GOVERNADOR */
  // IN PAR28 VARCHAR(255), /* RRE_JUSTIFICATIVA */
  // IN PAR29 VARCHAR(255), /* REQ_STATUS */
  // IN PAR30 DECIMAL(10,2), /* RNU_VLINTEGRAL */
  // IN PAR31 DECIMAL(10,2), /* RNU_VLPARCIAL */
  // IN PAR32 DECIMAL(10,2), /* RNU_VLBASE */



  async solicitarSaque(params: SolitarDto): Promise<number> { 

    const valorSaque = (params.diariaIntegral + params.diariaParcial ) || 0;
   
    await this.saqueRepository.query(
      `CALL INS_S009_SAQUE(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @id);`,
      [
        'DIARIA', 'N',7, 1111111, 1111111, 5, null, null, valorSaque,
        'N', 'S', 'N', null, null, 1, null, params.reqIdCodigo, 
        params.reqDtSaida, params.reqHSaida, params.reqDtRetorno, params.reqHRet, params.reqIntegral, params.reqParcial, null, null, 
        params.reqPacote, params.reqGovernador, params.reqMotivo, params.reqStatus, params.diariaIntegral, params.diariaParcial, params.diariaBase
      ],
    );

    // Depois, pegamos o valor de @id com uma query separada
    const result = await this.saqueRepository.query(`SELECT @id as id`);

    // Retornamos o valor da variável @id
    return result[0].id;
  }
  

}










