import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { psubstchefeEntity } from '../database/db_oracle/entities/psubstchefe.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { FindAllParams } from './psubstchefeDto';

@Injectable()
export class psubstchefeService {
  constructor(
    @InjectRepository(psubstchefeEntity, 'oracleConnection')
    private psubstchefeRepository: Repository<psubstchefeEntity>,
  ) {}

  async findAtual(parms: FindAllParams): Promise<psubstchefeEntity[]> {
    try {
      const searchParams: FindOptionsWhere<psubstchefeEntity> = {};

      if (parms.CODSECAO) {
        searchParams.CODSECAO = parms.CODSECAO || '';
      }
      if (parms.CHAPASUBST) {
        searchParams.CHAPASUBST = parms.CHAPASUBST || '';
      }

      const queryBuilder = this.psubstchefeRepository
        .createQueryBuilder('r')
        .select([
          'r.CODCOLIGADA AS "CODCOLIGADA"',
          'r.CODSECAO AS "CODSECAO"',
          'r.CHAPASUBST AS "CHAPASUBST"',
          'r.DATAINICIO AS "DATAINICIO"',
          'r.DATAFIM AS "DATAFIM"',
          'r.MASTER AS "MASTER"',
          'r.CODCOLSUBST AS "CODCOLSUBST"',
          'r.CHEFIAAPROVBAT AS "CHEFIAAPROVBAT"',
          'r.RECCREATEDBY AS "RECCREATEDBY"',
          'r.RECCREATEDON AS "RECCREATEDON"',
          'r.RECMODIFIEDBY AS "RECMODIFIEDBY"',
          'r.RECMODIFIEDON AS "RECMODIFIEDON"',
          'r.RECEBEEMAIL AS "RECEBEEMAIL"',
          'r.CODCOLIGADASOLICITANTE AS "CODCOLIGADASOLICITANTE"',
          'r.CHAPASOLICITANTE AS "CHAPASOLICITANTE"',
          'r.CODEXTERNOSOLICITANTE AS "CODEXTERNOSOLICITANTE"',
        ])
        .where(searchParams)
        .orderBy('r.DATAINICIO', 'DESC');

      const result = await queryBuilder.getRawMany();
      return result;
    } catch (error) {
      console.error('Erro ao buscar psubstchefes:', error);
      throw new HttpException('Erro ao buscar as requisições', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // async findAtual(CODSECAO: string): Promise<psubstchefeEntity> {
  //   try {
  //     const result = await this.psubstchefeRepository.findOne({
  //       where: { CODSECAO },
  //       order: { DATAINICIO: 'DESC' },
  //     });

  //     if (!result) {
  //       throw new HttpException('psubstchefe não encontrado', HttpStatus.NOT_FOUND);
  //     }
  //     return result;
  //   } catch (error) {
  //     throw new HttpException(
  //       'Erro ao buscar psubstchefe mais atual',
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //     );
  //   }
  // }
}
