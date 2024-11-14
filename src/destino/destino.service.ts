import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { destinoEntity } from '../database/db_oracle/entities/destino.entity';
import { Repository } from 'typeorm';


@Injectable()
export class destinoService {
  constructor(
    @InjectRepository(destinoEntity, 'oracleConnection')
    private destinoRepository: Repository<destinoEntity>,
  ) {}  

  async findOne(REQ_ID_CODIGO: number): Promise<destinoEntity> {
    try {
      return await this.destinoRepository.findOneOrFail({
        where: {REQ_ID_CODIGO},
      });
    } catch (error) {
      throw new HttpException(`Destina da requisição: ${REQ_ID_CODIGO} não foi encontrado `, HttpStatus.NOT_FOUND);
    }
  }
 
}
