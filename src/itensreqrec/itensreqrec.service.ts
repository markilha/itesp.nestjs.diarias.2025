import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { itensreqrecEntity } from '../database/db_oracle/entities/itensreqrec.entity';
import { Repository } from 'typeorm';


@Injectable()
export class itensreqrecService {
  constructor(
    @InjectRepository(itensreqrecEntity, 'oracleConnection')
    private itensreqrecRepository: Repository<itensreqrecEntity>,
  ) {}  

  async findOne(ITE_ID_CODIGO: number) {
    try {
      return await this.itensreqrecRepository.findOneOrFail({
        where: { ITE_ID_CODIGO},
      });
    } catch (error) {
      throw new HttpException('Itens requeridos não encontrado', HttpStatus.NOT_FOUND);
    }
  }
 
}
