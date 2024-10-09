import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  CreateSaqueDto,
  FindAllParams,
  FindParamsSaque,
  InsS009SaqueDto,
  RetNumSaque,
  SaqueDto,
  SaqueResultDto,
  SolitarDto,
} from './saque.dto';

import { SaqueEntity } from 'src/database/db_mysql/entities/saque.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { DiariaviagemService } from 'src/diariaviagem/diariaviagem.service';

@Injectable()
export class SaqueService {
  constructor(
    @InjectRepository(SaqueEntity, 'mysqlConnection')
    private saqueRepository: Repository<SaqueEntity>,
    private diariaviagemService: DiariaviagemService,
  ) {}

  async findAll(params: FindParamsSaque): Promise<any> {
    try {
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
        ])
        .innerJoin(
          's009_reqnumerario',
          'b',
          'a.SQE_ID_CODIGO = b.SQE_ID_CODIGO',
        )
        .innerJoin('s009_itensreqrec', 'c', 'a.ITE_ID_CODIGO = c.ITE_ID_CODIGO')    
        .innerJoin('s001_requisicao', 'd', 'd.REQ_ID_CODIGO = b.REQ_ID_CODIGO')       
        .innerJoin('s009_status', 'e', 'e.STS_ID_CODIGO = a.STS_ID_CODIGO')
        .innerJoin('s009_tipodesp', 'f', 'f.TDE_ID_CODIGO = c.TDE_ID_CODIGO')
        .groupBy('a.SQE_ID_CODIGO')
        .addGroupBy('c.RRE_ID_CODIGO')        
        .addGroupBy('c.CHAPA')
        .addGroupBy('a.SQE_DTSAQUE')
        .addGroupBy('a.SQE_VLSAQUE')
        .addGroupBy('a.SQE_DTPREST')
        .addGroupBy('e.STS_DESCRICAO') 
        .addGroupBy('b.REQ_ID_CODIGO')   
        .addGroupBy('d.REQ_STATUS')      
        .addGroupBy('f.TDE_DESCRICAO');

        // Aplicar filtro condicional para 'SQE_ID_CODIGO', caso seja fornecido
        if (params.SQE_ID_CODIGO) {
         query.andWhere('a.SQE_ID_CODIGO = :SQE_ID_CODIGO', {
           SQE_ID_CODIGO: params.SQE_ID_CODIGO,
         });
       }
      // Aplicar filtro condicional para 'chapa', caso seja fornecido nos parâmetros
      if (params.CHAPA) {
        query.andWhere('c.CHAPA = :CHAPA', { CHAPA: params.CHAPA });
      }
      // Aplicar filtro condicional para 'REQ_ID_CODIGO', caso seja fornecido
      if (params.REQ_ID_CODIGO) {
        query.andWhere('b.REQ_ID_CODIGO = :REQ_ID_CODIGO', {
          REQ_ID_CODIGO: params.REQ_ID_CODIGO,
        });
      }
     
      // Aplicar filtro condicional para 'STS_DESCRICAO', caso seja fornecido
      if (params.STS_DESCRICAO) {
        query.andWhere('e.STS_DESCRICAO = :STS_DESCRICAO', {
          STS_DESCRICAO: params.STS_DESCRICAO,
        });
      }
        // Aplicar filtro condicional para 'STS_DESCRICAO', caso seja fornecido
        if (params.REQ_STATUS) {
          query.andWhere('d.REQ_STATUS = :REQ_STATUS', {
            REQ_STATUS: params.REQ_STATUS,
          });
        }

      
      // Aplicar a ordenação
    if (params.orderBy) {
      query.orderBy(params.orderBy, params.orderDirection === 'DESC' ? 'DESC' : 'ASC');
    } else {
      query.orderBy('a.SQE_ID_CODIGO', 'ASC'); // Ordenação padrão
    }


      const result = await query.getRawMany();
      return result;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
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

  async solicitarSaque(params: SolitarDto): Promise<RetNumSaque> {
    const diariaViagem = await this.diariaviagemService.findOne(
      params.reqIdCodigo,
      params.chapa,
    );

    if (!diariaViagem) {
      throw new HttpException(
        'Diária de viagem não encontrada',
        HttpStatus.NOT_FOUND,
      );
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
