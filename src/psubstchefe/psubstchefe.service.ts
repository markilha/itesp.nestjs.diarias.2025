import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { psubstchefeEntity } from '../database/db_oracle/entities/psubstchefe.entity';
import { Repository } from 'typeorm';

@Injectable()
export class psubstchefeService {
  constructor(
    @InjectRepository(psubstchefeEntity, 'oracleConnection')
    private psubstchefeRepository: Repository<psubstchefeEntity>,
  ) {}

  async findAtual(CODSECAO: string): Promise<psubstchefeEntity> {
    try {
      const result = await this.psubstchefeRepository.findOne({
        where: { CODSECAO },
        order: { DATAINICIO: 'DESC' },
      });

      if (!result) {
        throw new HttpException('psubstchefe não encontrado', HttpStatus.NOT_FOUND);
      }

      return result;
    } catch (error) {
      throw new HttpException(
        'Erro ao buscar psubstchefe mais atual',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
