import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { itensreqEntity } from '../database/db_oracle/entities/itensreq.entity';

@Injectable()
export class itensreqService {
  constructor(
    @InjectRepository(itensreqEntity, 'oracleConnection')
    private itensreqRepository: Repository<itensreqEntity>,
  ) {}

  async lastId(): Promise<number> {
    try {
      const lastIdResult = await this.itensreqRepository.query(
        `SELECT MAX(TDE_ID_CODIGO) as lastId FROM S009_ITENSREQREC`,
      );
      return lastIdResult[0]?.LASTID + 1 || 0;
    } catch (error) {
      throw new HttpException('Erro ao buscar último ID', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  //create
  async create(itensreqDto: itensreqEntity): Promise<itensreqEntity> {
    try {
      itensreqDto.ITE_ID_CODIGO = await this.lastId();
      return await this.itensreqRepository.save(this.itensreqRepository.create(itensreqDto));
    } catch (error) {
      console.log(error);
      throw new HttpException('Não foi possível criar item', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
