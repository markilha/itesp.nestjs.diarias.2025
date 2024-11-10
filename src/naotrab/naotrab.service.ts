import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { naotrabEntity } from '../database/db_oracle/entities/naotrab.entity';
import { FindOptionsWhere, Repository } from 'typeorm';


@Injectable()
export class naotrabService {
  constructor(
    @InjectRepository(naotrabEntity, 'oracleConnection')
    private naotrabRepository: Repository<naotrabEntity>,
  ) {}
 

  async findOne(REQ_ID_CODIGO: number) {
    try {
      return await this.naotrabRepository.findOneOrFail({
        where: { REQ_ID_CODIGO },
      });
    } catch (error) {   
      throw new HttpException('Horas não trabalhadas não encontrada', HttpStatus.NOT_FOUND);
    }
  }
}
