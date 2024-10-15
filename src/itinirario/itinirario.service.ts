import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ItinerarioEntity } from 'src/database/db_mysql/entities/itinerario.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { FindAllParams, ItinerarioDto } from './itinerarioDto';

@Injectable()
export class ItinirarioService {
  constructor(
    @InjectRepository(ItinerarioEntity, 'mysqlConnection')
    private readonly itinerarioRepository: Repository<ItinerarioEntity>,
  ) {}

  async findAll(params: FindAllParams): Promise<ItinerarioDto[]> {
    try {
      const searchParams: FindOptionsWhere<ItinerarioEntity> = {};

      if (params.REQ_ID_CODIGO) {
        searchParams['REQ_ID_CODIGO'] = params.REQ_ID_CODIGO;
      }

      if (params.page && params.limit) {
        const page = params.page;
        const limit = params.limit;
        const skip = (page - 1) * limit;

        return await this.itinerarioRepository.find({
          where: searchParams,
          skip,
          take: limit,
        });
      }

      return await this.itinerarioRepository.find({
        where: searchParams,
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findUltimo(reqIdCodigo: number): Promise<ItinerarioDto> {
    return this.itinerarioRepository
      .createQueryBuilder('itinerario')
      .select([
        'itinerario.ITI_ID_CODIGO',
        'itinerario.MUN_ID_CODIGO',
        'itinerario.ITI_LOCAL',
        'itinerario.ITI_DTSAIDA',
        'itinerario.ITI_HSAIDA',
        'itinerario.ITI_DTCHEGADA',
        'itinerario.ITI_HCHEGADA',
        'itinerario.ITI_KM',
      ])
      .where('itinerario.REQ_ID_CODIGO = :reqIdCodigo', { reqIdCodigo })
      .orderBy('itinerario.ITI_DTCHEGADA', 'DESC')
      .addOrderBy('itinerario.ITI_HCHEGADA', 'DESC')
      .limit(1)
      .getOne();
  }
}
