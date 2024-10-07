import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DiariaViagemEntity } from 'src/database/db_mysql/entities/diariaViagem';
import { FindOptionsWhere, Repository } from 'typeorm';
import { DiariaviagemDto, FindAllParams } from './diariaviagemDto';

@Injectable()
export class DiariaviagemService {
  constructor(
    @InjectRepository(DiariaViagemEntity, 'mysqlConnection')
    private diariaviagemRepository: Repository<DiariaViagemEntity>,
  ) {}

  async findAll(params: FindAllParams): Promise<DiariaviagemDto[]> {
    try {
      const searchParams: FindOptionsWhere<DiariaViagemEntity> = {};

      if (params.REQ_ID_CODIGO) {
        searchParams['REQ_ID_CODIGO'] = params.REQ_ID_CODIGO;
      }

      if (params.CHAPA) {
        searchParams['CHAPA'] = params.CHAPA;
      }
      // Configuração da ordenação baseada na query string
      const order: { [key: string]: 'ASC' | 'DESC' } = {};
      if (params.orderBy) {
        order[params.orderBy] =
          params.orderDirection === 'DESC' ? 'DESC' : 'ASC';
      } else {
        order['REQ_ID_CODIGO'] = 'ASC';
      }

      let diariaViagem: DiariaViagemEntity[];

      // Paginação
      if (params.page && params.limit) {
        const page = params.page;
        const limit = params.limit;
        const skip = (page - 1) * limit;

        diariaViagem = await this.diariaviagemRepository.find({
          where: searchParams,
          skip,
          take: limit,
          order,
        });
      } else {
        diariaViagem = await this.diariaviagemRepository.find({
          where: searchParams,
          order,
        });
      }
      return diariaViagem;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOne(requisicao: number, chapa: string): Promise<DiariaviagemDto> {
    try {
      return await this.diariaviagemRepository.findOneOrFail({
        where: { REQ_ID_CODIGO: requisicao, CHAPA: chapa },
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
