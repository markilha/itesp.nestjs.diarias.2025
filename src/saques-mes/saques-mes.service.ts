import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FindAllParams } from './saque-mesDto';
import { SaqueMesDto } from './saque-mesDto';
import { FindOptionsWhere, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SaqueMesEntity } from 'src/database/db_mysql/entities/saqueMes.entity';

@Injectable()
export class SaquesMesService {
  constructor(
    @InjectRepository(SaqueMesEntity, 'mysqlConnection')
    private saqueMes: Repository<SaqueMesEntity>,
  ) {}



  async findAll(params: FindAllParams): Promise<SaqueMesDto[]> {
    try {
      const searchParams: FindOptionsWhere<SaqueMesEntity> = {};

      if (params.chapa) {
        searchParams['chapa'] = params.chapa;
      }
   
      let saqueMesEntities: SaqueMesEntity[];

      if (params.page && params.limit) {
        const page = params.page;
        const limit = params.limit;
        const skip = (page - 1) * limit;

        saqueMesEntities = await this.saqueMes.find({
          where: searchParams,
          skip,
          take: limit,
        });
      } else {
        saqueMesEntities = await this.saqueMes.find({
          where: searchParams,
        });
      }     

      return saqueMesEntities.map((entity) => new SaqueMesDto(entity));
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  } 
 
  async somaMesAtual(chapa?: string, AnoMes?: string): Promise<number> {
    try {
      const query = this.saqueMes
        .createQueryBuilder('saque')
        .select('SUM(saque.totsaque)', 'total')
        .where('saque.messaque COLLATE utf8mb4_unicode_ci = :AnoMes', {
          AnoMes,
        });
      if (chapa) {
        query.andWhere('saque.chapa = :chapa', { chapa });
      }
      const result = await query.getRawOne();
      return parseFloat(result.total || '0');
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
